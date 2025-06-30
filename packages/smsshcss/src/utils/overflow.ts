import { OverflowConfig } from '../core/types';

// デフォルトのOverflow設定
const defaultOverflow: OverflowConfig = {
  // Overflow
  'overflow-auto': 'auto',
  'overflow-hidden': 'hidden',
  'overflow-visible': 'visible',
  'overflow-scroll': 'scroll',
  'overflow-clip': 'clip',

  // Overflow X
  'overflow-x-auto': 'auto',
  'overflow-x-hidden': 'hidden',
  'overflow-x-visible': 'visible',
  'overflow-x-scroll': 'scroll',
  'overflow-x-clip': 'clip',

  // Overflow Y
  'overflow-y-auto': 'auto',
  'overflow-y-hidden': 'hidden',
  'overflow-y-visible': 'visible',
  'overflow-y-scroll': 'scroll',
  'overflow-y-clip': 'clip',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  // Overflow properties
  'overflow-auto': 'overflow',
  'overflow-hidden': 'overflow',
  'overflow-visible': 'overflow',
  'overflow-scroll': 'overflow',
  'overflow-clip': 'overflow',

  // Overflow-x properties
  'overflow-x-auto': 'overflow-x',
  'overflow-x-hidden': 'overflow-x',
  'overflow-x-visible': 'overflow-x',
  'overflow-x-scroll': 'overflow-x',
  'overflow-x-clip': 'overflow-x',

  // Overflow-y properties
  'overflow-y-auto': 'overflow-y',
  'overflow-y-hidden': 'overflow-y',
  'overflow-y-visible': 'overflow-y',
  'overflow-y-scroll': 'overflow-y',
  'overflow-y-clip': 'overflow-y',
};

export function generateOverflowClasses(customConfig?: OverflowConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultOverflow, ...customConfig } : defaultOverflow;

  const classes: string[] = [];

  // 基本的なOverflowクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  return classes.join('\n');
}

/**
 * Extract custom overflow classes from HTML content
 * Overflow は主に定義済みクラスを使用するため、現在はカスタム値をサポートしていません
 */
export function extractCustomOverflowClasses(_content: string): string[] {
  // Overflowは現在カスタム値をサポートしていないため、空の配列を返す
  // 将来的にoverflow-[custom-value]のようなサポートが必要な場合はここで実装
  return [];
}
