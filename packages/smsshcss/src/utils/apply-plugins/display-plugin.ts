import { createApplyPlugin } from '../apply-system';

/**
 * Display用Applyプラグイン
 * Display関連のユーティリティクラスをサポート
 */
export const displayPlugin = createApplyPlugin({
  name: 'display',
  patterns: [
    /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|none|table|table-cell|table-row|hidden)$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    const [displayType] = match;

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
      hidden: 'none', // hiddenはnoneのエイリアス
    };

    if (displayMap[displayType]) {
      return `display: ${displayMap[displayType]};`;
    }

    return null;
  },
  priority: 7,
});
