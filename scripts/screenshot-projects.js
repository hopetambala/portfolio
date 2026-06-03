#!/usr/bin/env node
/**
 * screenshot-projects.js
 *
 * Uses Playwright to capture 6-second animated GIFs of each project's live URL.
 * For projects with access codes (listings-tracker, survivor-app) auth happens
 * silently before recording so the GIF shows only the authenticated app content.
 *
 * Output: static/images/projects/<slug>.gif
 * Frontmatter: each project's `image` field is updated to /images/projects/<slug>.gif
 *
 * Usage: npm run screenshot:projects
 */

const { chromium } = require("playwright");
const GIFEncoder = require("gif-encoder-2");
const { PNG } = require("pngjs");
const matter = require("gray-matter");
const fs = require("fs");
const path = require("path");

// ─── Config ────────────────────────────────────────────────────────────────

const PROJECTS_DIR = path.join(__dirname, "../src/data/projects");
const OUTPUT_DIR = path.join(__dirname, "../static/images/projects");
const VIEWPORT = { width: 960, height: 600 };

const FPS = 6;
const DURATION_SECONDS = 6;
const TOTAL_FRAMES = FPS * DURATION_SECONDS; // 36
const FRAME_DELAY_MS = Math.round(1000 / FPS); // ~167 ms

/**
 * Auth frame schedule for protected projects.
 * Auth happens silently before recording so the GIF shows only the
 * authenticated app content.
 */
const AUTH_CONFIGS = {
  "listings-tracker": "0812",
  "survivor-app": "1611",
};

// ─── Auth (runs before recording) ───────────────────────────────────────────

async function handleAuth(page, slug) {
  const code = AUTH_CONFIGS[slug];
  if (!code) return;

  const selectors = [
    'input[maxlength="4"]',
    'input[placeholder*="code" i]',
    'input[placeholder*="access" i]',
    'input[placeholder*="pin" i]',
    'input[type="password"]',
    'input[type="number"]',
    'input[type="text"]',
  ];

  for (const sel of selectors) {
    const el = await page.$(sel);
    if (el && (await el.isVisible())) {
      await el.click();
      await el.fill(code);
      const submitBtn = await page.$('button[type="submit"], button');
      if (submitBtn) {
        await submitBtn.click();
      } else {
        await page.keyboard.press("Enter");
      }
      await page.waitForTimeout(2500);
      return;
    }
  }

  // Fall back: 4 separate single-character inputs
  const digitInputs = await page.$$('input[maxlength="1"]');
  if (digitInputs.length >= 4) {
    for (let i = 0; i < 4; i++) {
      await digitInputs[i].click();
      await digitInputs[i].fill(code[i]);
    }
    await page.keyboard.press("Enter");
    await page.waitForTimeout(2500);
  }
}

// ─── GIF capture ────────────────────────────────────────────────────────────

async function captureGif(page, slug) {
  const outFile = path.join(OUTPUT_DIR, `${slug}.gif`);

  const encoder = new GIFEncoder(
    VIEWPORT.width,
    VIEWPORT.height,
    "neuquant",
    true,   // inter-frame optimiser → smaller files
    256
  );
  encoder.setRepeat(0);           // loop forever
  encoder.setDelay(FRAME_DELAY_MS);
  encoder.setQuality(25);         // 1 = best, 30 = fastest/smallest
  encoder.start();

  const scrollHeight = await page.evaluate(
    () => Math.max(document.body.scrollHeight - window.innerHeight, 0)
  );
  const scrollStartFrame = 3;
  const scrollEndFrame = TOTAL_FRAMES - 2;
  const scrollFrames = Math.max(scrollEndFrame - scrollStartFrame, 1);

  await page.evaluate(() => window.scrollTo(0, 0));

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    if (scrollHeight > 200 && i >= scrollStartFrame && i < scrollEndFrame) {
      const progress = (i - scrollStartFrame) / scrollFrames;
      const targetY = Math.round(scrollHeight * progress);
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        targetY
      );
    }

    const buffer = await page.screenshot({ type: "png" });
    const png = PNG.sync.read(buffer);
    encoder.addFrame(png.data);
  }

  encoder.finish();
  fs.writeFileSync(outFile, encoder.out.getData());
  return outFile;
}

// ─── Custom captures ────────────────────────────────────────────────────────
//
// For projects where the interesting content requires specific interactions
// (not just scroll). Each handler receives the already-navigated `page` and
// the destination `outFile` path. Must return `outFile`.
//
// To add a new project: add a key matching the markdown slug.

function makeEncoder(width, height, fps) {
  const encoder = new GIFEncoder(width, height, "neuquant", true, 256);
  encoder.setRepeat(0);
  encoder.setDelay(Math.round(1000 / fps));
  encoder.setQuality(25);
  encoder.start();
  return encoder;
}

async function addFrames(page, encoder, count, intervalMs) {
  for (let i = 0; i < count; i++) {
    const buf = await page.screenshot({ type: "png" });
    encoder.addFrame(PNG.sync.read(buf).data);
    if (i < count - 1) await page.waitForTimeout(intervalMs);
  }
}

