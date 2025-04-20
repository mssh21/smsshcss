/**
 * smsshcss ユーティリティクラス定義
 */

// ユーティリティカテゴリとクラスのタイプ定義
export type UtilityValue = string;
export type UtilityCategory = Record<string, UtilityValue>;
export type UtilityDefinition = Record<string, UtilityCategory>;

// 全ユーティリティを格納するオブジェクト
export const utilities: UtilityDefinition = {
  // ディスプレイユーティリティ
  display: {
    'block': 'display: block',
    'inline': 'display: inline',
    'inline-block': 'display: inline-block',
    'flex': 'display: flex',
    'inline-flex': 'display: inline-flex',
    'grid': 'display: grid',
    'inline-grid': 'display: inline-grid',
    'none': 'display: none'
  },
  
  // 位置ユーティリティ
  position: {
    'static': 'position: static',
    'relative': 'position: relative',
    'absolute': 'position: absolute',
    'fixed': 'position: fixed',
    'sticky': 'position: sticky'
  },
  
  // フレックスユーティリティ
  flex: {
    'flex-1': 'flex: 1 1 0%',
    'flex-auto': 'flex: 1 1 auto',
    'flex-initial': 'flex: 0 1 auto',
    'flex-none': 'flex: none'
  },
  
  // フレックス方向
  'flex-direction': {
    'flex-row': 'flex-direction: row',
    'flex-row-reverse': 'flex-direction: row-reverse',
    'flex-col': 'flex-direction: column',
    'flex-col-reverse': 'flex-direction: column-reverse'
  },
  
  // フレックスラップ
  'flex-wrap': {
    'flex-wrap': 'flex-wrap: wrap',
    'flex-nowrap': 'flex-wrap: nowrap',
    'flex-wrap-reverse': 'flex-wrap: wrap-reverse'
  },
  
  // 水平位置
  'justify-content': {
    'justify-start': 'justify-content: flex-start',
    'justify-end': 'justify-content: flex-end',
    'justify-center': 'justify-content: center',
    'justify-between': 'justify-content: space-between',
    'justify-around': 'justify-content: space-around',
    'justify-evenly': 'justify-content: space-evenly'
  },
  
  // 垂直位置
  'align-items': {
    'items-start': 'align-items: flex-start',
    'items-end': 'align-items: flex-end',
    'items-center': 'align-items: center',
    'items-baseline': 'align-items: baseline',
    'items-stretch': 'align-items: stretch'
  },
  
  // フレックスアイテム自身の垂直位置
  'align-self': {
    'self-auto': 'align-self: auto',
    'self-start': 'align-self: flex-start',
    'self-end': 'align-self: flex-end',
    'self-center': 'align-self: center',
    'self-stretch': 'align-self: stretch'
  },
  
  // グリッドユーティリティ
  'grid-template-columns': {
    'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr))',
    'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr))',
    'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr))',
    'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr))',
    'grid-cols-none': 'grid-template-columns: none'
  },
  
  'grid-template-rows': {
    'grid-rows-1': 'grid-template-rows: repeat(1, minmax(0, 1fr))',
    'grid-rows-2': 'grid-template-rows: repeat(2, minmax(0, 1fr))',
    'grid-rows-3': 'grid-template-rows: repeat(3, minmax(0, 1fr))',
    'grid-rows-none': 'grid-template-rows: none'
  },
  
  // テキスト操作
  'text-align': {
    'text-left': 'text-align: left',
    'text-center': 'text-align: center',
    'text-right': 'text-align: right',
    'text-justify': 'text-align: justify'
  },
  
  // フォントサイズ
  'font-size': {
    'text-xs': 'font-size: 0.75rem',
    'text-sm': 'font-size: 0.875rem',
    'text-base': 'font-size: 1rem',
    'text-lg': 'font-size: 1.125rem',
    'text-xl': 'font-size: 1.25rem',
    'text-2xl': 'font-size: 1.5rem',
    'text-3xl': 'font-size: 1.875rem',
    'text-4xl': 'font-size: 2.25rem'
  },
  
  // フォントウェイト
  'font-weight': {
    'font-thin': 'font-weight: 100',
    'font-light': 'font-weight: 300',
    'font-normal': 'font-weight: 400',
    'font-medium': 'font-weight: 500',
    'font-semibold': 'font-weight: 600',
    'font-bold': 'font-weight: 700',
    'font-extrabold': 'font-weight: 800',
    'font-black': 'font-weight: 900'
  }
};

/**
 * ユーティリティクラスを作成する関数
 */
export function createUtilityClass(utility: string): Record<string, string> {
  const [key, value] = utility.split(':').map(s => s.trim());
  return { [key]: value };
}

/**
 * 複数のユーティリティクラスを作成する関数
 */
export function createUtilityClasses(utilities: string[]): Record<string, string> {
  return utilities.reduce((acc, utility) => {
    return { ...acc, ...createUtilityClass(utility) };
  }, {});
}

/**
 * ユーティリティクラスをマージする関数
 */
export function mergeUtilityClasses(...classes: Record<string, string>[]): Record<string, string> {
  return classes.reduce((acc, curr) => ({ ...acc, ...curr }), {});
} 