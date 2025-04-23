/**
 * Font Size Token
 */

const base = 12;
const ratio = 1.25;

export const fontSize = {
  base,

  tokens: {
    "xs": `${Math.round(base * ratio ** 0)}px`,  // 12
    "sm": `${Math.round(base * ratio ** 1)}px`,  // 15
    "md": `${Math.round(base * ratio ** 2)}px`,  // 19
    "lg": `${Math.round(base * ratio ** 3)}px`,  // 24
    "xl": `${Math.round(base * ratio ** 4)}px`,  // 32
    "2xl": `${Math.round(base * ratio ** 5)}px`, // 40
    "3xl": `${Math.round(base * ratio ** 6)}px`, // 50
    "4xl": `${Math.round(base * ratio ** 7)}px`, // 64
    "5xl": `${Math.round(base * ratio ** 8)}px`, // 80
    "6xl": `${Math.round(base * ratio ** 9)}px`, // 100
    "7xl": `${Math.round(base * ratio ** 10)}px`,// 128
    "8xl": `${Math.round(base * ratio ** 11)}px` // 160
  }
} as const;