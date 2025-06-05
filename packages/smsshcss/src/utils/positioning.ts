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
