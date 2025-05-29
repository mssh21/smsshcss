import { generateDisplayClasses } from './display';
import { generateAllSpacingClasses, extractCustomSpacingClasses } from './spacing';
import { generateFlexboxClasses } from './flexbox';
import { extractCustomWidthClasses } from './width';

// Reset CSS の内容を直接定義
const RESET_CSS = `/* Reset CSS */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

a {
  color: inherit;
  text-decoration: none;
}

ul,
ol {
  list-style: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}`;

// Base CSS の内容を直接定義
const BASE_CSS = `/* Base CSS */
:root {
  --color-primary: #007bff;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  --color-light: #f8f9fa;
  --color-dark: #343a40;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  line-height: 1.5;
  color: var(--color-dark);
  background-color: #fff;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;
  line-height: 1.2;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

p {
  margin-top: 0;
  margin-bottom: 1rem;
}

a {
  color: var(--color-primary);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

img {
  max-width: 100%;
  height: auto;
}

button,
input,
optgroup,
select,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

button {
  cursor: pointer;
}

code {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
  color: var(--color-danger);
  background-color: var(--color-light);
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
}`;

// CSSファイルの内容を読み込む
export function getResetCss(): string {
  return RESET_CSS;
}

export function getBaseCss(): string {
  return BASE_CSS;
}

// ユーティリティクラスの生成
export function createUtilityClass(name: string, value: string): string {
  return `.${name} { ${value} }`;
}

export function createUtilityClasses(classes: Record<string, string>): string {
  return Object.entries(classes)
    .map(([name, value]) => createUtilityClass(name, value))
    .join('\n');
}

// ユーティリティクラスのマージ
export function mergeUtilityClasses(...classes: string[]): string {
  return classes.join('\n');
}

// リセットCSSの適用
export function applyResetCss(css: string): string {
  return `${getResetCss()}\n${css}`;
}

// ベースCSSの適用
export function applyBaseCss(css: string): string {
  return `${getBaseCss()}\n${css}`;
}

// ディスプレイとスペーシングのユーティリティをエクスポート
export {
  generateDisplayClasses,
  generateAllSpacingClasses,
  extractCustomSpacingClasses,
  extractCustomWidthClasses,
  generateFlexboxClasses,
};
