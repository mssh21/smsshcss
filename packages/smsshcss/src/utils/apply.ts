import { ApplyConfig } from '../core/types';
import { defaultColorConfig } from '../core/colorConfig';
import { defaultFontSizeConfig } from '../core/fontSizeConfig';

/**
 * CSS関数値をフォーマットする（カンマとマイナス記号の前後にスペースを追加）
 * @param value - CSS関数値
 * @returns フォーマットされた値
 */
function formatCSSFunction(value: string): string {
  // カンマの後にスペースがない場合は追加
  let formatted = value.replace(/,(?!\s)/g, ', ');
  // マイナス記号の前後にスペースがない場合は追加（ただし、すでにある場合は維持）
  formatted = formatted.replace(/(\S)-(?!\s)/g, '$1 - ').replace(/(?<!\s)-(\S)/g, '- $1');
  return formatted;
}

/**
 * applyクラスを生成する
 * @param config - apply設定
 * @returns 生成されたCSSクラス文字列
 */
export function generateApplyClasses(config?: ApplyConfig): string {
  if (!config) {
    console.log('[apply] No config provided');
    return '';
  }

  console.log('[apply] Generating apply classes for:', Object.keys(config));

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
      } else {
        console.log(`[apply] No CSS rule extracted for: ${utilityClass}`);
      }
    }

    if (cssRules.length > 0) {
      // applyクラスを生成
      const generatedClass = `.${className} {
${cssRules.map((rule) => `  ${rule}`).join('\n')}
}`;
      classes.push(generatedClass);
      console.log(`[apply] Generated class: ${className}`);
    }
  }

  console.log(`[apply] Total generated classes: ${classes.length}`);
  return classes.join('\n\n');
}

/**
 * ユーティリティクラスからCSSプロパティを抽出する
 * @param utilityClass - ユーティリティクラス名
 * @returns CSSプロパティと値のペア（例: "margin: 1rem;"）
 */
