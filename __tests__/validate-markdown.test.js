const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const DATA_DIR = path.resolve(__dirname, "../src/data");

function getMarkdownFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(full));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function relativePath(file) {
  return path.relative(DATA_DIR, file);
}

const allFiles = getMarkdownFiles(DATA_DIR);

describe("All markdown files have valid YAML frontmatter", () => {
  test.each(allFiles.map((f) => [relativePath(f), f]))(
    "%s parses without errors",
    (_name, file) => {
      const raw = fs.readFileSync(file, "utf-8");
      expect(() => matter(raw)).not.toThrow();

      const { data } = matter(raw);
      expect(data).toBeDefined();
      expect(typeof data).toBe("object");
    }
  );
});

const projectFiles = allFiles.filter((f) => f.includes("/projects/"));
const workFiles = allFiles.filter((f) => f.includes("/work-experience/"));

const VALID_CATEGORIES = [
  "design-systems",
  "nonprofit",
  "apps",
  "personal",
  "prototypes",
  "professional",
];

const INACTIVE_SLUGS = ["dlite-web-components", "listings-tracker"];
const SHIPPED_APP_SLUGS = ["try", "hablalora", "sneaks"];

describe("Project files have required frontmatter", () => {
  test.each(projectFiles.map((f) => [relativePath(f), f]))(
    "%s has valid project frontmatter",
    (_name, file) => {
      const { data } = matter(fs.readFileSync(file, "utf-8"));

      expect(data.title).toBeDefined();
      expect(typeof data.title).toBe("string");
      expect(data.title.length).toBeGreaterThan(0);

      expect(data.slug).toBeDefined();
      expect(typeof data.slug).toBe("string");
      expect(data.slug).toMatch(/^[a-z0-9-]+$/);

      expect(data.category).toBeDefined();
      expect(VALID_CATEGORIES).toContain(data.category);

      expect(data.role).toBeDefined();
      expect(typeof data.role).toBe("string");

      expect(data.date).toBeDefined();
      expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      expect(typeof data.selectedProject).toBe("boolean");

      if (data.active !== undefined) {
        expect(typeof data.active).toBe("boolean");
      }
    }
  );
});

describe("Shipped apps stay public, deactivated projects stay off", () => {
  function projectBySlug(slug) {
    const file = projectFiles.find((f) => {
      const { data } = matter(fs.readFileSync(f, "utf-8"));
      return data.slug === slug;
    });
    expect(file).toBeDefined();
    return matter(fs.readFileSync(file, "utf-8")).data;
  }

  test.each(INACTIVE_SLUGS)("%s is deactivated", (slug) => {
    expect(projectBySlug(slug).active).toBe(false);
  });

  test.each(SHIPPED_APP_SLUGS)("%s is a public App Store app with a webpage", (slug) => {
    const data = projectBySlug(slug);
    expect(data.active).not.toBe(false);
    expect(data.category).toBe("apps");
    expect(data.links.appstore).toMatch(/^https:\/\/apps\.apple\.com\//);
    expect(data.links.website || data.links.live).toMatch(/^https:\/\//);
  });
});

describe("Work experience files have required frontmatter", () => {
  test.each(workFiles.map((f) => [relativePath(f), f]))(
    "%s has valid work-experience frontmatter",
    (_name, file) => {
      const { data } = matter(fs.readFileSync(file, "utf-8"));

      expect(data.company).toBeDefined();
      expect(typeof data.company).toBe("string");

      expect(data.role).toBeDefined();
      expect(typeof data.role).toBe("string");

      expect(data.skills).toBeDefined();
      expect(Array.isArray(data.skills)).toBe(true);
      expect(data.skills.length).toBeGreaterThan(0);

      expect(data.time).toBeDefined();
      expect(typeof data.time).toBe("string");

      expect(data.order).toBeDefined();
      expect(typeof data.order).toBe("number");
    }
  );
});

describe("No duplicate slugs in project files", () => {
  test("all project slugs are unique", () => {
    const slugs = projectFiles.map((f) => {
      const { data } = matter(fs.readFileSync(f, "utf-8"));
      return data.slug;
    });
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    expect(duplicates).toEqual([]);
  });
});
