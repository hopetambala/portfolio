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

      const outFile = await captureGif(page, slug);

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
