import { useEffect, useLayoutEffect, useState } from "react";

// Must match `grid-auto-rows` in journal-post.module.css.
const ROW_PX = 4;
// A feature may only sit on two columns whose bottoms are this close (px),
// so it never leaves a visible hole under the shorter one.
const FEATURE_TOLERANCE_PX = 56;
const DEFAULT_SIZES = "(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw";
const FEATURE_SIZES = "(max-width: 900px) 100vw, 66vw";

// useLayoutEffect warns during Gatsby's server render; in the browser it lets
// us lay out before the first paint.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function readCols(el) {
  const cols = parseInt(
    getComputedStyle(el).getPropertyValue("--masonry-cols"),
    10
  );
  return Number.isFinite(cols) && cols > 0 ? cols : 1;
}

const rowsFor = (tile, height) =>
  Math.ceil(
    (height + (parseFloat(getComputedStyle(tile).marginBottom) || 0)) / ROW_PX
  );

// Place tiles in order: each goes into the shortest column (so the gallery
// reads left to right in capture order), unless it's a chosen feature that
// fits across two columns of nearly equal height.
function place(tiles, heightsInRows, featureAt, cols, toleranceRows) {
  const colHeights = new Array(cols).fill(0);
  const placements = [];
  tiles.forEach((tile, i) => {
    const rows = heightsInRows(i);
    let pair = -1;
    if (featureAt(i) && cols >= 2) {
      let best = Infinity;
      for (let c = 0; c < cols - 1; c++) {
        const top = Math.max(colHeights[c], colHeights[c + 1]);
        const gap = Math.abs(colHeights[c] - colHeights[c + 1]);
        if (gap <= toleranceRows && top < best) {
          best = top;
          pair = c;
        }
      }
    }
    if (pair >= 0) {
      const top = Math.max(colHeights[pair], colHeights[pair + 1]);
      placements.push({ col: pair, span: 2, row: top, rows: rows.wide });
      colHeights[pair] = colHeights[pair + 1] = top + rows.wide;
    } else {
      const col = colHeights.indexOf(Math.min(...colHeights));
      placements.push({ col, span: 1, row: colHeights[col], rows: rows.narrow });
      colHeights[col] += rows.narrow;
    }
  });
  return placements;
}

// Masonry that keeps photos in capture order but varies its arrangement per
// visit: a random handful of landscape photos become two-column features,
// which changes how everything below them packs. Photo sizes are reserved up
// front, so this runs once (and on width changes), never on image load.
//
// Until it runs, the server-rendered CSS-columns gallery shows as-is.
export function useVariedMasonry(ref, sizes, readyClass) {
  const [rolls, setRolls] = useState(null);

  useEffect(() => {
    setRolls(sizes.map(() => Math.random()));
    // Re-roll only when the post changes, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizes.length]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || !rolls) return undefined;

    const layout = () => {
      const cols = readCols(el);
      const tiles = [...el.children];
      el.classList.add(readyClass);

      // Candidate features: landscape photos, rolled per visit, spaced out.
      // Many candidates get skipped in placement when no flat spot exists.
      const chance = cols >= 3 ? 0.4 : 0.25;
      let last = -Infinity;
      const candidate = sizes.map((size, i) => {
        const landscape =
          size?.width && size?.height && size.width / size.height >= 1.3;
        const pick = cols >= 2 && landscape && rolls[i] < chance && i - last > 3;
        if (pick) last = i;
        return pick;
      });

      // Measure every tile's real height at one column wide, and candidates
      // again at two columns wide, so placement works from exact numbers.
      for (const tile of tiles) {
        tile.style.gridColumn = "1 / span 1";
        tile.style.gridRow = "1 / span 1";
      }
      const narrow = tiles.map((tile) => rowsFor(tile, tile.offsetHeight));
      tiles.forEach((tile, i) => {
        if (candidate[i]) tile.style.gridColumn = "1 / span 2";
      });
      const wide = tiles.map((tile, i) =>
        candidate[i] ? rowsFor(tile, tile.offsetHeight) : narrow[i]
      );

      const tolerance = Math.round(FEATURE_TOLERANCE_PX / ROW_PX);
      const placements = place(
        tiles,
        (i) => ({ narrow: narrow[i], wide: wide[i] }),
        (i) => candidate[i],
        cols,
        tolerance
      );

      tiles.forEach((tile, i) => {
        const p = placements[i];
        const feature = p.span === 2;
        tile.style.gridColumn = `${p.col + 1} / span ${p.span}`;
        tile.style.gridRow = `${p.row + 1} / span ${p.rows}`;
        tile.dataset.feature = feature ? "true" : "false";
        const img = tile.querySelector("img");
        if (img) img.sizes = feature ? FEATURE_SIZES : DEFAULT_SIZES;
      });
    };

    layout();

    let width = el.clientWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(layout);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [ref, rolls, readyClass]);
}
