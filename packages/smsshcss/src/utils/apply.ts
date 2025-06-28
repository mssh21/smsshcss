import { ApplyConfig } from '../core/types';
import { defaultColorConfig } from '../config/colorConfig';
import { defaultFontSizeConfig } from '../config/fontSizeConfig';

/**
 * applyクラスを生成する
 * @param config - apply設定
 * @returns 生成されたCSSクラス文字列
 */
export function generateApplyClasses(config?: ApplyConfig): string {
  if (!config) {
    return '';
  }

  const classes: string[] = [];

  for (const [className, utilities] of Object.entries(config)) {
    // ユーティリティクラスを分解
    const utilityClasses = utilities
      .trim()
      .split(/\s+/)
      .filter((cls) => cls.length > 0);

    if (utilityClasses.length === 0) {
      continue;
    }

    // 各ユーティリティクラスのCSSルールを収集
    const cssRules: string[] = [];

    for (const utilityClass of utilityClasses) {
      // ユーティリティクラスからCSSプロパティを抽出
      const cssRule = extractCSSFromUtility(utilityClass);
      if (cssRule) {
        cssRules.push(cssRule);
      }
    }

    if (cssRules.length > 0) {
      // applyクラスを生成
      const generatedClass = `.${className} {
${cssRules.map((rule) => `  ${rule}`).join('\n')}
}`;
      classes.push(generatedClass);
    }
  }

  return classes.join('\n\n');
}

/**
 * ユーティリティクラスからCSSプロパティを抽出する
 * @param utilityClass - ユーティリティクラス名
 * @returns CSSプロパティと値のペア（例: "margin: 1rem;"）
 */
