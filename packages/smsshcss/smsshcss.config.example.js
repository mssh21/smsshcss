/**
 * SmsshCSS Configuration Example
 *
 * このファイルをコピーして `smsshcss.config.js` として使用してください
 *
 * 使用方法:
 * 1. cp smsshcss.config.example.js smsshcss.config.js
 * 2. 必要に応じて設定をカスタマイズ
 * 3. npm run validate:config で設定をチェック
 */

module.exports = {
  // 📁 スキャン対象のファイルパターン
  content: [
    'index.html',
    'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
    'components/**/*.{js,ts,jsx,tsx,vue}',
    'pages/**/*.{js,ts,jsx,tsx,vue}',
    // '**/*.html', // すべてのHTMLファイル（パフォーマンスに注意）
  ],

  // 🔒 常に含める CSS クラス（パージされない）
  safelist: [
    // 動的に生成されるクラス
    'm-2xl',
    'p-2xl',
    'mt-2xl',
    'mb-2xl',
    'mx-2xl',
    'py-2xl',
    'gap-2xl',
    'gap-x-2xl',
    'gap-y-2xl',

    // 正規表現パターン
    /^hover:p-/,
    /^focus:m-/,
    /^sm:/, // レスポンシブクラス（将来の実装）
    /^md:/,
    /^lg:/,
  ],

  // 📝 基本CSS・リセットCSSの包含設定
  includeResetCSS: true, // Normalize/Reset CSSを含める
  includeBaseCSS: true, // 基本スタイルを含める

  // 🗜️ CSS パージ設定（本番環境で推奨）
  purge: {
    enabled: process.env.NODE_ENV === 'production', // 本番環境でのみ有効化

    // パージ対象のファイル（通常はcontentと同じ）
    content: [
      'index.html',
      'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
      'components/**/*.{js,ts,jsx,tsx,vue}',
    ],

    // 保護対象のクラス（削除されない）
    safelist: [
      'm-2xl',
      'p-2xl',
      'gap-2xl',
      /^hover:/, // hover系の疑似クラス
      /^focus:/, // focus系の疑似クラス
    ],

    // 除外対象のクラス（強制的に削除）
    blocklist: [
      'm-2xs', // 使用しない小さすぎるマージン
      'p-2xs', // 使用しない小さすぎるパディング
      'gap-2xs', // 使用しない小さすぎるギャップ
      /^gap-x-2xs/,
      /^gap-y-2xs/,
    ],

    // CSS内の@keyframes、@font-face、CSS変数の処理
    keyframes: true, // @keyframesを保持
    fontFace: true, // @font-faceを保持
    variables: true, // CSS変数を保持

    // カスタム抽出器（特定の拡張子に対する処理）
    extractors: [
      {
        extensions: ['vue'],
        /**
         * @param {string} content
         * @returns {string[]}
         */
        extractor: (content) => {
          // Vue.jsのテンプレート内のクラス抽出
          const matches = content.match(/class\s*=\s*["']([^"']*)["']/g) || [];
          return matches
            .map((match) => match.replace(/class\s*=\s*["']/, '').replace(/["']$/, ''))
            .join(' ')
            .split(/\s+/);
        },
      },
    ],
  },

  // 🎨 テーマのカスタマイズ
  theme: {
    // スペーシングのカスタマイズ（フィボナッチベースを拡張）
    spacing: {
      // カスタムサイズを追加
      72: '18rem', // 288px
      84: '21rem', // 336px
      96: '24rem', // 384px
      custom: '2.5rem', // プロジェクト固有の値
    },

    // ディスプレイプロパティのカスタマイズ
    display: {
      'custom-flex': 'flex',
      'custom-grid': 'grid',
      'custom-table': 'table',
    },

    // 幅・高さのカスタマイズ
    width: {
      sidebar: '250px',
      content: '1024px',
      'full-screen': '100vw',
    },

    height: {
      header: '60px',
      footer: '120px',
      'screen-minus-header': 'calc(100vh - 60px)',
    },

    // Grid システムのカスタマイズ
    gridColumns: {
      'custom-layout': 'repeat(16, minmax(0, 1fr))', // 16列グリッド
    },

    // Z-Index のカスタマイズ
    zIndex: {
      dropdown: '1000',
      modal: '2000',
      tooltip: '3000',
    },

    // Order のカスタマイズ（Flexbox/Grid）
    order: {
      first: '-1',
      last: '999',
    },
  },

  // 🛠️ 開発者向けオプション
  development: {
    // 詳細なログ出力
    verbose: process.env.NODE_ENV === 'development',

    // バリデーションの有効化
    enableValidation: true,

    // 警告の表示
    showWarnings: true,

    // パージレポートの表示
    showPurgeReport: process.env.NODE_ENV === 'production',
  },
};

// 🎯 使用可能なスクリプト：
//
// yarn generate:utility <name>         - 新しいユーティリティクラスを生成
// pnpm generate:utility <name>         - 新しいユーティリティクラスを生成
// yarn validate:config                 - 設定ファイルの妥当性をチェック
// pnpm validate:config                 - 設定ファイルの妥当性をチェック
// yarn debug:classes                   - 生成されるCSSの詳細情報を表示
// pnpm debug:classes                   - 生成されるCSSの詳細情報を表示
// yarn check:duplicates                - 重複するセレクターをチェック
// pnpm check:duplicates                - 重複するセレクターをチェック
// yarn size:report                     - CSS サイズレポートを生成
// pnpm size:report                     - CSS サイズレポートを生成
//
// 🎯 例：
// yarn generate:utility color --css-property=color --prefix=text --default-values='{"primary":"#007bff","secondary":"#6c757d"}'
// pnpm generate:utility color --css-property=color --prefix=text --default-values='{"primary":"#007bff","secondary":"#6c757d"}'
