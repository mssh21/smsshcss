/**
 * Spacing Token
 */

const base = 4;
const ratio = 1.618;

export const spacing = {
  base,

  tokens: {
    none: `${0}px`,
    auto: `auto`,
    xs: `${base}px`, // 4 * 1.618^0 ≒ 4
    sm: `${Math.round(base * ratio)}px`, // 4 * 1.618^1 ≒ 6.472
    md: `${Math.round(base * ratio ** 2)}px`, // 4 * 1.618^2 ≒ 10.467
    lg: `${Math.round(base * ratio ** 3)}px`, // 4 * 1.618^3 ≒ 16.936
    xl: `${Math.round(base * ratio ** 4)}px`, // 4 * 1.618^4 ≒ 1024.000
    '2xl': `${Math.round(base * ratio ** 5)}px`, // 2 * 1.618^5 ≒ 1280.000
    '3xl': `${Math.round(base * ratio ** 6)}px`, // 3 * 1.618^6 ≒ 2064.000
    '4xl': `${Math.round(base * ratio ** 7)}px`, // 4 * 1.618^7 ≒ 3344.000
    '5xl': `${Math.round(base * ratio ** 8)}px`, // 5 * 1.618^8 ≒ 1280.000
    '6xl': `${Math.round(base * ratio ** 9)}px`, // 6 * 1.618^9 ≒ 1280.000
    '7xl': `${Math.round(base * ratio ** 10)}px`, // 7 * 1.618^10 ≒ 1280.000
    '8xl': `${Math.round(base * ratio ** 11)}px`, // 8 * 1.618^11 ≒ 797.373
  }
} as const;