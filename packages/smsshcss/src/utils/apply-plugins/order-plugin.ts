import { createApplyPlugin } from '../apply-system';
import { normalizeCustomValue } from '../value-helpers';

// デフォルトのOrder設定（既存コードから抽出）
const defaultOrder = {
  'order-1': '1',
  'order-2': '2',
  'order-3': '3',
  'order-4': '4',
  'order-5': '5',
  'order-6': '6',
  'order-7': '7',
  'order-8': '8',
  'order-9': '9',
  'order-10': '10',
  'order-11': '11',
  'order-12': '12',
  'order-first': '-9999',
  'order-last': '9999',
  'order-none': '0',
};

/**
 * Order用Applyプラグイン
 * order関連のユーティリティクラスをサポート
 */
export const orderPlugin = createApplyPlugin({
  name: 'order',
  patterns: [
    // Order: order-1, order-first, order-last など
    /^order-(.+)$/,
  ],
  extractCSS: (utilityClass: string, match: RegExpMatchArray) => {
    const [, order] = match;
    const key = `order-${order}`;

    // 事前定義された値を確認
    if (defaultOrder[key as keyof typeof defaultOrder]) {
      return `order: ${defaultOrder[key as keyof typeof defaultOrder]};`;
    }

    // カスタム値の場合 (例: order-[5])
    if (order.startsWith('[') && order.endsWith(']')) {
      const value = order.slice(1, -1);
      const normalizedValue = normalizeCustomValue(value);
      return `order: ${normalizedValue};`;
    }

    return null;
  },
  priority: 6,
});
