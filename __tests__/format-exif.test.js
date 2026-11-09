const { formatExif } = require("../src/components/journal-post/format-exif");

describe("formatExif", () => {
  test("formats a full Sony a6000 record", () => {
    expect(
      formatExif({
        Make: "SONY",
        Model: "ILCE-6000",
        LensModel: "18-50mm F2.8 DC DN | Contemporary 021",
        FNumber: 2.8,
        ExposureTime: 0.004,
        ISO: 100,
        FocalLength: 35,
      })
    ).toBe("Sony α6000 · Sigma 18–50mm f/2.8 · 35mm · f/2.8 · 1/250s · ISO 100");
  });

  test("handles long exposures and unknown lenses", () => {
    expect(
      formatExif({
        Make: "SONY",
        Model: "ILCE-6000",
        LensModel: "Some New Lens 50mm",
        FNumber: 2,
        ExposureTime: 15,
        ISO: 3200,
        FocalLength: 12,
      })
    ).toBe("Sony α6000 · Some New Lens 50mm · 12mm · f/2 · 15s · ISO 3200");
  });

  test("drops the redundant phone lens string", () => {
    expect(
      formatExif({
        Make: "Apple",
        Model: "iPhone 15 Pro Max",
        LensModel: "iPhone 15 Pro Max back triple camera 6.765mm f/1.78",
        FNumber: 1.78,
        ExposureTime: 1 / 120,
        ISO: 64,
        FocalLength: 6.765,
      })
    ).toBe("iPhone 15 Pro Max · 7mm · f/1.8 · 1/120s · ISO 64");
  });

  test("prefixes the make for unmapped cameras", () => {
    expect(formatExif({ Make: "FUJIFILM", Model: "X-T5" })).toBe("FUJIFILM X-T5");
  });

  test("returns null when there is nothing to show", () => {
    expect(formatExif(null)).toBeNull();
    expect(formatExif({})).toBeNull();
  });
});
