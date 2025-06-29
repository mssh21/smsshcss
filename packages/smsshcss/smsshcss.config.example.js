/**
 * SmsshCSS Configuration Example
 * Updated for v2.3.0 with enhanced validation and versioning support
 *
 * このファイルをコピーして `smsshcss.config.js` として使用してください
 *
 * 使用方法:
 * 1. cp smsshcss.config.example.js smsshcss.config.js
 * 2. 必要に応じて設定をカスタマイズ
 * 3. npm run validate:config で設定をチェック
 */

module.exports = {
  // バージョン情報（v2.3.0から追加）
  // 設定の互換性チェックとマイグレーション支援に使用されます
  version: '2.3.0',

  // 📁 スキャン対象のファイルパターン
  content: [
    './src/**/*.{html,js,jsx,ts,tsx,vue,svelte}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    // '**/*.html', // すべてのHTMLファイル（パフォーマンスに注意）
  ],

  // 🔒 常に含める CSS クラス（パージされない）
  safelist: [
    'btn',
    'btn-primary',
    'container',
    /^grid-cols-/, // 正規表現も使用可能
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
    content: ['./src/**/*.{html,js,jsx,ts,tsx,vue,svelte}', './public/**/*.html'],

    // 保護対象のクラス（削除されない）
    safelist: [
      'dynamic-class-*',
      /^toast-/, // 動的に追加されるクラス
    ],

    // 除外対象のクラス（強制的に削除）
    blocklist: [
      'unused-class',
      'debug-*',
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
          const classes = [];
          const classMatches = content.match(/class\s*=\s*["']([^"']*?)["']/g);
          if (classMatches) {
            classMatches.forEach((match) => {
              const classList = match.match(/["']([^"']*?)["']/);
              if (classList) {
                classes.push(...classList[1].split(/\s+/).filter(Boolean));
              }
            });
          }
          return classes;
        },
      },
    ],
  },

  // 🎨 Apply設定（よく使うユーティリティクラスの組み合わせを定義）
  // theme機能は廃止されました。カスタム値は任意値記法をご利用ください。
  apply: {
    // レイアウト系コンポーネント
    'main-layout': 'w-lg mx-auto px-lg block',
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-xl md:py-2xl',

    // カード系コンポーネント
    card: 'bg-white shadow rounded-lg p-6',
    'card-header': 'pb-sm mb-sm',
    'card-body': 'py-sm',
    'card-footer': 'pt-sm mt-sm',

    // ボタン系コンポーネント
    btn: 'px-4 py-2 rounded font-medium transition-colors',
    'btn-primary': 'bg-blue-500 text-white hover:bg-blue-600',
    'btn-secondary': 'bg-gray-200 text-gray-800 hover:bg-gray-300',

    // フォーム系コンポーネント
    'form-group': 'mb-md',
    'form-label': 'block mb-xs',
    'form-input': 'w-full px-sm py-xs',

    // グリッド系コンポーネント
    'grid-container': 'grid grid-cols-12 gap-md',
    'grid-item': 'col-span-12',

    // ヘッダー・フッター
    header: 'py-md',
    footer: 'py-lg mt-auto',

    // カスタムコンポーネントの例
    'hero-section': 'py-2xl md:py-3xl',
    'feature-box': 'p-lg',

    // よく使うユーティリティの組み合わせ
    'flex-center': 'flex justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'absolute-center': 'absolute',

    // レスポンシブなコンポーネント
    'responsive-grid': 'grid grid-cols-1 gap-md',
    'sidebar-layout': 'flex flex-col gap-lg',
  },

  // 🛠️ 開発者向けオプション
  development: {
    // 開発時はパージを無効化してビルド速度を向上
    purge: { enabled: false },
    // 詳細なログ出力
    verbose: true,

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

// 💡 Apply設定の使い方例：
//
// Apply設定により、よく使うユーティリティクラスの組み合わせを1つのクラス名で適用できます：
//
// 🏗️ レイアウト:
// <div class="main-layout">            // w-lg mx-auto px-lg block が適用される
// <div class="container">              // コンテナの設定が適用される
// <div class="flex-center">            // flex justify-center items-center が適用される
//
// 📦 コンポーネント:
// <div class="card">                   // p-md が適用される
// <button class="btn">                 // inline-block px-md py-sm が適用される
// <header class="header">              // py-md が適用される
//
// 💡 カスタム値の使用:
// カスタム値はカスタムプロパティを使って実装可能です：
// <div class="m-[var(--custom-margin)]">    // CSS変数を使用したマージン
// <div class="w-[200px]">                   // 固定幅の指定
// <div class="p-[1.5rem]">                  // カスタムパディング
