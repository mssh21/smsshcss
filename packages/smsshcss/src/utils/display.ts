import { DisplayConfig } from '../core/types';

// デフォルトのdisplay設定
const defaultDisplay: DisplayConfig = {
  // 基本的なレイアウト
  block: 'block',
  inline: 'inline',
  'inline-block': 'inline flow-root', // より明確な形式
  flex: 'block flex',
  'inline-flex': 'inline flex',
  grid: 'block grid',
  'inline-grid': 'inline grid',
  none: 'none',
  contents: 'contents',
  hidden: 'none', // Tailwind互換のhidden

  // 追加のレイアウト
  'flow-root': 'block flow-root', // 新しいブロック整形コンテキストを作成
  'list-item': 'block flow list-item', // リストアイテムとして表示
  'inline-table': 'inline table', // インラインの表として表示
  table: 'block table', // 表として表示
  'table-cell': 'table-cell', // 表のセルとして表示
  'table-row': 'table-row', // 表の行として表示
  'table-caption': 'table-caption', // 表のキャプションとして表示
};

export function generateDisplayClasses(): string {
  const classes: string[] = [];

  // 基本的なdisplayクラスを生成
  Object.entries(defaultDisplay).forEach(([key, value]) => {
    classes.push(`.${key} { display: ${value}; }`);
  });

  return classes.join('\n');
}
