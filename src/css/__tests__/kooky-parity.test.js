const fs = require('fs');
const path = require('path');

// These tests document the kooky dlite token values.
// Where noted, the current portfolio differs — those differences are intentional.
// Kooky dlite is treated as canonical; the portfolio will adopt its values.

describe('kooky dlite token values (canonical source of truth)', () => {
  let kookyCSS;

  const getVar = (css, name) => {
    const m = css.match(new RegExp(`${name}:\\s*([^;]+);`));
    return m ? m[1].trim() : null;
  };

  beforeAll(() => {
    const pkgPath = path.resolve(
      __dirname,
      '../../../node_modules/style-dictionary-dlite-tokens/dist/web/kooky/default/variables.css'
    );
    kookyCSS = fs.readFileSync(pkgPath, 'utf8');
  });

  test('font-heading is Recoleta (matches portfolio)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-typography-font-heading')).toBe('Recoleta');
  });

  test('text-primary is #161616 (matches portfolio neutral-900)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-text-primary')).toBe('#161616');
  });

  test('text-secondary is #464646 (matches portfolio neutral-700)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-text-secondary')).toBe('#464646');
  });

  test('border color exists', () => {
    // Portfolio used rgba(0,0,0,0.1); kooky dlite uses a hex value
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-border')).toBeTruthy();
  });

  // KNOWN DIVERGENCES — accepted as intentional:

  test('surface-base is #ffffff (portfolio used #f3f3f3 — nav/tag bg will be whiter)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-surface-base')).toBe('#ffffff');
  });

  test('background is #f7f7f7 (portfolio used teal hsl(167,100%,88%) — page bg will be neutral)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-background')).toBe('#f7f7f7');
  });

  test('secondary is #ffdd00 (portfolio used hsl(61,89%,58%) — yellow hover will be more saturated)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-secondary')).toBe('#ffdd00');
  });

  test('action-secondary is #ff0088 (portfolio used hsl(340,100%,75%) — nav hover will be hot pink)', () => {
    expect(getVar(kookyCSS, '--tk-dlite-semantic-color-action-secondary')).toBe('#ff0088');
  });
});
