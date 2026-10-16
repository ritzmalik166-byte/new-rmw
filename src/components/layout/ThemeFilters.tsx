/* Dark mode colour transforms. `theme-night` inverts lightness, keeps hues, and
   cools the shadows so cream paper lands on a moonlit navy instead of brown.
   `theme-day` is its exact inverse, for media and surfaces that keep their paint. */
const NIGHT =
  "0.5623 -1.4693 -0.1479 0 1  -0.4222 -0.4171 -0.1427 0 1  -0.3961 -1.3299 0.8661 0 1  0 0 0 1 0";
const DAY =
  "0.5573 -1.486 -0.1497 0 1.0784  -0.427 -0.4332 -0.1443 0 1.0045  -0.4007 -1.345 0.8646 0 0.8811  0 0 0 1 0";

export function ThemeFilters() {
  return (
    <svg aria-hidden width="0" height="0" style={{ position: "absolute", width: 0, height: 0 }}>
      <filter id="theme-night" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={NIGHT} />
      </filter>
      <filter id="theme-day" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={DAY} />
      </filter>
    </svg>
  );
}
