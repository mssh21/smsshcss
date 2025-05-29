import { FlexboxConfig } from '../core/types';

// デフォルトのFlexbox設定
const defaultFlexbox: FlexboxConfig = {
  // Flex Direction
  'flex-row': 'row',
  'flex-row-reverse': 'row-reverse',
  'flex-col': 'column',
  'flex-col-reverse': 'column-reverse',

  // Flex Wrap
  'flex-wrap': 'wrap',
  'flex-wrap-reverse': 'wrap-reverse',
  'flex-nowrap': 'nowrap',

  // Justify Content
  'justify-start': 'flex-start',
  'justify-end': 'flex-end',
  'justify-center': 'center',
  'justify-between': 'space-between',
  'justify-around': 'space-around',
  'justify-evenly': 'space-evenly',

  // Align Items
  'items-start': 'flex-start',
  'items-end': 'flex-end',
  'items-center': 'center',
  'items-baseline': 'baseline',
  'items-stretch': 'stretch',

  // Align Content
  'content-start': 'flex-start',
  'content-end': 'flex-end',
  'content-center': 'center',
  'content-between': 'space-between',
  'content-around': 'space-around',
  'content-evenly': 'space-evenly',

  // Align Self
  'self-auto': 'auto',
  'self-start': 'flex-start',
  'self-end': 'flex-end',
  'self-center': 'center',
  'self-stretch': 'stretch',

  // Flex
  'flex-1': '1 1 0%',
  'flex-auto': '1 1 auto',
  'flex-initial': '0 1 auto',
  'flex-none': 'none',
};

// プロパティマッピング
const propertyMap: Record<string, string> = {
  'flex-row': 'flex-direction',
  'flex-row-reverse': 'flex-direction',
  'flex-col': 'flex-direction',
  'flex-col-reverse': 'flex-direction',

  'flex-wrap': 'flex-wrap',
  'flex-wrap-reverse': 'flex-wrap',
  'flex-nowrap': 'flex-wrap',

  'justify-start': 'justify-content',
  'justify-end': 'justify-content',
  'justify-center': 'justify-content',
  'justify-between': 'justify-content',
  'justify-around': 'justify-content',
  'justify-evenly': 'justify-content',

  'items-start': 'align-items',
  'items-end': 'align-items',
  'items-center': 'align-items',
  'items-baseline': 'align-items',
  'items-stretch': 'align-items',

  'content-start': 'align-content',
  'content-end': 'align-content',
  'content-center': 'align-content',
  'content-between': 'align-content',
  'content-around': 'align-content',
  'content-evenly': 'align-content',

  'self-auto': 'align-self',
  'self-start': 'align-self',
  'self-end': 'align-self',
  'self-center': 'align-self',
  'self-stretch': 'align-self',

  'flex-1': 'flex',
  'flex-auto': 'flex',
  'flex-initial': 'flex',
  'flex-none': 'flex',
};

export function generateFlexboxClasses(customConfig?: FlexboxConfig): string {
  // デフォルトテーマとカスタムテーマをマージ
  const config = customConfig ? { ...defaultFlexbox, ...customConfig } : defaultFlexbox;

  const classes: string[] = [];

  // 基本的なFlexboxクラスを生成
  Object.entries(config).forEach(([key, value]) => {
    const property = propertyMap[key];
    if (property) {
      classes.push(`.${key} { ${property}: ${value}; }`);
    }
  });

  return classes.join('\n');
}