const CUSTOM_CAPTURES = {
  /**
   * collage-etsy — https://www.etsy.com
   *
   * Shows Etsy's marketplace (Collage design system in production).
   * Visits homepage, scrolls to product listing area, then a search results
   * page to show the grid components at scale.
   * Re-run: npm run screenshot:projects -- --only=collage-etsy
   */
  // browser is passed as the third arg so we can open a stealth context.
  "collage-etsy": async (_defaultPage, outFile, browser) => {
    // Etsy's bot detection blocks stock headless Chromium. Open a dedicated
    // context with a real Mac/Chrome UA and the `AutomationControlled` feature
    // disabled, then spoof `navigator.webdriver` via init script.
    const ctx = await browser.newContext({
      viewport: VIEWPORT,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
        "AppleWebKit/537.36 (KHTML, like Gecko) " +
        "Chrome/124.0.0.0 Safari/537.36",
      locale: "en-US",
      timezoneId: "America/New_York",
      extraHTTPHeaders: {
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    // Hide the `navigator.webdriver` flag that headless browsers expose.
    await ctx.addInitScript(
      "Object.defineProperty(navigator,'webdriver',{get:()=>undefined})"
    );
    const p = await ctx.newPage();

    const encoder = makeEncoder(VIEWPORT.width, VIEWPORT.height, FPS);

    const scroll = async (target, steps) => {
      for (let i = 1; i <= steps; i++) {
        await target.evaluate(
          (y) => window.scrollTo({ top: y, behavior: "instant" }),
          Math.round((800 * i) / steps)
        );
        await addFrames(p, encoder, 1, 0);
        await p.waitForTimeout(95);
      }
    };

    // ── 1. Homepage ──────────────────────────────────────────────────────────
    try {
      await p.goto("https://www.etsy.com", { waitUntil: "load", timeout: 35000 });
    } catch {
      await p.goto("https://www.etsy.com", { waitUntil: "domcontentloaded", timeout: 20000 });
    }
    await p.waitForTimeout(2000);

    // Dismiss any cookie / location banner so it doesn't block the UI.
    for (const sel of [
      'button[data-gdpr-single-choice-accept]',
      'button:has-text("Accept")',
      'button:has-text("Decline")',
      '[aria-label="Close"]',
    ]) {
      const btn = p.locator(sel).first();
      if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
        await btn.click().catch(() => {});
        await p.waitForTimeout(500);
        break;
      }
    }

    await addFrames(p, encoder, 5, 160);
    await scroll(p, 9);
    await addFrames(p, encoder, 5, 160);

    // ── 2. Search results — product card grid ────────────────────────────────
    try {
      await p.goto(
        "https://www.etsy.com/search?q=handmade+ceramic+mug",
        { waitUntil: "load", timeout: 30000 }
      );
    } catch {
      await p.goto(
        "https://www.etsy.com/search?q=handmade+ceramic+mug",
        { waitUntil: "domcontentloaded", timeout: 20000 }
      );
    }
    await p.waitForTimeout(2000);
    await addFrames(p, encoder, 5, 160);
    await scroll(p, 9);
    await addFrames(p, encoder, 5, 160);

    encoder.finish();
    fs.writeFileSync(outFile, encoder.out.getData());
    await ctx.close();
    return outFile;
  },

  /**
   * commonplace-cityblock — https://commonplace.design (Storybook)
   *
   * Walks three component/foundation docs pages, scrolling a little in each.
   * Scrolls the Storybook PREVIEW IFRAME (the manager chrome doesn't scroll).
   * Re-run: npm run screenshot:projects -- --only=commonplace-cityblock
   */
  "commonplace-cityblock": async (page, outFile) => {
    const encoder = makeEncoder(VIEWPORT.width, VIEWPORT.height, FPS);

    const stops = [
      "https://commonplace.design/?path=/docs/tables-table-v2--overview",
      "https://commonplace.design/?path=/docs/inputs-checkboxgroup--overview",
      "https://commonplace.design/?path=/docs/foundations-accessibility-email--overview",
    ];

    for (const url of stops) {
      await navigate(page, url);
      await page.waitForTimeout(3000); // let Storybook + preview iframe render

      // The docs render inside #storybook-preview-iframe; scroll THAT frame.
      const frame =
        page.frames().find((f) => /iframe\.html/.test(f.url())) || null;
      const target = frame || page;

      // Hold at the top of the page for a beat.
      await addFrames(page, encoder, 5, 160);

      // Scroll "a little" — up to ~650px (or less if the doc is short).
      const maxScroll = await target
        .evaluate(() =>
          Math.max(document.body.scrollHeight - window.innerHeight, 0)
        )
        .catch(() => 0);
      const distance = Math.min(maxScroll, 650);
      const steps = 7;
      for (let s = 1; s <= steps; s++) {
        const y = Math.round((distance * s) / steps);
        await target
          .evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y)
          .catch(() => {});
        await addFrames(page, encoder, 1, 0);
        await page.waitForTimeout(110);
      }

      // Settle on the scrolled view.
      await addFrames(page, encoder, 3, 160);
    }

    encoder.finish();
    fs.writeFileSync(outFile, encoder.out.getData());
    return outFile;
  },

  /**
   * stakeout — https://stakeout.vercel.app/
   *
   * Shows: landing → editor → sample property → fence drag → 3D toggle
   * Re-run: npm run screenshot:projects -- --only=stakeout
   */
  stakeout: async (page, outFile) => {
    const W = VIEWPORT.width;
    const H = VIEWPORT.height;
    const encoder = makeEncoder(W, H, FPS);

    // 1. Landing (~1 s)
    await addFrames(page, encoder, 6, 160);

    // 2. Navigate to editor
    const ctaSelectors = [
      'a[href*="editor"]',
      'button:has-text("Start designing")',
      'button:has-text("Try it")',
      'button:has-text("Open")',
      'a:has-text("Start designing")',
    ];
    let navigated = false;
    for (const sel of ctaSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible().catch(() => false)) {
        await el.click();
        navigated = true;
        break;
      }
    }
    if (!navigated) {
      await page.goto(page.url().replace(/\/?$/, "") + "?p=editor", {
        waitUntil: "networkidle",
        timeout: 20000,
      });
    }
    await page.waitForTimeout(1800);
    await addFrames(page, encoder, 4, 160);

    // 3. Load sample property
    const sampleBtn = page.locator(
      'button.btn--sample, button:has-text("sample"), button:has-text("Sample")'
    );
    if (await sampleBtn.first().isVisible().catch(() => false)) {
      await sampleBtn.first().click();
      await page.waitForTimeout(2200);
    }
    await addFrames(page, encoder, 6, 160);

    // 4. Drag a fence element onto the canvas
    const fenceEl = page
      .locator('[data-def-id*="fence"], .element-tile:has-text("Fence")')
      .first();
    const canvas = page.locator("canvas").first();
    if (
      (await fenceEl.isVisible().catch(() => false)) &&
      (await canvas.isVisible().catch(() => false))
    ) {
      const fb = await fenceEl.boundingBox();
      const cb = await canvas.boundingBox();
      if (fb && cb) {
        await page.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
        await page.mouse.down();
        await page.waitForTimeout(250);
        const tx = cb.x + cb.width * 0.55;
        const ty = cb.y + cb.height * 0.45;
        await page.mouse.move(tx, ty, { steps: 18 });
        await page.mouse.up();
        await page.waitForTimeout(1000);
      }
    }
    await addFrames(page, encoder, 6, 160);

    // 5. Toggle 3D view
    const threeDBtn = page
      .locator('button:has-text("3D"), button:has-text("Live 3D"), [title*="3D"]')
      .first();
    if (await threeDBtn.isVisible().catch(() => false)) {
      await threeDBtn.click();
      await page.waitForTimeout(2200);
    }
    await addFrames(page, encoder, 10, 160);

    encoder.finish();
    fs.writeFileSync(outFile, encoder.out.getData());
    return outFile;
  },
};

