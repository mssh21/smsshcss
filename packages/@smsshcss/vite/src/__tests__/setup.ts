import { vi } from 'vitest';

// SmsshCSSの設定の型定義
interface SmsshCSSConfig {
  content?: string[];
  includeResetCSS?: boolean;
  includeBaseCSS?: boolean;
  apply?: Record<string, string>;
  purge?: {
    enabled?: boolean;
    content?: string[];
    safelist?: (string | RegExp)[];
    blocklist?: string[];
  };
}

// ユーティリティクラスをCSSプロパティに変換する関数
const parseUtilityClasses = (utilityClasses: string, config: SmsshCSSConfig): string => {
  const classes = utilityClasses.split(/\s+/).filter(Boolean);
  const cssProperties: string[] = [];

  for (const className of classes) {
    const cssProperty = parseUtilityClass(className, config);
    if (cssProperty) {
      cssProperties.push(cssProperty);
    }
  }

  return cssProperties.length > 0 ? `\n  ${cssProperties.join('\n  ')}` : '';
};

// 単一のユーティリティクラスをCSSプロパティに変換
const parseUtilityClass = (className: string, config: SmsshCSSConfig): string | null => {
  // カスタム値 [value] の処理
  const customValueMatch = className.match(/^(.+)-\[([^\]]+)\]$/);
  if (customValueMatch) {
    const [, prefix, value] = customValueMatch;
    // カスタム値の場合は値をそのまま使用
    let cleanValue = value;
    // カンマ付きのCSS関数を適切にフォーマット
    if (value.includes('rgb') || value.includes('hsl')) {
      cleanValue = value.replace(/,/g, ', ');
    }
    return parseUtilityWithValue(prefix, cleanValue);
  }

  // テーマ値の処理 - font-sizeのような複数ハイフンプレフィックスを考慮
  let themeMatch = className.match(/^(font-size)-(.+)$/);
  if (!themeMatch) {
    // 他のクラスは最初のハイフンで分割
    themeMatch = className.match(/^([^-]+)-(.+)$/);
  }

  if (themeMatch) {
    const [, prefix, suffix] = themeMatch;

    // テーマから値を取得
    const themeValue = getThemeValue(prefix, suffix, config);
    if (themeValue) {
      return parseUtilityWithValue(prefix, themeValue);
    }

    // デフォルト値で処理
    return parseUtilityWithDefaultValue(prefix, suffix);
  }

  // 単純なクラス名の処理
  return parseSimpleUtilityClass(className);
};

// プレフィックスと値からCSSプロパティを生成
const parseUtilityWithValue = (prefix: string, value: string): string | null => {
  switch (prefix) {
    // Margin
    case 'm':
      return `margin: ${value};`;
    case 'mx':
      return `margin-left: ${value}; margin-right: ${value};`;
    case 'my':
      return `margin-top: ${value}; margin-bottom: ${value};`;
    case 'mt':
      return `margin-top: ${value};`;
    case 'mr':
      return `margin-right: ${value};`;
    case 'mb':
      return `margin-bottom: ${value};`;
    case 'ml':
      return `margin-left: ${value};`;

    // Padding
    case 'p':
      return `padding: ${value};`;
    case 'px':
      return `padding-left: ${value}; padding-right: ${value};`;
    case 'py':
      return `padding-top: ${value}; padding-bottom: ${value};`;
    case 'pt':
      return `padding-top: ${value};`;
    case 'pr':
      return `padding-right: ${value};`;
    case 'pb':
      return `padding-bottom: ${value};`;
    case 'pl':
      return `padding-left: ${value};`;

    // Width
    case 'w':
      return `width: ${value};`;
    case 'min-w':
      return `min-width: ${value};`;
    case 'max-w':
      return `max-width: ${value};`;

    // Height
    case 'h':
      return `height: ${value};`;
    case 'min-h':
      return `min-height: ${value};`;
    case 'max-h':
      return `max-height: ${value};`;

    // Gap
    case 'gap':
      return `gap: ${value};`;
    case 'gap-x':
      return `column-gap: ${value};`;
    case 'gap-y':
      return `row-gap: ${value};`;

    // Z-index
    case 'z':
      return `z-index: ${value};`;

    // Order
    case 'order':
      return `order: ${value};`;

    // Color
    case 'text':
      return `color: ${value};`;
    case 'bg':
      return `background-color: ${value};`;
    case 'border':
      return `border-color: ${value};`;
    case 'fill':
      return `fill: ${value};`;

    // Font size
    case 'font-size':
      return `font-size: ${value};`;

    default:
      return null;
  }
};

