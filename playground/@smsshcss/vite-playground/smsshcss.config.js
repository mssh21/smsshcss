/**
 * SmsshCSS 設定ファイル
 * ESMとCJSの両方のモジュール形式に対応
 */

// 共通の設定オブジェクト
const config = {
  // スキャン対象のファイル
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 常に含めるクラス
  safelist: [],
  // reset.cssを含めるかどうか (デフォルトはtrue)
  includeResetCSS: true,
  // base.cssを含めるかどうか (デフォルトはtrue)
  includeBaseCSS: true,
  // レガシーモードを無効化（@importが不要になります）
  legacyMode: false,
  // デバッグモード (オプション)
  debug: true,

  // テーマ設定 - トークンのカスタマイズ
  theme: {
    // カラーのカスタマイズ
    colors: {
      primary: '#FF5500', // オレンジ色
      secondary: '#00AA55', // 緑色
      textPrimary: '#222222', // 濃い黒色
      backgroundBase: '#F8F8F8' // 薄いグレー
    },
    // フォントウェイトのカスタマイズ
    fontWeight: {
      normal: '400',
      bold: '700'
    },
    // フォントサイズのカスタマイズ
    fontSize: {
      base: '14px', // 少し小さめのベースフォント
      xl: '28px',   // 大きめの見出し
      '2xl': '36px' // より大きな見出し
    },
    // 行の高さのカスタマイズ
    lineHeight: {
      normal: '1.5',
      relaxed: '1.75'
    },
    // スペーシングのカスタマイズ
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px'
    },
    // ボーダー半径のカスタマイズ
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px'
    },
    // シャドウのカスタマイズ
    shadow: {
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }
  }
};

// 共有テーマオブジェクトのみをエクスポート（ESM形式で使用する場合）
export const sharedTheme = config.theme;

// 設定全体をエクスポート（ESM形式で使用する場合）
export default config;

// CommonJS形式でのエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
  // 共有テーマオブジェクトもエクスポート
  module.exports.sharedTheme = config.theme;
}