function extractCSSFromUtility(utilityClass: string): string | null {
  // フォントサイズの処理を最初に移動（他の条件にマッチする前に処理）
  const fontSizeMatch = utilityClass.match(/^font-size-(.+)$/);
  if (fontSizeMatch) {
    const [, fontSize] = fontSizeMatch;
    const fontSizeValue = getFontSizeValue(fontSize);
    if (fontSizeValue) {
      return `font-size: ${fontSizeValue};`;
    }
  }

  // マージン・パディング
  const spacingMatch = utilityClass.match(/^(m|p)(t|r|b|l|x|y)?-(.+)$/);
  if (spacingMatch) {
    const [, property, direction, size] = spacingMatch;
    const prop = property === 'm' ? 'margin' : 'padding';
    const value = getSpacingValue(size);

    if (!value) return null;

    if (direction === 'x') {
      return `${prop}-inline: ${value};`;
    } else if (direction === 'y') {
      return `${prop}-block: ${value};`;
    } else if (direction) {
      const dirMap: Record<string, string> = {
        t: 'block-start',
        r: 'inline-end',
        b: 'block-end',
        l: 'inline-start',
      };
      return `${prop}-${dirMap[direction]}: ${value};`;
    } else {
      return `${prop}: ${value};`;
    }
  }

  // gap
  const gapMatch = utilityClass.match(/^gap(-([xy]))?-(.+)$/);
  if (gapMatch) {
    const [, , direction, size] = gapMatch;
    const prop = 'gap';
    const value = getSpacingValue(size);

    if (!value) return null;

    if (direction === 'x') {
      return `column-${prop}: ${value};`;
    } else if (direction === 'y') {
      return `row-${prop}: ${value};`;
    } else {
      return `${prop}: ${value};`;
    }
  }

  // 幅
  const widthMatch = utilityClass.match(/^(min-|max-)?w-(.+)$/);
  if (widthMatch) {
    const [, prefix, size] = widthMatch;
    const prop = prefix ? `${prefix.slice(0, -1)}-width` : 'width';
    const value = getSizeValue(size);
    if (!value) return null;
    return `${prop}: ${value};`;
  }

  // 高さ
  const heightMatch = utilityClass.match(/^(min-|max-)?h-(.+)$/);
  if (heightMatch) {
    const [, prefix, size] = heightMatch;
    const prop = prefix ? `${prefix.slice(0, -1)}-height` : 'height';
    const value = getSizeValue(size);
    if (!value) return null;
    return `${prop}: ${value};`;
  }

  // Display
  const displayMap: Record<string, string> = {
    block: 'block',
    'inline-block': 'inline-block',
    inline: 'inline',
    flex: 'flex',
    'inline-flex': 'inline-flex',
    grid: 'grid',
    'inline-grid': 'inline-grid',
    none: 'none',
    table: 'table',
    'table-cell': 'table-cell',
    'table-row': 'table-row',
    hidden: 'none',
  };
  if (displayMap[utilityClass]) {
    return `display: ${displayMap[utilityClass]};`;
  }

  // Flexbox
  const flexboxMap: Record<string, string> = {
    'flex-row': 'flex-direction: row;',
    'flex-row-reverse': 'flex-direction: row-reverse;',
    'flex-col': 'flex-direction: column;',
    'flex-col-reverse': 'flex-direction: column-reverse;',
    'flex-wrap': 'flex-wrap: wrap;',
    'flex-wrap-reverse': 'flex-wrap: wrap-reverse;',
    'flex-nowrap': 'flex-wrap: nowrap;',
    'justify-start': 'justify-content: flex-start;',
    'justify-end': 'justify-content: flex-end;',
    'justify-center': 'justify-content: center;',
    'justify-between': 'justify-content: space-between;',
    'justify-around': 'justify-content: space-around;',
    'justify-evenly': 'justify-content: space-evenly;',
    'items-start': 'align-items: flex-start;',
    'items-end': 'align-items: flex-end;',
    'items-center': 'align-items: center;',
    'items-baseline': 'align-items: baseline;',
    'items-stretch': 'align-items: stretch;',
    'content-start': 'align-content: flex-start;',
    'content-end': 'align-content: flex-end;',
    'content-center': 'align-content: center;',
    'content-between': 'align-content: space-between;',
    'content-around': 'align-content: space-around;',
    'content-evenly': 'align-content: space-evenly;',
    'self-auto': 'align-self: auto;',
    'self-start': 'align-self: flex-start;',
    'self-end': 'align-self: flex-end;',
    'self-center': 'align-self: center;',
    'self-stretch': 'align-self: stretch;',
  };

  if (flexboxMap[utilityClass]) {
    return flexboxMap[utilityClass];
  }

  // Flex Basis
  const basisMatch = utilityClass.match(/^basis-(.+)$/);
  if (basisMatch) {
    const [, size] = basisMatch;
    const value = getSizeValue(size);
    if (!value) return null;
    return `flex-basis: ${value};`;
  }

  // Flex Grow
  const growMatch = utilityClass.match(/^grow(-(.+))?$/);
  if (growMatch) {
    const [, , value] = growMatch;
    if (!value || value === undefined) {
      return 'flex-grow: 1;';
    } else {
      // カスタム値（[値]形式）の場合
      if (value.startsWith('[') && value.endsWith(']')) {
        return `flex-grow: ${normalizeCustomValue(value.slice(1, -1))};`;
      }
      return `flex-grow: ${value};`;
    }
  }

  // Flex Shrink
  const shrinkMatch = utilityClass.match(/^shrink(-(.+))?$/);
  if (shrinkMatch) {
    const [, , value] = shrinkMatch;
    if (!value || value === undefined) {
      return 'flex-shrink: 1;';
    } else {
      // カスタム値（[値]形式）の場合
      if (value.startsWith('[') && value.endsWith(']')) {
        return `flex-shrink: ${normalizeCustomValue(value.slice(1, -1))};`;
      }
      return `flex-shrink: ${value};`;
    }
  }

  // Flex
  const flexShorthandMap: Record<string, string> = {
    'flex-auto': 'flex: 1 1 auto;',
    'flex-initial': 'flex: 0 1 auto;',
    'flex-none': 'flex: none;',
  };

  if (flexShorthandMap[utilityClass]) {
    return flexShorthandMap[utilityClass];
  }

  // Flex カスタム値
  const flexMatch = utilityClass.match(/^flex-\[(.+)\]$/);
  if (flexMatch) {
    const [, value] = flexMatch;
    return `flex: ${normalizeCustomValue(value)};`;
  }

  // Grid Columns
  const gridColsMatch = utilityClass.match(/^grid-cols-(.+)$/);
  if (gridColsMatch) {
    const [, size] = gridColsMatch;
    const value = getGridValue(size);
    if (!value) return null;
    return `grid-template-columns: ${value};`;
  }

  // Grid Rows
  const gridRowsMatch = utilityClass.match(/^grid-rows-(.+)$/);
  if (gridRowsMatch) {
    const [, size] = gridRowsMatch;
    const value = getGridValue(size);
    if (!value) return null;
    return `grid-template-rows: ${value};`;
  }

  // Grid Column Span
  const colSpanMatch = utilityClass.match(/^col-span-(.+)$/);
  if (colSpanMatch) {
    const [, size] = colSpanMatch;
    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const value = size.slice(1, -1);
      return `grid-column: span ${value} / span ${value};`;
    }
    // 数値の場合
    return `grid-column: span ${size} / span ${size};`;
  }

  // Grid Row Span
  const rowSpanMatch = utilityClass.match(/^row-span-(.+)$/);
  if (rowSpanMatch) {
    const [, size] = rowSpanMatch;
    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const value = size.slice(1, -1);
      return `grid-row: span ${value} / span ${value};`;
    }
    // 数値の場合
    return `grid-row: span ${size} / span ${size};`;
  }

  // Grid Column Start
  const colStartMatch = utilityClass.match(/^col-start-(.+)$/);
  if (colStartMatch) {
    const [, position] = colStartMatch;
    // カスタム値（[値]形式）の場合
    if (position.startsWith('[') && position.endsWith(']')) {
      return `grid-column-start: ${position.slice(1, -1)};`;
    }
    return `grid-column-start: ${position};`;
  }

  // Grid Column End
  const colEndMatch = utilityClass.match(/^col-end-(.+)$/);
  if (colEndMatch) {
    const [, position] = colEndMatch;
    // カスタム値（[値]形式）の場合
    if (position.startsWith('[') && position.endsWith(']')) {
      return `grid-column-end: ${position.slice(1, -1)};`;
    }
    return `grid-column-end: ${position};`;
  }

  // Grid Row Start
  const rowStartMatch = utilityClass.match(/^row-start-(.+)$/);
  if (rowStartMatch) {
    const [, position] = rowStartMatch;
    // カスタム値（[値]形式）の場合
    if (position.startsWith('[') && position.endsWith(']')) {
      return `grid-row-start: ${position.slice(1, -1)};`;
    }
    return `grid-row-start: ${position};`;
  }

  // Grid Row End
  const rowEndMatch = utilityClass.match(/^row-end-(.+)$/);
  if (rowEndMatch) {
    const [, position] = rowEndMatch;
    // カスタム値（[値]形式）の場合
    if (position.startsWith('[') && position.endsWith(']')) {
      return `grid-row-end: ${position.slice(1, -1)};`;
    }
    return `grid-row-end: ${position};`;
  }

  // Order
  const orderMatch = utilityClass.match(/^order-(.+)$/);
  if (orderMatch) {
    const [, value] = orderMatch;
    return `order: ${value};`;
  }

  // Z-Index
  const zIndexMatch = utilityClass.match(/^z-(.+)$/);
  if (zIndexMatch) {
    const [, value] = zIndexMatch;
    return `z-index: ${value};`;
  }

  // カラー関連のユーティリティクラス
  const colorClasses = ['text', 'bg', 'border', 'fill'];
  for (const colorClass of colorClasses) {
    const colorMatch = utilityClass.match(new RegExp(`^${colorClass}-(.+)$`));
    if (colorMatch) {
      const [, colorName] = colorMatch;
      const colorValue = getColorValue(colorName);
      if (!colorValue) continue;

      switch (colorClass) {
        case 'text':
          return `color: ${colorValue};`;
        case 'bg':
          return `background-color: ${colorValue};`;
        case 'border':
          return `border-color: ${colorValue};`;
        case 'fill':
          return `fill: ${colorValue};`;
      }
    }
  }

  // カスタム値のクラス（[値]形式）
  const customMatch = utilityClass.match(
    /^(m|p|gap|w|min-w|max-w|h|min-h|max-h|grid-cols|grid-rows|col-span|row-span|col-start|col-end|row-start|row-end|basis|grow|shrink|flex|text|bg|border|fill|font-size)(-([xy]|[trbl]))?-\[([^\]]+)\]$/
  );
  if (customMatch) {
    // console.log(`[apply] Custom value match found:`, customMatch);
    const [, property, , direction, value] = customMatch;

    if (property === 'm' || property === 'p') {
      const prop = property === 'm' ? 'margin' : 'padding';
      if (direction === 'x') {
        return `${prop}-inline: ${value};`;
      } else if (direction === 'y') {
        return `${prop}-block: ${value};`;
      } else if (direction) {
        const dirMap: Record<string, string> = {
          t: 'block-start',
          r: 'inline-end',
          b: 'block-end',
          l: 'inline-start',
        };
        return `${prop}-${dirMap[direction]}: ${value};`;
      } else {
        return `${prop}: ${value};`;
      }
    } else if (property === 'gap') {
      if (direction === 'x') {
        return `column-gap: ${value};`;
      } else if (direction === 'y') {
        return `row-gap: ${value};`;
      } else {
        return `gap: ${value};`;
      }
    } else if (property === 'w') {
      return `width: ${value};`;
    } else if (property === 'min-w') {
      return `min-width: ${value};`;
    } else if (property === 'max-w') {
      return `max-width: ${value};`;
    } else if (property === 'h') {
      return `height: ${value};`;
    } else if (property === 'min-h') {
      return `min-height: ${value};`;
    } else if (property === 'max-h') {
      return `max-height: ${value};`;
    } else if (property === 'grid-cols') {
      return `grid-template-columns: ${value};`;
    } else if (property === 'grid-rows') {
      return `grid-template-rows: ${value};`;
    } else if (property === 'col-span') {
      return `grid-column: ${value};`;
    } else if (property === 'row-span') {
      return `grid-row: ${value};`;
    } else if (property === 'col-start') {
      return `grid-column-start: ${value};`;
    } else if (property === 'col-end') {
      return `grid-column-end: ${value};`;
    } else if (property === 'row-start') {
      return `grid-row-start: ${value};`;
    } else if (property === 'row-end') {
      return `grid-row-end: ${value};`;
    } else if (property === 'basis') {
      return `flex-basis: ${value};`;
    } else if (property === 'grow') {
      return `flex-grow: ${normalizeCustomValue(value)};`;
    } else if (property === 'shrink') {
      return `flex-shrink: ${normalizeCustomValue(value)};`;
    } else if (property === 'flex') {
      return `flex: ${normalizeCustomValue(value)};`;
    } else if (property === 'text') {
      return `color: ${value};`;
    } else if (property === 'bg') {
      return `background-color: ${value};`;
    } else if (property === 'border') {
      return `border: ${value};`;
    } else if (property === 'fill') {
      return `fill: ${value};`;
    } else if (property === 'font-size') {
      // console.log(`[apply] Custom font-size value: ${value}`);
      return `font-size: ${value};`;
    }
  }

  // その他のユーティリティクラスは今後追加予定
  // 現時点では基本的なものに対応
  // console.log(`[apply] No match found for: ${utilityClass}`);

  return null;
}

