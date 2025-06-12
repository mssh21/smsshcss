import { ApplyConfig } from '../core/types';

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
      classes.push(`.${className} {
${cssRules.map((rule) => `  ${rule}`).join('\n')}
}`);
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
  };
  if (flexboxMap[utilityClass]) {
    return flexboxMap[utilityClass];
  }

  // gap
  const gapMatch = utilityClass.match(/^gap-(.+)$/);
  if (gapMatch) {
    const [, size] = gapMatch;
    const value = getSpacingValue(size);
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
  const defaultSizes: Record<string, string> = {
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
    screen: '100vw',
    dvh: '100dvh',
    dvw: '100dvw',
    cqw: '100cqw',
    cqi: '100cqi',
    cqmin: '100cqmin',
    cqmax: '100cqmax',
  };

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
function getSizeValue(size: string): string | null {
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

  // カスタム値（[値]形式）の場合はそのまま返す
  if (size.startsWith('[') && size.endsWith(']')) {
    return size.slice(1, -1);
  }

  return null;
}
