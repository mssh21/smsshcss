import {
  ComponentsConfig,
  SizeConfig,
  SpacingConfig,
  WidthConfig,
  HeightConfig,
} from '../core/types';

/**
 * コンポーネントクラスを生成する
 * @param config - コンポーネント設定
 * @param themeConfig - テーマ設定（カスタム値を含む）
 * @returns 生成されたCSSクラス文字列
 */
export function generateComponentClasses(
  config?: ComponentsConfig,
  themeConfig?: {
    spacing?: SpacingConfig;
    width?: WidthConfig;
    height?: HeightConfig;
  }
): string {
  if (!config) {
    return '';
  }

  const classes: string[] = [];

  for (const [componentName, utilities] of Object.entries(config)) {
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
      const cssRule = extractCSSFromUtility(utilityClass, themeConfig);
      if (cssRule) {
        cssRules.push(cssRule);
      }
    }

    if (cssRules.length > 0) {
      // コンポーネントクラスを生成
      classes.push(`.${componentName} {
${cssRules.map((rule) => `  ${rule}`).join('\n')}
}`);
    }
  }

  return classes.join('\n\n');
}

/**
 * ユーティリティクラスからCSSプロパティを抽出する
 * @param utilityClass - ユーティリティクラス名
 * @param themeConfig - テーマ設定
 * @returns CSSプロパティと値のペア（例: "margin: 1rem;"）
 */
function extractCSSFromUtility(
  utilityClass: string,
  themeConfig?: {
    spacing?: SpacingConfig;
    width?: WidthConfig;
    height?: HeightConfig;
  }
): string | null {
  // マージン・パディング
  const spacingMatch = utilityClass.match(/^(m|p)(t|r|b|l|x|y)?-(.+)$/);
  if (spacingMatch) {
    const [, property, direction, size] = spacingMatch;
    const prop = property === 'm' ? 'margin' : 'padding';
    const value = getSpacingValue(size, themeConfig?.spacing);

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

  // 幅
  const widthMatch = utilityClass.match(/^(min-|max-)?w-(.+)$/);
  if (widthMatch) {
    const [, prefix, size] = widthMatch;
    const prop = prefix ? `${prefix.slice(0, -1)}-width` : 'width';
    const value = getSizeValue(size, themeConfig?.width);
    if (!value) return null;
    return `${prop}: ${value};`;
  }

  // 高さ
  const heightMatch = utilityClass.match(/^(min-|max-)?h-(.+)$/);
  if (heightMatch) {
    const [, prefix, size] = heightMatch;
    const prop = prefix ? `${prefix.slice(0, -1)}-height` : 'height';
    const value = getSizeValue(size, themeConfig?.height);
    if (!value) return null;
    return `${prop}: ${value};`;
  }

  // Display
  const displayValues = [
    'block',
    'inline-block',
    'inline',
    'flex',
    'inline-flex',
    'grid',
    'inline-grid',
    'none',
    'table',
    'table-cell',
    'table-row',
    'hidden',
  ];
  if (displayValues.includes(utilityClass)) {
    const value = utilityClass === 'hidden' ? 'none' : utilityClass;
    return `display: ${value};`;
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
  };
  if (flexboxMap[utilityClass]) {
    return flexboxMap[utilityClass];
  }

  // gap
  const gapMatch = utilityClass.match(/^gap-(.+)$/);
  if (gapMatch) {
    const [, size] = gapMatch;
    const value = getSpacingValue(size, themeConfig?.spacing);
    if (!value) return null;
    return `gap: ${value};`;
  }

  // カスタム値のクラス（[値]形式）
  const customMatch = utilityClass.match(/^(m|p|gap|w|h)(?:(t|r|b|l|x|y))?-\[([^\]]+)\]$/);
  if (customMatch) {
    const [, property, direction, value] = customMatch;

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
      return `gap: ${value};`;
    } else if (property === 'w') {
      return `width: ${value};`;
    } else if (property === 'h') {
      return `height: ${value};`;
    }
  }

  // その他のユーティリティクラスは今後追加予定
  // 現時点では基本的なものに対応

  return null;
}

/**
 * スペーシングサイズの値を取得
 */
function getSpacingValue(size: string, customSpacing?: SpacingConfig): string | null {
  const defaultSizes: Record<string, string> = {
    none: '0',
    '2xs': '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '5rem',
    '5xl': '6rem',
    '6xl': '7rem',
    '7xl': '8rem',
    '8xl': '9rem',
    '9xl': '10rem',
    '10xl': '11rem',
    '11xl': '12rem',
    '12xl': '13rem',
    full: '100%',
    auto: 'auto',
  };

  // まずカスタム値をチェック
  if (customSpacing && customSpacing[size]) {
    return customSpacing[size];
  }

  // デフォルト値をチェック
  if (defaultSizes[size]) {
    return defaultSizes[size];
  }

  // カスタム値（[値]形式）の場合はそのまま返す
  if (size.startsWith('[') && size.endsWith(']')) {
    return size.slice(1, -1);
  }

  return null;
}

/**
 * サイズの値を取得
 */
function getSizeValue(size: string, customSizes?: SizeConfig): string | null {
  const defaultSizes: Record<string, string> = {
    none: '0',
    '2xs': '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '5rem',
    '5xl': '6rem',
    '6xl': '7rem',
    '7xl': '8rem',
    '8xl': '9rem',
    '9xl': '10rem',
    '10xl': '11rem',
    '11xl': '12rem',
    '12xl': '13rem',
    full: '100%',
    auto: 'auto',
    fit: 'fit-content',
    min: 'min-content',
    max: 'max-content',
    screen: '100vw',
    dvw: '100dvw',
    dvh: '100dvh',
    svh: '100svh',
    lvh: '100lvh',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

  // まずカスタム値をチェック
  if (customSizes && customSizes[size]) {
    return customSizes[size];
  }

  // デフォルト値をチェック
  if (defaultSizes[size]) {
    return defaultSizes[size];
  }

  // カスタム値（[値]形式）の場合はそのまま返す
  if (size.startsWith('[') && size.endsWith(']')) {
    return size.slice(1, -1);
  }

  return null;
}