/**
 * カスタム値を正規化（スペースの適切な挿入）
 */
function normalizeCustomValue(value: string): string {
  if (!value) return value;

  let normalizedValue = value;

  // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
  const cssFunctions =
    /\b(calc|min|max|clamp|minmax|var|rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/gi;
  if (cssFunctions.test(normalizedValue)) {
    // カンマの後にスペースがない場合は追加
    normalizedValue = normalizedValue.replace(/,(?!\s)/g, ', ');
  }

  // calc関数内の演算子周りにスペースを追加
  if (/\bcalc\s*\(/i.test(normalizedValue)) {
    // +, -, *, / の周りにスペースを追加（既にスペースがある場合は追加しない）
    normalizedValue = normalizedValue.replace(/([+\-*/])(?!\s)/g, '$1 ');
    normalizedValue = normalizedValue.replace(/(?<!\s)([+\-*/])/g, ' $1');
    // 連続するスペースを1つにまとめる
    normalizedValue = normalizedValue.replace(/\s+/g, ' ');
  }

  return normalizedValue;
}

/**
 * スペーシングサイズの値を取得
 */
function getSpacingValue(size: string): string | null {
  if (!size) return null;

  const defaultSpacingValues: Record<string, string> = {
    none: '0',
    auto: 'auto',
    '2xs': '0.25rem', // 0.25rem (4px)  (フィボナッチ: 1)
    xs: '0.5rem', // 0.5rem (8px)  (フィボナッチ: 2)
    sm: '0.75rem', // 0.75rem (12px) (フィボナッチ: 3)
    md: '1.25rem', // 1.25rem (20px) (フィボナッチ: 5)
    lg: '2rem', // 2rem (32px) (フィボナッチ: 8)
    xl: '3.25rem', // 3.25rem (52px) (フィボナッチ: 13)
    '2xl': '5.25rem', // 5.25rem (84px) (フィボナッチ: 21)
    '3xl': '8.5rem', // 8.5rem (136px) (フィボナッチ: 34)
    '4xl': '13.75rem', // 13.75rem (220px) (フィボナッチ: 55)
    '5xl': '22.25rem', // 22.25rem (356px) (フィボナッチ: 89)
    '6xl': '36rem', // 36rem (576px) (フィボナッチ: 144)
    '7xl': '48rem', // 48rem (768px)
    '8xl': '64rem', // 64rem (1024px)
    '9xl': '80rem', // 80rem (1280px)
    '10xl': '96rem', // 96rem (1536px)
    '11xl': '112rem', // 112rem (1792px)
    '12xl': '128rem', // 128rem (2048px)
  };

  // デフォルト値をチェック
  if (defaultSpacingValues[size]) {
    return defaultSpacingValues[size];
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * サイズの値を取得
 */
function getSizeValue(size: string): string | null {
  if (!size) return null;

  const defaultSizes: Record<string, string> = {
    none: '0',
    '2xs': '1rem', // 1rem (16px)
    xs: '1.5rem', // 1.5rem (24px)
    sm: '2rem', // 2rem (32px)
    md: '2.5rem', // 2.5rem (40px)
    lg: '3rem', // 3rem (48px)
    xl: '4rem', // 4rem (64px)
    '2xl': '6rem', // 6rem (96px)
    '3xl': '8rem', // 8rem (128px)
    '4xl': '12rem', // 12rem (192px)
    '5xl': '16rem', // 16rem (256px)
    '6xl': '20rem', // 20rem (320px)
    '7xl': '24rem', // 24rem (384px)
    '8xl': '32rem', // 32rem (512px)
    '9xl': '48rem', // 48rem (768px)
    '10xl': '64rem', // 64rem (1024px)
    '11xl': '80rem', // 80rem (1280px)
    '12xl': '96rem', // 96rem (1536px)
    full: '100%',
    auto: 'auto',
    fit: 'fit-content',
    min: 'min-content',
    max: 'max-content',
    screen: '100vw',
    svh: '100svh',
    lvh: '100lvh',
    dvh: '100dvh',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  // Width/Height用のレスポンシブサイズ
  const responsiveSizes: Record<string, string> = {
    svh: '100svh', // スモールビューポートハイト
    lvh: '100lvh', // ラージビューポートハイト
  };

  // デフォルト値をチェック
  if (defaultSizes[size]) {
    return defaultSizes[size];
  }

  // レスポンシブサイズをチェック
  if (responsiveSizes[size]) {
    return responsiveSizes[size];
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * Grid用のサイズ値を取得
 */
function getGridValue(size: string): string | null {
  if (!size) return null;

  const gridSizes: Record<string, string> = {
    none: '0',
    '1': 'repeat(1, minmax(0, 1fr))',
    '2': 'repeat(2, minmax(0, 1fr))',
    '3': 'repeat(3, minmax(0, 1fr))',
    '4': 'repeat(4, minmax(0, 1fr))',
    '5': 'repeat(5, minmax(0, 1fr))',
    '6': 'repeat(6, minmax(0, 1fr))',
    '7': 'repeat(7, minmax(0, 1fr))',
    '8': 'repeat(8, minmax(0, 1fr))',
    '9': 'repeat(9, minmax(0, 1fr))',
    '10': 'repeat(10, minmax(0, 1fr))',
    '11': 'repeat(11, minmax(0, 1fr))',
    '12': 'repeat(12, minmax(0, 1fr))',
    subgrid: 'subgrid',
  };

  // Grid専用値をチェック
  if (gridSizes[size]) {
    return gridSizes[size];
  }

  // 数値の場合は repeat() で包む（col-span、row-spanでは単純な数値として使用）
  if (/^\d+$/.test(size)) {
    return `repeat(${size}, minmax(0, 1fr))`;
  }

  // カスタム値（[値]形式）の場合
  if (size.startsWith('[') && size.endsWith(']')) {
    let customValue = size.slice(1, -1);

    // 数値の場合
    if (/^\d+$/.test(customValue)) {
      return `repeat(${customValue}, minmax(0, 1fr))`;
    }

    // カンマ区切りのテンプレート値の場合、カンマをスペースに変換
    if (customValue.includes(',')) {
      customValue = customValue.replace(/,/g, ' ');
    }

    return customValue;
  }

  return null;
}

/**
 * 色の値を取得
 */
function getColorValue(colorName: string): string | null {
  if (!colorName) return null;

  // デフォルトの色値をチェック
  if (defaultColorConfig[colorName]) {
    return defaultColorConfig[colorName];
  }

  // 基本色名の場合、デフォルトの500番を試す
  const baseColors = [
    'blue',
    'red',
    'green',
    'yellow',
    'purple',
    'orange',
    'pink',
    'indigo',
    'sky',
    'teal',
    'emerald',
    'amber',
    'gray',
  ];

  if (baseColors.includes(colorName)) {
    const defaultColorKey = `${colorName}-500`;
    if (defaultColorConfig[defaultColorKey]) {
      return defaultColorConfig[defaultColorKey];
    }
  }

  // カスタム値（[値]形式）の場合
  if (colorName.startsWith('[') && colorName.endsWith(']')) {
    let customValue = colorName.slice(1, -1);

    // CSS関数（rgb, hsl等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(rgb|rgba|hsl|hsla|hwb|lab|oklab|lch|oklch)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}

/**
 * フォントサイズの値を取得
 */
function getFontSizeValue(fontSize: string): string | null {
  if (!fontSize) return null;

  // デフォルトのfont-size値をチェック
  if (defaultFontSizeConfig[fontSize]) {
    return defaultFontSizeConfig[fontSize];
  }

  // カスタム値（[値]形式）の場合
  if (fontSize.startsWith('[') && fontSize.endsWith(']')) {
    let customValue = fontSize.slice(1, -1);

    // CSS関数（calc, clamp, min, max等）内のカンマの後にスペースを追加
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/gi;
    if (cssFunctions.test(customValue)) {
      // カンマの後にスペースがない場合は追加
      customValue = customValue.replace(/,(?!\s)/g, ', ');
    }

    return customValue;
  }

  return null;
}
