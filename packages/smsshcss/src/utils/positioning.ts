import { PositioningConfig } from '../core/types';

// デフォルトのPositioning設定
const defaultPositioning: PositioningConfig = {
  // Position
  static: 'static',
  fixed: 'fixed',
  absolute: 'absolute',
  relative: 'relative',
  sticky: 'sticky',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  // Position properties
  static: 'position',
  fixed: 'position',
  absolute: 'position',
  relative: 'position',
  sticky: 'position',
};

export function generatePositioningClasses(customConfig?: PositioningConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultPositioning, ...customConfig } : defaultPositioning;

  const classes: string[] = [];

  // 基本的なPositioningクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  return classes.join('\n');
}

/**
 * HTMLコンテンツからカスタムpositioningクラスを抽出
 * @param content HTMLコンテンツ
 * @returns 抽出されたCSSクラス配列
 */
export function extractCustomPositioningClasses(content: string): string[] {
  const classes: string[] = [];
  const classRegex = /class\s*=\s*["']([^"']*?)["']/g;

  let match;
  while ((match = classRegex.exec(content)) !== null) {
    const classNames = match[1].split(/\s+/);

    for (const className of classNames) {
      // 基本的なpositionクラス
      if (/^(static|relative|absolute|fixed|sticky)$/.test(className)) {
        const cssClass = `.${className} { position: ${className}; }`;
        if (!classes.includes(cssClass)) {
          classes.push(cssClass);
        }
      }

      // top, right, bottom, leftのカスタム値
      const customPositionMatch = className.match(/^(top|right|bottom|left)-\[([^\]]+)\]$/);
      if (customPositionMatch) {
        const [, property, value] = customPositionMatch;
        // CSS セレクターで角括弧をエスケープ
        const escapedClassName = className.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        const cssClass = `.${escapedClassName} { ${property}: ${value}; }`;
        if (!classes.includes(cssClass)) {
          classes.push(cssClass);
        }
      }

      // inset（全方向）のカスタム値
      const insetMatch = className.match(/^inset-\[([^\]]+)\]$/);
      if (insetMatch) {
        const [, value] = insetMatch;
        // CSS セレクターで角括弧をエスケープ
        const escapedClassName = className.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        const cssClass = `.${escapedClassName} { top: ${value}; right: ${value}; bottom: ${value}; left: ${value}; }`;
        if (!classes.includes(cssClass)) {
          classes.push(cssClass);
        }
      }

      // inset-x（水平方向）のカスタム値
      const insetXMatch = className.match(/^inset-x-\[([^\]]+)\]$/);
      if (insetXMatch) {
        const [, value] = insetXMatch;
        // CSS セレクターで角括弧をエスケープ
        const escapedClassName = className.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        const cssClass = `.${escapedClassName} { left: ${value}; right: ${value}; }`;
        if (!classes.includes(cssClass)) {
          classes.push(cssClass);
        }
      }

      // inset-y（垂直方向）のカスタム値
      const insetYMatch = className.match(/^inset-y-\[([^\]]+)\]$/);
      if (insetYMatch) {
        const [, value] = insetYMatch;
        // CSS セレクターで角括弧をエスケープ
        const escapedClassName = className.replace(/\[/g, '\\[').replace(/\]/g, '\\]');
        const cssClass = `.${escapedClassName} { top: ${value}; bottom: ${value}; }`;
        if (!classes.includes(cssClass)) {
          classes.push(cssClass);
        }
      }
    }
  }

  return classes;
}
