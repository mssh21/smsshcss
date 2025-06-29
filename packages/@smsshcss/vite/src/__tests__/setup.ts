import { vi } from 'vitest';

// コア設定を直接インポート（Single Source of Truth）
import {
  defaultConfig,
  getColorValue,
  getFontSizeValue,
  getSpacingValue,
  getSizeValue,
  type DefaultConfig,
} from '../../../../smsshcss/src/config';

// コア設定取得関数（統一的なインターフェース）
const getCoreConfig = (): {
  defaultConfig: DefaultConfig;
  getColorValue: (key: string) => string | undefined;
  getFontSizeValue: (key: string) => string | undefined;
  getSpacingValue: (key: string) => string | undefined;
  getSizeValue: (key: string) => string | undefined;
} => ({
  defaultConfig,
  getColorValue,
  getFontSizeValue,
  getSpacingValue,
  getSizeValue,
});

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
      return `margin-inline: ${value};`;
    case 'my':
      return `margin-block: ${value};`;
    case 'mt':
      return `margin-block-start: ${value};`;
    case 'mr':
      return `margin-inline-end: ${value};`;
    case 'mb':
      return `margin-block-end: ${value};`;
    case 'ml':
      return `margin-inline-start: ${value};`;

    // Padding
    case 'p':
      return `padding: ${value};`;
    case 'px':
      return `padding-inline: ${value};`;
    case 'py':
      return `padding-block: ${value};`;
    case 'pt':
      return `padding-block-start: ${value};`;
    case 'pr':
      return `padding-inline-end: ${value};`;
    case 'pb':
      return `padding-block-end: ${value};`;
    case 'pl':
      return `padding-inline-start: ${value};`;

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
  const coreConfig = getCoreConfig();

  // カラークラス処理
  if (['text', 'bg', 'border', 'fill'].includes(prefix)) {
    const colorValue = coreConfig.getColorValue(suffix);
    if (colorValue) {
      return parseUtilityWithValue(prefix, colorValue);
    }
  }

  // Font-size処理
  if (prefix === 'font-size') {
    const fontSizeValue = coreConfig.getFontSizeValue(suffix);
    if (fontSizeValue) {
      return `font-size: ${fontSizeValue};`;
    }
  }

  // Spacing処理（margin, padding, gap）
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
    const spacingValue = coreConfig.getSpacingValue(suffix);
    if (spacingValue) {
      return parseUtilityWithValue(prefix, spacingValue);
    }
  }

  // Size処理（width, height）
  if (['w', 'min-w', 'max-w', 'h', 'min-h', 'max-h'].includes(prefix)) {
    const sizeValue = coreConfig.getSizeValue(suffix);
    if (sizeValue) {
      return parseUtilityWithValue(prefix, sizeValue);
    }
  }

  // 数値サフィックスの処理（スペーシング用の後方互換性）
  if (
    /^\d+$/.test(suffix) &&
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
    const numValue = parseInt(suffix);
    // コアパッケージのスペーシング基準値を使用
    const baseSpacing = parseFloat(coreConfig.defaultConfig.spacing['2xs']) || 0.25;
    const calcValue = `${baseSpacing * numValue}rem`;
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
  const coreConfig = getCoreConfig();
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

  // Spacing classes from core config
  Object.entries(coreConfig.defaultConfig.spacing).forEach(([key, value]) => {
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

  // Size classes from core config
  Object.entries(coreConfig.defaultConfig.size).forEach(([key, value]) => {
    css += `\n.w-${key} { width: ${value}; }`;
    css += `\n.h-${key} { height: ${value}; }`;
    css += `\n.min-w-${key} { min-width: ${value}; }`;
    css += `\n.min-h-${key} { min-height: ${value}; }`;
    css += `\n.max-w-${key} { max-width: ${value}; }`;
    css += `\n.max-h-${key} { max-height: ${value}; }`;
  });

  // Color classes from core config
  Object.entries(coreConfig.defaultConfig.color).forEach(([key, value]) => {
    css += `\n.text-${key} { color: ${value}; }`;
    css += `\n.bg-${key} { background-color: ${value}; }`;
    css += `\n.border-${key} { border-color: ${value}; }`;
    css += `\n.fill-${key} { fill: ${value}; }`;
  });

  // Font size classes from core config
  Object.entries(coreConfig.defaultConfig.fontSize).forEach(([key, value]) => {
    css += `\n.font-size-${key} { font-size: ${value}; }`;
  });

  // Grid classes from core config
  Object.entries(coreConfig.defaultConfig.grid).forEach(([key, value]) => {
    css += `\n.grid-cols-${key} { grid-template-columns: ${value}; }`;
    css += `\n.grid-rows-${key} { grid-template-rows: ${value}; }`;

    // 数値の場合のみspan処理
    if (/^\d+$/.test(key)) {
      css += `\n.col-span-${key} { grid-column: span ${key} / span ${key}; }`;
      css += `\n.row-span-${key} { grid-row: span ${key} / span ${key}; }`;
      css += `\n.col-start-${key} { grid-column-start: ${key}; }`;
      css += `\n.row-start-${key} { grid-row-start: ${key}; }`;
      css += `\n.col-end-${key} { grid-column-end: ${key}; }`;
      css += `\n.row-end-${key} { grid-row-end: ${key}; }`;
    }
  });

  // Display classes
  css += '\n.flex { display: flex; }';
  css += '\n.grid { display: grid; }';
  css += '\n.block { display: block; }';
  css += '\n.inline { display: inline; }';
  css += '\n.inline-block { display: inline-block; }';
  css += '\n.hidden { display: none; }';

  // Flexbox classes
  css += '\n.items-center { align-items: center; }';
  css += '\n.items-start { align-items: flex-start; }';
  css += '\n.items-end { align-items: flex-end; }';
  css += '\n.items-baseline { align-items: baseline; }';
  css += '\n.items-stretch { align-items: stretch; }';
  css += '\n.content-center { align-content: center; }';
  css += '\n.content-start { align-content: flex-start; }';
  css += '\n.content-end { align-content: flex-end; }';
  css += '\n.content-between { align-content: space-between; }';
  css += '\n.content-around { align-content: space-around; }';
  css += '\n.content-evenly { align-content: space-evenly; }';
  css += '\n.self-auto { align-self: auto; }';
  css += '\n.self-start { align-self: flex-start; }';
  css += '\n.self-end { align-self: flex-end; }';
  css += '\n.self-center { align-self: center; }';
  css += '\n.self-stretch { align-self: stretch; }';
  css += '\n.self-baseline { align-self: baseline; }';

  css += '\n.basis-auto { flex-basis: auto; }';
  css += '\n.basis-full { flex-basis: 100%; }';
  Object.entries(coreConfig.defaultConfig.size).forEach(([key, value]) => {
    if (key !== 'auto' && key !== 'full') {
      // autoとfullは既に追加済み
      css += `\n.basis-${key} { flex-basis: ${value}; }`;
    }
  });

  css += '\n.flex-row { flex-direction: row; }';
  css += '\n.flex-col { flex-direction: column; }';
  css += '\n.flex-row-reverse { flex-direction: row-reverse; }';
  css += '\n.flex-col-reverse { flex-direction: column-reverse; }';

  css += '\n.flex-auto { flex: 1 1 auto; }';
  css += '\n.flex-initial { flex: 0 1 auto; }';
  css += '\n.flex-none { flex: none; }';

  css += '\n.grow { flex-grow: 1; }';

  css += '\n.justify-center { justify-content: center; }';
  css += '\n.justify-start { justify-content: flex-start; }';
  css += '\n.justify-end { justify-content: flex-end; }';
  css += '\n.justify-between { justify-content: space-between; }';
  css += '\n.justify-around { justify-content: space-around; }';
  css += '\n.justify-evenly { justify-content: space-evenly; }';

  css += '\n.shrink { flex-shrink: 1; }';

  css += '\n.flex-wrap { flex-wrap: wrap; }';
  css += '\n.flex-wrap-reverse { flex-wrap: wrap-reverse; }';
  css += '\n.flex-nowrap { flex-wrap: nowrap; }';

  // Order classes
  css += '\n.order-1 { order: 1; }';
  css += '\n.order-2 { order: 2; }';
  css += '\n.order-3 { order: 3; }';
  css += '\n.order-4 { order: 4; }';
  css += '\n.order-5 { order: 5; }';
  css += '\n.order-6 { order: 6; }';
  css += '\n.order-7 { order: 7; }';
  css += '\n.order-8 { order: 8; }';
  css += '\n.order-9 { order: 9; }';
  css += '\n.order-10 { order: 10; }';
  css += '\n.order-11 { order: 11; }';
  css += '\n.order-12 { order: 12; }';
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

  // Overflow classes
  css += '\n.overflow-auto { overflow: auto; }';
  css += '\n.overflow-hidden { overflow: hidden; }';
  css += '\n.overflow-visible { overflow: visible; }';
  css += '\n.overflow-scroll { overflow: scroll; }';
  css += '\n.overflow-clip { overflow: clip; }';
  css += '\n.overflow-x-auto { overflow-x: auto; }';
  css += '\n.overflow-x-hidden { overflow-x: hidden; }';
  css += '\n.overflow-x-visible { overflow-x: visible; }';
  css += '\n.overflow-x-scroll { overflow-x: scroll; }';
  css += '\n.overflow-x-clip { overflow-x: clip; }';
  css += '\n.overflow-y-auto { overflow-y: auto; }';
  css += '\n.overflow-y-hidden { overflow-y: hidden; }';
  css += '\n.overflow-y-visible { overflow-y: visible; }';
  css += '\n.overflow-y-scroll { overflow-y: scroll; }';
  css += '\n.overflow-y-clip { overflow-y: clip; }';

  // Position classes
  css += '\n.absolute { position: absolute; }';
  css += '\n.relative { position: relative; }';
  css += '\n.fixed { position: fixed; }';
  css += '\n.static { position: static; }';
  css += '\n.sticky { position: sticky; }';

  // Grid auto-flow classes
  css += '\n.grid-flow-row { grid-auto-flow: row; }';
  css += '\n.grid-flow-col { grid-auto-flow: column; }';
  css += '\n.grid-flow-dense { grid-auto-flow: dense; }';
  css += '\n.grid-flow-row-dense { grid-auto-flow: row dense; }';
  css += '\n.grid-flow-col-dense { grid-auto-flow: column dense; }';

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
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block-start: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline-end: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block-end: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline-start: ${originalValue}; }`
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
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline: ${originalValue}; }`
        );
      } else if (direction === 'y') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block: ${originalValue}; }`
        );
      } else if (direction === 't') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block-start: ${originalValue}; }`
        );
      } else if (direction === 'r') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline-end: ${originalValue}; }`
        );
      } else if (direction === 'b') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-block-end: ${originalValue}; }`
        );
      } else if (direction === 'l') {
        customSpacingClasses.push(
          `.${prefix}-\\[${escapeValue(value)}\\] { ${property}-inline-start: ${originalValue}; }`
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