function extractCSSFromUtility(utilityClass: string): string | null {
  // マージン・パディング
  const spacingMatch = utilityClass.match(/^(m|p)(t|r|b|l|x|y)?-(.+)$/);
  if (spacingMatch) {
    const [, property, direction, size] = spacingMatch;
    const prop = property === 'm' ? 'margin' : 'padding';
    const value = getSpacingValue(size);

    if (!value) return null;

    if (direction === 'x') {
      return `${prop}-left: ${value};\n  ${prop}-right: ${value};`;
    } else if (direction === 'y') {
      return `${prop}-top: ${value};\n  ${prop}-bottom: ${value};`;
    } else if (direction) {
      const dirMap: Record<string, string> = {
        t: 'top',
        r: 'right',
        b: 'bottom',
        l: 'left',
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
    let value: string | null = null;

    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);
      const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        // CSS関数の場合はフォーマット
        value = formatCSSFunction(customValue);
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      // 通常のサイズ値
      value = getSizeValue(size);
    }

    if (!value) return null;
    return `flex-basis: ${value};`;
  }

  // Flex
  const flexMatch = utilityClass.match(/^flex-(.+)$/);
  if (flexMatch) {
    const [, size] = flexMatch;
    let value: string | null = null;

    // flex固定値のマッピング
    const flexValues: Record<string, string> = {
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none',
    };

    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      // 固定値の場合
      value = flexValues[size];
    }

    if (!value) return null;
    return `flex: ${value};`;
  }

  // Flex Grow
  if (utilityClass === 'grow') {
    return 'flex-grow: 1;';
  }

  const flexGrowMatch = utilityClass.match(/^grow-(.+)$/);
  if (flexGrowMatch) {
    const [, size] = flexGrowMatch;
    let value: string | null = null;

    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    }

    if (!value) return null;
    return `flex-grow: ${value};`;
  }

  // Flex Shrink
  if (utilityClass === 'shrink') {
    return 'flex-shrink: 1;';
  }

  const flexShrinkMatch = utilityClass.match(/^shrink-(.+)$/);
  if (flexShrinkMatch) {
    const [, size] = flexShrinkMatch;
    let value: string | null = null;

    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);
      const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        // CSS関数の場合はフォーマット
        value = formatCSSFunction(customValue);
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    }

    if (!value) return null;
    return `flex-shrink: ${value};`;
  }

  // Grid Columns
  const gridColsMatch = utilityClass.match(/^grid-cols-(.+)$/);
  if (gridColsMatch) {
    const [, size] = gridColsMatch;
    let value: string | null = null;

    // カスタム値（[値]形式）の場合
    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);
      const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

      if (isNumeric || isCSSVariable) {
        value = `repeat(${customValue}, minmax(0, 1fr))`;
      } else if (cssFunctions.test(customValue)) {
        // CSS関数が含まれている場合はそのまま使用
        value = customValue;
      } else {
        // 通常の値の場合のみカンマをスペースに変換
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      // Grid専用のサイズ値
      value = getGridValue(size);
    }

    if (!value) return null;
    return `grid-template-columns: ${value};`;
  }

  // Grid Rows
  const gridRowsMatch = utilityClass.match(/^grid-rows-(.+)$/);
  if (gridRowsMatch) {
    const [, size] = gridRowsMatch;
    let value: string | null = null;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);
      const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

      if (isNumeric || isCSSVariable) {
        value = `repeat(${customValue}, minmax(0, 1fr))`;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      value = getGridValue(size);
    }

    if (!value) return null;
    return `grid-template-rows: ${value};`;
  }

  // Grid Column Span
  const gridColSpanMatch = utilityClass.match(/^col-span-(.+)$/);
  if (gridColSpanMatch) {
    const [, size] = gridColSpanMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = `span ${customValue} / span ${customValue}`;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      // 通常の数値の場合は span 形式を使用
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = `span ${size} / span ${size}`;
      } else {
        // 数値以外の場合（auto、full など）は適切な値を設定
        if (size === 'auto') {
          value = 'auto';
        } else if (size === 'full') {
          value = '1 / -1';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-column: ${value};`;
  }

  // Grid Row Span
  const gridRowSpanMatch = utilityClass.match(/^row-span-(.+)$/);
  if (gridRowSpanMatch) {
    const [, size] = gridRowSpanMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = `span ${customValue} / span ${customValue}`;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      // 通常の数値の場合は span 形式を使用
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = `span ${size} / span ${size}`;
      } else {
        // 数値以外の場合（auto、full など）は適切な値を設定
        if (size === 'auto') {
          value = 'auto';
        } else if (size === 'full') {
          value = '1 / -1';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-row: ${value};`;
  }

  // Grid Column Start
  const gridColStartPositionMatch = utilityClass.match(/^col-start-(.+)$/);
  if (gridColStartPositionMatch) {
    const [, size] = gridColStartPositionMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = size;
      } else {
        // Grid position では auto のみサポート
        if (size === 'auto') {
          value = 'auto';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-column-start: ${value};`;
  }

  // Grid Column End
  const gridColEndPositionMatch = utilityClass.match(/^col-end-(.+)$/);
  if (gridColEndPositionMatch) {
    const [, size] = gridColEndPositionMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = size;
      } else {
        // Grid position では auto のみサポート
        if (size === 'auto') {
          value = 'auto';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-column-end: ${value};`;
  }

  // Grid Row Start
  const gridRowStartPositionMatch = utilityClass.match(/^row-start-(.+)$/);
  if (gridRowStartPositionMatch) {
    const [, size] = gridRowStartPositionMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = size;
      } else {
        // Grid position では auto のみサポート
        if (size === 'auto') {
          value = 'auto';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-row-start: ${value};`;
  }

  // Grid Row End
  const gridRowEndPositionMatch = utilityClass.match(/^row-end-(.+)$/);
  if (gridRowEndPositionMatch) {
    const [, size] = gridRowEndPositionMatch;
    let value: string | null = null;
    const cssFunctions = /\b(calc|min|max|clamp|minmax|var)\s*\(/;

    if (size.startsWith('[') && size.endsWith(']')) {
      const customValue = size.slice(1, -1);
      const isNumeric = /^\d+$/.test(customValue);
      const isCSSVariable = /^var\(--/.test(customValue);

      if (isNumeric || isCSSVariable) {
        value = customValue;
      } else if (cssFunctions.test(customValue)) {
        value = customValue;
      } else {
        value = customValue.replace(/,/g, ' ');
      }
    } else {
      const isNumeric = /^\d+$/.test(size);
      if (isNumeric) {
        value = size;
      } else {
        // Grid position では auto のみサポート
        if (size === 'auto') {
          value = 'auto';
        } else {
          value = null; // 不明な値は処理しない
        }
      }
    }

    if (!value) return null;
    return `grid-row-end: ${value};`;
  }

  // 色関連のクラス - text
  const colorMatch = utilityClass.match(/^text-(.+)$/);
  if (colorMatch) {
    const [, colorName] = colorMatch;
    const colorValue = getColorValue(colorName);
    if (colorValue) {
      return `color: ${colorValue};`;
    }
  }

  // 色関連のクラス - bg
  const bgColorMatch = utilityClass.match(/^bg-(.+)$/);
  if (bgColorMatch) {
    const [, colorName] = bgColorMatch;
    const colorValue = getColorValue(colorName);
    if (colorValue) {
      return `background-color: ${colorValue};`;
    }
  }

  // 色関連のクラス - border
  const borderColorMatch = utilityClass.match(/^border-(.+)$/);
  if (borderColorMatch) {
    const [, colorName] = borderColorMatch;
    const colorValue = getColorValue(colorName);
    if (colorValue) {
      return `border-color: ${colorValue};`;
    }
  }

  // 色関連のクラス - fill
  const fillColorMatch = utilityClass.match(/^fill-(.+)$/);
  if (fillColorMatch) {
    const [, colorName] = fillColorMatch;
    const colorValue = getColorValue(colorName);
    if (colorValue) {
      return `fill: ${colorValue};`;
    }
  }

  // フォントサイズ
  const fontSizeMatch = utilityClass.match(/^font-size-(.+)$/);
  if (fontSizeMatch) {
    const [, fontSize] = fontSizeMatch;
    const fontSizeValue = getFontSizeValue(fontSize);
    if (fontSizeValue) {
      return `font-size: ${fontSizeValue};`;
    }
  }

  // カスタム値のクラス（[値]形式）
  const customMatch = utilityClass.match(
    /^(m|p|gap|w|min-w|max-w|h|min-h|max-h|grid|col|col-span|row|row-span|col-start|col-end|row-start|row-end|basis|text|bg|border|fill|font-size)(-([xy]|[trbl]))?-\[([^\]]+)\]$/
  );
  if (customMatch) {
    const [, property, , direction, value] = customMatch;

    if (property === 'm' || property === 'p') {
      const prop = property === 'm' ? 'margin' : 'padding';
      if (direction === 'x') {
        return `${prop}-left: ${value};\n  ${prop}-right: ${value};`;
      } else if (direction === 'y') {
        return `${prop}-top: ${value};\n  ${prop}-bottom: ${value};`;
      } else if (direction) {
        const dirMap: Record<string, string> = {
          t: 'top',
          r: 'right',
          b: 'bottom',
          l: 'left',
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
    } else if (property === 'text') {
      return `color: ${value};`;
    } else if (property === 'bg') {
      return `background-color: ${value};`;
    } else if (property === 'border') {
      return `border: ${value};`;
    } else if (property === 'fill') {
      return `fill: ${value};`;
    } else if (property === 'font-size') {
      return `font-size: ${value};`;
    }
  }

  // その他のユーティリティクラスは今後追加予定
  // 現時点では基本的なものに対応

  return null;
}

/**
 * スペーシングサイズの値を取得
 */
function getSpacingValue(size: string): string | null {
  if (!size) return null;

  const defaultSpacingValues: Record<string, string> = {
    none: '0',
    auto: 'auto',
    '2xs': 'var(--space-base)', // 0.25rem (4px)
    xs: 'calc(var(--space-base) * 2)', // 0.5rem (8px)
    sm: 'calc(var(--space-base) * 3)', // 0.75rem (12px)
    md: 'calc(var(--space-base) * 5)', // 1.25rem (20px)
    lg: 'calc(var(--space-base) * 8)', // 2rem (32px)
    xl: 'calc(var(--space-base) * 13)', // 3.25rem (52px)
    '2xl': 'calc(var(--space-base) * 21)', // 5.25rem (84px)
    '3xl': 'calc(var(--space-base) * 34)', // 8.5rem (136px)
    '4xl': 'calc(var(--space-base) * 55)', // 13.75rem (220px)
    '5xl': 'calc(var(--space-base) * 89)', // 22.25rem (356px)
    '6xl': 'calc(var(--space-base) * 144)', // 36rem (576px)
    '7xl': 'calc(var(--space-base) * 192)', // 48rem (768px)
    '8xl': 'calc(var(--space-base) * 256)', // 64rem (1024px)
    '9xl': 'calc(var(--space-base) * 320)', // 80rem (1280px)
    '10xl': 'calc(var(--space-base) * 384)', // 96rem (1536px)
    '11xl': 'calc(var(--space-base) * 448)', // 112rem (1792px)
    '12xl': 'calc(var(--space-base) * 512)', // 128rem (2048px)
    full: '100%',
    fit: 'fit-content',
    min: 'min-content',
    max: 'max-content',
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
    '2xs': 'var(--size-base)', // 1rem (16px)
    xs: 'calc(var(--size-base) * 1.5)', // 1.5rem (24px)
    sm: 'calc(var(--size-base) * 2)', // 2rem (32px)
    md: 'calc(var(--size-base) * 2.5)', // 2.5rem (40px)
    lg: 'calc(var(--size-base) * 3)', // 3rem (48px)
    xl: 'calc(var(--size-base) * 4)', // 4rem (64px)
    '2xl': 'calc(var(--size-base) * 6)', // 6rem (96px)
    '3xl': 'calc(var(--size-base) * 8)', // 8rem (128px)
    '4xl': 'calc(var(--size-base) * 12)', // 12rem (192px)
    '5xl': 'calc(var(--size-base) * 16)', // 16rem (256px)
    '6xl': 'calc(var(--size-base) * 20)', // 20rem (320px)
    '7xl': 'calc(var(--size-base) * 24)', // 24rem (384px)
    '8xl': 'calc(var(--size-base) * 32)', // 32rem (512px)
    '9xl': 'calc(var(--size-base) * 48)', // 48rem (768px)
    '10xl': 'calc(var(--size-base) * 64)', // 64rem (1024px)
    '11xl': 'calc(var(--size-base) * 80)', // 80rem (1280px)
    '12xl': 'calc(var(--size-base) * 96)', // 96rem (1536px)
    full: '100%',
    auto: 'auto',
    fit: 'fit-content',
    min: 'min-content',
    max: 'max-content',
    screen: '100vw',
    dvh: '100dvh',
    dvw: '100dvw',
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

  // カスタム値（[値]形式）の場合はそのまま返す
  if (size.startsWith('[') && size.endsWith(']')) {
    return size.slice(1, -1);
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