// テーマから値を取得
const getThemeValue = (prefix: string, suffix: string, config: SmsshCSSConfig): string | null => {
  const theme = config.theme;
  if (!theme) return null;

  // Spacing
  if (
    [
      'm',
      'mx',
      'my',
      'mt',
      'mr',
      'mb',
      'ml',
      'p',
      'px',
      'py',
      'pt',
      'pr',
      'pb',
      'pl',
      'gap',
      'gap-x',
      'gap-y',
    ].includes(prefix)
  ) {
    return theme.spacing?.[suffix] || null;
  }

  // Width
  if (['w', 'min-w', 'max-w'].includes(prefix)) {
    return theme.width?.[suffix] || null;
  }

  // Height
  if (['h', 'min-h', 'max-h'].includes(prefix)) {
    return theme.height?.[suffix] || null;
  }

  // Z-index
  if (prefix === 'z') {
    return theme.zIndex?.[suffix] || null;
  }

  // Order
  if (prefix === 'order') {
    return theme.order?.[suffix] || null;
  }

  // Color
  if (['text', 'bg', 'border', 'fill'].includes(prefix)) {
    return theme.color?.[suffix] || null;
  }

  return null;
};

// デフォルト値で処理
const parseUtilityWithDefaultValue = (prefix: string, suffix: string): string | null => {
  // カラーマッピング
  const colorMap: Record<string, string> = {
    'red-500': 'hsl(358 85% 55% / 1)',
    'red-600': 'hsl(358 90% 45% / 1)',
    'red-800': 'hsl(358 100% 25% / 1)',
    'red-100': 'hsl(358 100% 95% / 1)',
    'red-300': 'hsl(358 85% 75% / 1)',
    'blue-500': 'hsl(214 85% 55% / 1)',
    'blue-600': 'hsl(214 90% 45% / 1)',
    'purple-500': 'hsl(280 85% 55% / 1)',
    'yellow-100': 'hsl(55 100% 95% / 1)',
    'yellow-500': 'hsl(55 90% 50% / 1)',
    'yellow-600': 'hsl(55 85% 40% / 1)',
    'gray-900': 'hsl(210 6% 10% / 1)',
    white: 'hsl(0 0% 100% / 1)',
    black: 'hsl(0 0% 0% / 1)',
  };

  // カラークラス処理
  if (prefix === 'text' && colorMap[suffix]) {
    return `color: ${colorMap[suffix]};`;
  }
  if (prefix === 'bg' && colorMap[suffix]) {
    return `background-color: ${colorMap[suffix]};`;
  }
  if (prefix === 'border' && colorMap[suffix]) {
    return `border-color: ${colorMap[suffix]};`;
  }

  // Font-sizeマッピング
  const fontSizeMap: Record<string, string> = {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.25rem',
    '4xl': '2.75rem',
  };

  if (prefix === 'font-size' && fontSizeMap[suffix]) {
    return `font-size: ${fontSizeMap[suffix]};`;
  }

  // デフォルトサイズマッピング
  const sizeMap: Record<string, string> = {
    auto: 'auto',
    xs: 'calc(var(--space-base) * 2)',
    sm: 'calc(var(--space-base) * 3)',
    md: 'calc(var(--space-base) * 5)',
    lg: 'calc(var(--space-base) * 8)',
    xl: 'calc(var(--space-base) * 13)',
    full: '100%',
    screen: '100vw',
  };

  const value = sizeMap[suffix];
  if (value) {
    return parseUtilityWithValue(prefix, value);
  }

  // 数値サフィックスの処理
  if (/^\d+$/.test(suffix)) {
    const numValue = parseInt(suffix);
    const calcValue = `calc(var(--space-base) * ${numValue})`;
    return parseUtilityWithValue(prefix, calcValue);
  }

  return null;
};

// 単純なクラス名の処理
const parseSimpleUtilityClass = (className: string): string | null => {
  switch (className) {
    // Display
    case 'block':
      return 'display: block;';
    case 'inline':
      return 'display: inline;';
    case 'inline-block':
      return 'display: inline-block;';
    case 'flex':
      return 'display: flex;';
    case 'grid':
      return 'display: grid;';
    case 'hidden':
      return 'display: none;';

    // Flexbox
    case 'justify-center':
      return 'justify-content: center;';
    case 'justify-start':
      return 'justify-content: flex-start;';
    case 'justify-end':
      return 'justify-content: flex-end;';
    case 'justify-between':
      return 'justify-content: space-between;';
    case 'justify-around':
      return 'justify-content: space-around;';
    case 'items-center':
      return 'align-items: center;';
    case 'items-start':
      return 'align-items: flex-start;';
    case 'items-end':
      return 'align-items: flex-end;';
    case 'flex-col':
      return 'flex-direction: column;';
    case 'flex-row':
      return 'flex-direction: row;';

    // Position
    case 'absolute':
      return 'position: absolute;';
    case 'relative':
      return 'position: relative;';
    case 'fixed':
      return 'position: fixed;';
    case 'static':
      return 'position: static;';
    case 'sticky':
      return 'position: sticky;';

    default:
      return null;
  }
};

