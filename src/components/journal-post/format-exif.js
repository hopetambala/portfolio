// Turns raw EXIF (Sanity's field names) into a short camera caption, e.g.
// "Sony α6000 · Sigma 18–50mm f/2.8 · 35mm · f/2.8 · 1/250s · ISO 100".
// CommonJS so Jest can load it without a Babel setup.

const CAMERAS = {
  "ILCE-6000": "Sony α6000",
};

// Exact lens strings as the camera writes them → how they read in a caption.
const LENSES = {
  "E 70-350mm F4.5-6.3 G OSS": "Sony 70–350mm f/4.5–6.3 G",
  "18-50mm F2.8 DC DN | Contemporary 021": "Sigma 18–50mm f/2.8",
  "30mm F1.4 DC DN | Contemporary 016": "Sigma 30mm f/1.4",
  "SAMYANG AF 12mm F2.0": "Samyang 12mm f/2",
  "E PZ 16-50mm F3.5-5.6 OSS": "Sony 16–50mm f/3.5–5.6",
  "TTARTISAN 56mm F1.8": "TTArtisan 56mm f/1.8",
};

const trimNumber = (n) => String(Number(n.toFixed(1)));

function formatCamera(make, model) {
  if (!model) return null;
  if (CAMERAS[model]) return CAMERAS[model];
  // Phones put the brand in the model already ("iPhone 15 Pro Max").
  if (/^iphone/i.test(model)) return model;
  if (make && !model.toLowerCase().startsWith(make.toLowerCase())) {
    return `${make} ${model}`;
  }
  return model;
}

function formatLens(lens, model) {
  if (!lens) return null;
  if (LENSES[lens]) return LENSES[lens];
  // Phone lenses read like "iPhone 15 Pro Max back triple camera 6.765mm f/1.78";
  // the camera name already covers it.
  if (model && lens.toLowerCase().startsWith(model.toLowerCase())) return null;
  return lens;
}

function formatShutter(seconds) {
  if (!seconds || seconds <= 0) return null;
  if (seconds >= 1) return `${trimNumber(seconds)}s`;
  return `1/${Math.round(1 / seconds)}s`;
}

function formatExif(exif) {
  if (!exif) return null;
  const { Make, Model, LensModel, FNumber, ExposureTime, ISO, FocalLength } =
    exif;
  const parts = [
    formatCamera(Make, Model),
    formatLens(LensModel, Model),
    FocalLength ? `${Math.round(FocalLength)}mm` : null,
    FNumber ? `f/${trimNumber(FNumber)}` : null,
    formatShutter(ExposureTime),
    ISO ? `ISO ${ISO}` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

module.exports = { formatExif };
