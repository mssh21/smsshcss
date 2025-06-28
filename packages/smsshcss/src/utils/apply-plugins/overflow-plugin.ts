import { createApplyPlugin } from '../apply-system';

// デフォルトのOverflow設定（既存コードから抽出）
const defaultOverflow = {
  'overflow-auto': 'auto',
  'overflow-hidden': 'hidden',
  'overflow-visible': 'visible',
  'overflow-scroll': 'scroll',
  'overflow-clip': 'clip',
  'overflow-x-auto': 'auto',
  'overflow-x-hidden': 'hidden',
  'overflow-x-visible': 'visible',
  'overflow-x-scroll': 'scroll',
  'overflow-x-clip': 'clip',
  'overflow-y-auto': 'auto',
  'overflow-y-hidden': 'hidden',
  'overflow-y-visible': 'visible',
  'overflow-y-scroll': 'scroll',
  'overflow-y-clip': 'clip',
};

const overflowPropertyMap: Record<string, string> = {
  'overflow-auto': 'overflow',
  'overflow-hidden': 'overflow',
  'overflow-visible': 'overflow',
  'overflow-scroll': 'overflow',
  'overflow-clip': 'overflow',
  'overflow-x-auto': 'overflow-x',
  'overflow-x-hidden': 'overflow-x',
  'overflow-x-visible': 'overflow-x',
  'overflow-x-scroll': 'overflow-x',
  'overflow-x-clip': 'overflow-x',
  'overflow-y-auto': 'overflow-y',
  'overflow-y-hidden': 'overflow-y',
  'overflow-y-visible': 'overflow-y',
  'overflow-y-scroll': 'overflow-y',
  'overflow-y-clip': 'overflow-y',
};

/**
 * Overflow用Applyプラグイン
 * overflow関連のユーティリティクラスをサポート
 */
export const overflowPlugin = createApplyPlugin({
  name: 'overflow',
  patterns: [
    // Overflow: overflow-hidden, overflow-x-auto, overflow-y-scroll など
    /^overflow(-[xy])?-(auto|hidden|visible|scroll|clip)$/,
  ],
  extractCSS: (utilityClass: string, _match: RegExpMatchArray): string | null => {
    const key = utilityClass;

    // 事前定義された値を確認
    if (defaultOverflow[key as keyof typeof defaultOverflow]) {
      const property = overflowPropertyMap[key];
      const value = defaultOverflow[key as keyof typeof defaultOverflow];
      return `${property}: ${value};`;
    }

    return null;
  },
  priority: 6,
});