// ─── Frontmatter updater ────────────────────────────────────────────────────

function updateImageField(filePath, slug) {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  parsed.data.image = `/images/projects/${slug}.gif`;
  fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
}

// ─── Main ───────────────────────────────────────────────────────────────────

// Optional: npm run screenshot:projects -- --only=listings-tracker,survivor-app
const onlyFilter = (() => {
  const flag = process.argv.find((a) => a.startsWith("--only="));
  return flag ? flag.replace("--only=", "").split(",").map((s) => s.trim()) : null;
})();

async function navigate(page, url) {
  try {
    await page.goto(url, { waitUntil: "load", timeout: 30000 });
  } catch {
    // Fallback for sites with persistent background network activity
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000); // brief settle time
  }
}

async function run() {
  const mdFiles = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => path.join(PROJECTS_DIR, f));

  let targets = [];
  for (const filePath of mdFiles) {
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    if (data.links?.live) {
      targets.push({ filePath, slug: data.slug, url: data.links.live });
    }
  }

  if (onlyFilter) {
    targets = targets.filter(({ slug }) => onlyFilter.includes(slug));
    console.log(`Running only: ${onlyFilter.join(", ")}`);
  }

  if (!targets.length) {
    console.log("No projects with live URLs found.");
    return;
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize(VIEWPORT);

  for (const { filePath, slug, url } of targets) {
    console.log(`🎬  ${slug}  →  ${url}`);
    try {
      await navigate(page, url);

      // Authenticate silently before recording starts
      await handleAuth(page, slug);

      const customCapture = CUSTOM_CAPTURES[slug];
      const outFile = customCapture
        ? await customCapture(page, path.join(OUTPUT_DIR, `${slug}.gif`), browser)
        : await captureGif(page, slug);

      updateImageField(filePath, slug);

      const sizeKB = Math.round(fs.statSync(outFile).size / 1024);
      console.log(`   ✓  ${path.relative(process.cwd(), outFile)}  (${sizeKB} KB)`);
    } catch (err) {
      console.error(`   ✗  ${slug}: ${err.message}`);
    }
  }

  await browser.close();
  console.log("\nDone! Re-run `gatsby develop` to pick up the new GIFs.");
}

run();
