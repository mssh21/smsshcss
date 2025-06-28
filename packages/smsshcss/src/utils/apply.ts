import { ApplyConfig } from '../core/types';
import {
  getSpacingValue,
  getSizeValue,
  getColorValue,
  getFontSizeValue,
  getGridValue,
  normalizeCustomValue,
} from './value-helpers';

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