// 共通のCSS生成関数
const generateMockCSS = (config: SmsshCSSConfig): string => {
  let css = '';

  // Reset CSS
  if (config.includeResetCSS !== false) {
    css += '\n/* Reset CSS */\n* { margin: 0; padding: 0; }';
  }

  // Base CSS
  if (config.includeBaseCSS !== false) {
    css += '\n/* Base CSS */\nbody { font-family: sans-serif; }';
  }

  // SmsshCSS Generated Styles
  css += '\n/* SmsshCSS Generated Styles */';
  css += '\n.m-md { margin: calc(var(--space-base) * 5); }';
  css += '\n.mt-lg { margin-top: calc(var(--space-base) * 8); }';
  css +=
    '\n.mx-sm { margin-left: calc(var(--space-base) * 3); margin-right: calc(var(--space-base) * 3); }';
  css += '\n.p-md { padding: calc(var(--space-base) * 5); }';
  css += '\n.p-lg { padding: calc(var(--space-base) * 8); }';
  css += '\n.pt-lg { padding-top: calc(var(--space-base) * 8); }';
  css +=
    '\n.px-sm { padding-left: calc(var(--space-base) * 3); padding-right: calc(var(--space-base) * 3); }';
  css += '\n.gap-md { gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-x-md { column-gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-y-md { row-gap: calc(var(--space-base) * 5); }';
  css += '\n.gap-x-lg { column-gap: calc(var(--space-base) * 8); }';
  css += '\n.gap-y-lg { row-gap: calc(var(--space-base) * 8); }';
  css += '\n.gap-xl { gap: calc(var(--space-base) * 13); }';
  css += '\n.flex { display: flex; }';
  css += '\n.grid { display: grid; }';

  // Width classes - 全サイズをCSS変数形式で生成
  css += '\n.w-2xs { width: var(--size-base); }';
  css += '\n.w-xs { width: calc(var(--size-base) * 1.5); }';
  css += '\n.w-sm { width: calc(var(--size-base) * 2); }';
  css += '\n.w-md { width: calc(var(--size-base) * 2.5); }';
  css += '\n.w-lg { width: calc(var(--size-base) * 3); }';
  css += '\n.w-xl { width: calc(var(--size-base) * 4); }';
  css += '\n.w-screen { width: 100vw; }';
  css += '\n.w-full { width: 100%; }';
  css += '\n.min-w-2xs { min-width: var(--size-base); }';
  css += '\n.min-w-lg { min-width: calc(var(--size-base) * 3); }';
  css += '\n.max-w-2xs { max-width: var(--size-base); }';
  css += '\n.max-w-lg { max-width: calc(var(--size-base) * 3); }';

  // Height classes - 全サイズをCSS変数形式で生成
  css += '\n.h-2xs { height: var(--size-base); }';
  css += '\n.h-xs { height: calc(var(--size-base) * 1.5); }';
  css += '\n.h-sm { height: calc(var(--size-base) * 2); }';
  css += '\n.h-md { height: calc(var(--size-base) * 2.5); }';
  css += '\n.h-lg { height: calc(var(--size-base) * 3); }';
  css += '\n.h-xl { height: calc(var(--size-base) * 4); }';
  css += '\n.h-screen { height: 100vh; }';
  css += '\n.h-full { height: 100%; }';
  css += '\n.min-h-2xs { min-height: var(--size-base); }';
  css += '\n.min-h-lg { min-height: calc(var(--size-base) * 3); }';
  css += '\n.max-h-2xs { max-height: var(--size-base); }';
  css += '\n.max-h-lg { max-height: calc(var(--size-base) * 3); }';

  // Modern CSS units for compatibility tests
  css += '\n.h-dvh { height: 100dvh; }';
  css += '\n.w-dvw { width: 100dvw; }';

  // SmsshCSS Generated Styles
  css += '\n.w-full { width: 100%; }';
  css += '\n.h-md { height: calc(var(--size-base) * 5); }';
  css += '\n.h-lg { height: calc(var(--size-base) * 8); }';
  css += '\n.min-h-md { min-height: calc(var(--size-base) * 5); }';
  css += '\n.min-h-lg { min-height: calc(var(--size-base) * 8); }';
  css += '\n.max-h-md { max-height: calc(var(--size-base) * 5); }';
  css += '\n.max-h-lg { max-height: calc(var(--size-base) * 8); }';

  // Grid classes
  css += '\n.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }';
  css += '\n.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }';
  css += '\n.grid-rows-1 { grid-template-rows: repeat(1, minmax(0, 1fr)); }';
  css += '\n.grid-rows-2 { grid-template-rows: repeat(2, minmax(0, 1fr)); }';
  css += '\n.col-span-3 { grid-column: span 3 / span 3; }';
  css += '\n.row-span-1 { grid-row: span 1 / span 1; }';
  css += '\n.col-start-4 { grid-column-start: 4; }';
  css += '\n.row-start-4 { grid-row-start: 4; }';
  css += '\n.col-end-4 { grid-column-end: 4; }';
  css += '\n.grid-flow-row { grid-auto-flow: row; }';

  // Flexbox classes
  css += '\n.flex-row { flex-direction: row; }';
  css += '\n.flex-col { flex-direction: column; }';
  css += '\n.flex-row-reverse { flex-direction: row-reverse; }';
  css += '\n.flex-col-reverse { flex-direction: column-reverse; }';
  css += '\n.flex-wrap { flex-wrap: wrap; }';
  css += '\n.flex-wrap-reverse { flex-wrap: wrap-reverse; }';
  css += '\n.flex-grow { flex-grow: 1; }';
  css += '\n.flex-shrink { flex-shrink: 1; }';
  css += '\n.flex-1 { flex: 1 1 0%; }';
  css += '\n.flex-auto { flex: 1 1 auto; }';
  css += '\n.flex-basis-auto { flex-basis: auto; }';
  css += '\n.flex-basis-full { flex-basis: 100%; }';
  css += '\n.flex-basis-sm { flex-basis: calc(var(--size-base) * 2); }';

  // Order classes
  css += '\n.order-1 { order: 1; }';
  css += '\n.order-2 { order: 2; }';
  css += '\n.order-3 { order: 3; }';
  css += '\n.order-4 { order: 4; }';
  css += '\n.order-5 { order: 5; }';
  css += '\n.order-first { order: -9999; }';
  css += '\n.order-last { order: 9999; }';
  css += '\n.order-none { order: 0; }';

  // Z-index classes
  css += '\n.z-0 { z-index: 0; }';
  css += '\n.z-10 { z-index: 10; }';
  css += '\n.z-20 { z-index: 20; }';
  css += '\n.z-30 { z-index: 30; }';
  css += '\n.z-40 { z-index: 40; }';
  css += '\n.z-50 { z-index: 50; }';
  css += '\n.z-auto { z-index: auto; }';

  // Color classes
  css += '\n.text-black { color: hsl(0 0% 0% / 1); }';
  css += '\n.text-white { color: hsl(0 0% 100% / 1); }';
  css += '\n.text-gray-500 { color: hsl(210 2% 50% / 1); }';
  css += '\n.text-blue-500 { color: hsl(214 85% 55% / 1); }';
  css += '\n.text-red-500 { color: hsl(358 85% 55% / 1); }';
  css += '\n.text-green-500 { color: hsl(125 80% 50% / 1); }';
  css += '\n.text-yellow-500 { color: hsl(55 90% 50% / 1); }';
  css += '\n.bg-black { background-color: hsl(0 0% 0% / 1); }';
  css += '\n.bg-white { background-color: hsl(0 0% 100% / 1); }';
  css += '\n.bg-gray-500 { background-color: hsl(210 2% 50% / 1); }';
  css += '\n.bg-blue-500 { background-color: hsl(214 85% 55% / 1); }';
  css += '\n.bg-red-500 { background-color: hsl(358 85% 55% / 1); }';
  css += '\n.bg-green-500 { background-color: hsl(125 80% 50% / 1); }';
  css += '\n.bg-yellow-500 { background-color: hsl(55 90% 50% / 1); }';
  css += '\n.border-black { border-color: hsl(0 0% 0% / 1); }';
  css += '\n.border-white { border-color: hsl(0 0% 100% / 1); }';
  css += '\n.border-gray-500 { border-color: hsl(210 2% 50% / 1); }';
  css += '\n.border-blue-500 { border-color: hsl(214 85% 55% / 1); }';
  css += '\n.border-red-500 { border-color: hsl(358 85% 55% / 1); }';
  css += '\n.border-green-500 { border-color: hsl(125 80% 50% / 1); }';
  css += '\n.border-yellow-500 { border-color: hsl(55 90% 50% / 1); }';
  css += '\n.fill-black { fill: hsl(0 0% 0% / 1); }';
  css += '\n.fill-white { fill: hsl(0 0% 100% / 1); }';
  css += '\n.fill-gray-500 { fill: hsl(210 2% 50% / 1); }';
  css += '\n.fill-blue-500 { fill: hsl(214 85% 55% / 1); }';
  css += '\n.fill-red-500 { fill: hsl(358 85% 55% / 1); }';
  css += '\n.fill-green-500 { fill: hsl(125 80% 50% / 1); }';
  css += '\n.fill-yellow-500 { fill: hsl(55 90% 50% / 1); }';

  // FontSize classes
  css += '\n.font-size-xs { font-size: 0.75rem; }';
  css += '\n.font-size-sm { font-size: 0.875rem; }';
  css += '\n.font-size-md { font-size: 1rem; }';
  css += '\n.font-size-lg { font-size: 1.25rem; }';
  css += '\n.font-size-xl { font-size: 1.5rem; }';
  css += '\n.font-size-2xl { font-size: 2rem; }';
  css += '\n.font-size-3xl { font-size: 2.25rem; }';
  css += '\n.font-size-4xl { font-size: 2.75rem; }';

  // カスタムテーマクラス
  if (config.theme?.spacing) {
    Object.entries(config.theme.spacing).forEach(([key, value]) => {
      css += `\n.m-${key} { margin: ${value}; }`;
      css += `\n.p-${key} { padding: ${value}; }`;
      css += `\n.mx-${key} { margin-left: ${value}; margin-right: ${value}; }`;
      css += `\n.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }`;
      css += `\n.mt-${key} { margin-top: ${value}; }`;
      css += `\n.mr-${key} { margin-right: ${value}; }`;
      css += `\n.mb-${key} { margin-bottom: ${value}; }`;
      css += `\n.ml-${key} { margin-left: ${value}; }`;
      css += `\n.px-${key} { padding-left: ${value}; padding-right: ${value}; }`;
      css += `\n.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }`;
      css += `\n.pt-${key} { padding-top: ${value}; }`;
      css += `\n.pr-${key} { padding-right: ${value}; }`;
      css += `\n.pb-${key} { padding-bottom: ${value}; }`;
      css += `\n.pl-${key} { padding-left: ${value}; }`;
      css += `\n.gap-${key} { gap: ${value}; }`;
      css += `\n.gap-x-${key} { column-gap: ${value}; }`;
      css += `\n.gap-y-${key} { row-gap: ${value}; }`;
    });
  }

  if (config.theme?.display) {
    Object.entries(config.theme.display).forEach(([key, value]) => {
      css += `\n.${key} { display: ${value}; }`;
    });
  }

  if (config.theme?.width) {
    Object.entries(config.theme.width).forEach(([key, value]) => {
      css += `\n.w-${key} { width: ${value}; }`;
      css += `\n.min-w-${key} { min-width: ${value}; }`;
      css += `\n.max-w-${key} { max-width: ${value}; }`;
    });
  }

  if (config.theme?.height) {
    Object.entries(config.theme.height).forEach(([key, value]) => {
      css += `\n.h-${key} { height: ${value}; }`;
      css += `\n.min-h-${key} { min-height: ${value}; }`;
      css += `\n.max-h-${key} { max-height: ${value}; }`;
    });
  }

  if (config.theme?.grid) {
    Object.entries(config.theme.grid).forEach(([key, value]) => {
      css += `\n.grid-cols-${key} { grid-template-columns: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.grid-rows-${key} { grid-template-rows: repeat(${value}, minmax(0, 1fr)); }`;
      css += `\n.col-span-${key} { grid-column: span ${value}; }`;
      css += `\n.row-span-${key} { grid-row: span ${value}; }`;
      css += `\n.col-start-${key} { grid-column-start: ${value}; }`;
      css += `\n.row-start-${key} { grid-row-start: ${value}; }`;
      css += `\n.col-end-${key} { grid-column-end: ${value}; }`;
      css += `\n.row-end-${key} { grid-row-end: ${value}; }`;
    });
  }

  if (config.theme?.zIndex) {
    Object.entries(config.theme.zIndex).forEach(([key, value]) => {
      css += `\n.z-${key} { z-index: ${value}; }`;
    });
  }

  if (config.theme?.order) {
    Object.entries(config.theme.order).forEach(([key, value]) => {
      css += `\n.order-${key} { order: ${value}; }`;
    });
  }

  if (config.theme?.gridCols) {
    Object.entries(config.theme.gridCols).forEach(([key, value]) => {
      css += `\n.grid-cols-${key} { grid-template-columns: repeat(${value}, minmax(0, 1fr)); }`;
    });
  }

  if (config.theme?.gridRows) {
    Object.entries(config.theme.gridRows).forEach(([key, value]) => {
      css += `\n.grid-rows-${key} { grid-template-rows: repeat(${value}, minmax(0, 1fr)); }`;
    });
  }

  if (config.theme?.gridColumnSpan) {
    Object.entries(config.theme.gridColumnSpan).forEach(([key, value]) => {
      css += `\n.col-span-${key} { grid-column: span ${value} / span ${value}; }`;
    });
  }

  if (config.theme?.gridRowSpan) {
    Object.entries(config.theme.gridRowSpan).forEach(([key, value]) => {
      css += `\n.row-span-${key} { grid-row: span ${value} / span ${value}; }`;
    });
  }

  if (config.theme?.color) {
    Object.entries(config.theme.color).forEach(([key, value]) => {
      css += `\n.text-${key} { color: ${value}; }`;
      css += `\n.bg-${key} { background-color: ${value}; }`;
      css += `\n.border-${key} { border-color: ${value}; }`;
      css += `\n.fill-${key} { fill: ${value}; }`;
    });
  }

  if (config.theme?.fontSize) {
    Object.entries(config.theme.fontSize).forEach(([key, value]) => {
      css += `\n.font-size-${key} { font-size: ${value}; }`;
    });
  }

  if (config.theme?.components) {
    Object.entries(config.theme.components).forEach(([componentName, utilityClasses]) => {
      const componentCSS = parseUtilityClasses(utilityClasses, config);
      if (componentCSS) {
        css += `\n.${componentName} {${componentCSS}\n}`;
      }
    });
  }

  // Apply classes
  if (config.apply) {
    Object.entries(config.apply).forEach(([className, utilityClasses]) => {
      const applyCSS = parseUtilityClasses(utilityClasses, config);
      if (applyCSS) {
        css += `\n\n.${className} {${applyCSS}\n}`;
      }
    });
  }

  return css;
};

// セキュリティチェック関数を強化
const isSafeValue = (value: string): boolean => {
  const dangerousPatterns = [
    /javascript:/i,
    /data:/i,
    /vbscript:/i,
    /<script/i,
    /<\/script/i,
    /on\w+\s*=/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /[@\\]/,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(value));
};

// CSS値エスケープ関数
const escapeValue = (value: string): string => {
  return value
    .replace(/\./g, '\\.')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/\*/g, '\\*')
    .replace(/\//g, '\\/')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/\^/g, '\\^')
    .replace(/\|/g, '\\|')
    .replace(/\?/g, '\\?')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/,/g, '\\,')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
};

// CSS関数の値フォーマット関数
const formatCSSFunctionValue = (value: string): string => {
  return value
    .replace(/,/g, ', ')
    .replace(/\s*\+\s*/g, ' + ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s*\*\s*/g, ' * ')
    .replace(/\s*\/\s*/g, ' / ')
    .replace(/\s+/g, ' ')
    .trim();
};

// カスタムスペーシングクラス抽出モック
const mockExtractCustomSpacingClasses = (content: string): string[] => {
  const customValuePattern =
    /\b(m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py|gap|gap-x|gap-y)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customSpacingClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];

    // セキュリティチェック - CSS変数は許可
    if (!isSafeValue(value) && !value.includes('var(--')) {
      continue;
    }

    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix.startsWith('m')) {
      const property = 'margin';
      const direction = prefix.slice(1);

      if (direction === 'x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
        );
      }
    } else if (prefix.startsWith('p')) {
      const property = 'padding';
      const direction = prefix.slice(1);

      if (direction === 'x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-top: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-right: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-bottom: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-left: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}: ${originalValue}; }`
        );
      }
    } else if (prefix.startsWith('gap')) {
      if (prefix === 'gap-x') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { column-gap: ${originalValue}; }`
        );
      } else if (prefix === 'gap-y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { row-gap: ${originalValue}; }`
        );
      } else {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { gap: ${originalValue}; }`
        );
      }
    }
  }

  return customSpacingClasses;
};

// カスタム幅クラス抽出モック
const mockExtractCustomWidthClasses = (content: string): string[] => {
  const customValuePattern = /\b(w|min-w|max-w)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customWidthClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'w') {
      customWidthClasses.push(`.w-\\[${escapeValue(value)}\\] { width: ${originalValue}; }`);
    } else if (prefix === 'min-w') {
      customWidthClasses.push(
        `.min-w-\\[${escapeValue(value)}\\] { min-width: ${originalValue}; }`
      );
    } else if (prefix === 'max-w') {
      customWidthClasses.push(
        `.max-w-\\[${escapeValue(value)}\\] { max-width: ${originalValue}; }`
      );
    }
  }

  return customWidthClasses;
};

// カスタム高さクラス抽出モック
const mockExtractCustomHeightClasses = (content: string): string[] => {
  const customValuePattern = /\b(h|min-h|max-h)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customHeightClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'h') {
      customHeightClasses.push(`.h-\\[${escapeValue(value)}\\] { height: ${originalValue}; }`);
    } else if (prefix === 'min-h') {
      customHeightClasses.push(
        `.min-h-\\[${escapeValue(value)}\\] { min-height: ${originalValue}; }`
      );
    } else if (prefix === 'max-h') {
      customHeightClasses.push(
        `.max-h-\\[${escapeValue(value)}\\] { max-height: ${originalValue}; }`
      );
    }
  }

  return customHeightClasses;
};

// カスタムグリッドクラス抽出モック
const mockExtractCustomGridClasses = (content: string): string[] => {
  const customValuePattern =
    /\b(grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customGridClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    if (prefix === 'grid-cols') {
      customGridClasses.push(
        `.grid-cols-\\[${escapeValue(value)}\\] { grid-template-columns: ${originalValue}; }`
      );
    } else if (prefix === 'grid-rows') {
      customGridClasses.push(
        `.grid-rows-\\[${escapeValue(value)}\\] { grid-template-rows: ${originalValue}; }`
      );
    } else if (prefix === 'col-span') {
      customGridClasses.push(
        `.col-span-\\[${escapeValue(value)}\\] { grid-column: span ${originalValue}; }`
      );
    } else if (prefix === 'row-span') {
      customGridClasses.push(
        `.row-span-\\[${escapeValue(value)}\\] { grid-row: span ${originalValue}; }`
      );
    } else if (prefix === 'col-start') {
      customGridClasses.push(
        `.col-start-\\[${escapeValue(value)}\\] { grid-column-start: ${originalValue}; }`
      );
    } else if (prefix === 'col-end') {
      customGridClasses.push(
        `.col-end-\\[${escapeValue(value)}\\] { grid-column-end: ${originalValue}; }`
      );
    } else if (prefix === 'row-start') {
      customGridClasses.push(
        `.row-start-\\[${escapeValue(value)}\\] { grid-row-start: ${originalValue}; }`
      );
    } else if (prefix === 'row-end') {
      customGridClasses.push(
        `.row-end-\\[${escapeValue(value)}\\] { grid-row-end: ${originalValue}; }`
      );
    } else if (prefix === 'grid-flow') {
      customGridClasses.push(
        `.grid-flow-\\[${escapeValue(value)}\\] { grid-auto-flow: ${originalValue}; }`
      );
    }
  }
  return customGridClasses;
};

// カスタムオーダークラス抽出モック
const mockExtractCustomOrderClasses = (content: string): string[] => {
  const customValuePattern = /\border-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customOrderClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const value = match[1];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    customOrderClasses.push(`.order-\\[${escapeValue(value)}\\] { order: ${originalValue}; }`);
  }

  return customOrderClasses;
};

// カスタムZ-indexクラス抽出モック
const mockExtractCustomZIndexClasses = (content: string): string[] => {
  const customValuePattern = /\bz-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customZIndexClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const value = match[1];
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;

    customZIndexClasses.push(`.z-\\[${escapeValue(value)}\\] { z-index: ${originalValue}; }`);
  }

  return customZIndexClasses;
};

// 色値用エスケープ関数（実際の実装に合わせる）
const escapeColorValue = (val: string): string => {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(rgb|rgba|hsl|hsla)\s*\(/;

  // 新しいカラー関数（hwb, lab, oklab, lch, oklch）を検出する正規表現
  const newColorFunctions = /\b(hwb|lab|oklab|lch|oklch)\s*\(/;

  // 新しいカラー関数の場合は特別処理（ハイフンをエスケープしない、カンマもエスケープする）
  if (newColorFunctions.test(val)) {
    return val.replace(/[()[\]{}+*/.\\%,]/g, '\\$&');
  }

  // 従来のCSS数学関数の場合は特別処理（カンマもエスケープする）
  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }

  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
};

// カスタムカラークラス抽出モック
const mockExtractCustomColorClasses = (content: string): string[] => {
  const customValuePattern = /\b(text|bg|border|fill)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customColorClasses: string[] = [];
  const cssMathFunctions = /\b(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2]; // match[2]がカスタム値
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;
    customColorClasses.push(
      `.${prefix}-\\[${escapeColorValue(value)}\\] { color: ${originalValue}; }`,
      `.${prefix}-\\[${escapeColorValue(value)}\\] { background-color: ${originalValue}; }`,
      `.${prefix}-\\[${escapeColorValue(value)}\\] { border-color: ${originalValue}; }`,
      `.${prefix}-\\[${escapeColorValue(value)}\\] { fill: ${originalValue}; }`
    );
  }
  return customColorClasses;
};

// フォントサイズ用エスケープ関数（実際の実装に合わせる）
const escapeFontSizeValue = (val: string): string => {
  // CSS数学関数を検出する正規表現（基本的な関数のみ）
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  // CSS数学関数の場合は特別処理（カンマもエスケープする）
  if (cssMathFunctions.test(val)) {
    return val.replace(/[()[\]{}+\-*/.\\%,]/g, '\\$&');
  }
  // CSS変数（var(--name)）の場合は特別処理 - ハイフンはエスケープしない
  if (val.includes('var(--')) {
    return val.replace(/[()[\]{}+*/.\\%]/g, '\\$&');
  }
  // 通常の値の場合は-も含めてエスケープ
  return val.replace(/[()[\]{}+\-*/.\\%]/g, '\\$&');
};

// カスタムフォントサイズクラス抽出モック
const mockExtractCustomFontSizeClasses = (content: string): string[] => {
  const customValuePattern = /\b(font-size)-\[([^\]]+)\]/g;
  const matches = content.matchAll(customValuePattern);
  const customFontSizeClasses: string[] = [];
  const cssMathFunctions = /\b(calc|min|max|clamp)\s*\(/;

  for (const match of matches) {
    const prefix = match[1];
    const value = match[2]; // match[2]がカスタム値
    const originalValue = cssMathFunctions.test(value) ? formatCSSFunctionValue(value) : value;
    customFontSizeClasses.push(
      `.${prefix}-\\[${escapeFontSizeValue(value)}\\] { font-size: ${originalValue}; }`
    );
  }
  return customFontSizeClasses;
};

// Apply機能のモック実装
const mockGenerateApplyClasses = (config?: Record<string, string>): string => {
  if (!config) {
    return '';
  }

  let applyCSS = '';
  Object.entries(config).forEach(([className, utilityClasses]) => {
    const applyCSS_inner = parseUtilityClasses(utilityClasses, { apply: config });
    if (applyCSS_inner) {
      applyCSS += `\n\n.${className} {${applyCSS_inner}\n}`;
    }
  });

  return applyCSS;
};

// smsshcssパッケージをモック
vi.mock('smsshcss', () => ({
  generateCSS: vi.fn().mockImplementation((config) => Promise.resolve(generateMockCSS(config))),
  generateCSSSync: vi.fn().mockImplementation((config) => generateMockCSS(config)),
  generatePurgeReport: vi.fn().mockResolvedValue({
    totalClasses: 100,
    usedClasses: 50,
    purgedClasses: 50,
    buildTime: 100,
  }),
  generateApplyClasses: vi.fn().mockImplementation(mockGenerateApplyClasses),
  extractCustomSpacingClasses: vi.fn().mockImplementation(mockExtractCustomSpacingClasses),
  extractCustomWidthClasses: vi.fn().mockImplementation(mockExtractCustomWidthClasses),
  extractCustomHeightClasses: vi.fn().mockImplementation(mockExtractCustomHeightClasses),
  extractCustomGridClasses: vi.fn().mockImplementation(mockExtractCustomGridClasses),
  extractCustomOrderClasses: vi.fn().mockImplementation(mockExtractCustomOrderClasses),
  extractCustomZIndexClasses: vi.fn().mockImplementation(mockExtractCustomZIndexClasses),
  extractCustomColorClasses: vi.fn().mockImplementation(mockExtractCustomColorClasses),
  extractCustomFontSizeClasses: vi.fn().mockImplementation(mockExtractCustomFontSizeClasses),
}));

// モッククリア関数
export function clearAllMocks(): void {
  vi.clearAllMocks();
}
