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

  // 🎨 テーマ設定（ユーティリティクラスの値をカスタマイズ）
  theme: {
    // 📏 スペーシング値の拡張
    // m-*, p-*, gap-* などで使用される値
    spacing: {
      // カスタムサイズを追加
      72: '18rem', // m-72, p-72, gap-72 など
      80: '20rem', // m-80, p-80, gap-80 など
      96: '24rem', // m-96, p-96, gap-96 など
      128: '32rem', // m-128, p-128, gap-128 など

      // セマンティックな名前（プロジェクト固有）
      sidebar: '280px', // m-sidebar, p-sidebar など
      header: '64px', // m-header, p-header など
      card: '1.5rem', // m-card, p-card など
      section: '3rem', // m-section, p-section など
    },

    // 📐 幅の値の拡張
    // w-*, min-w-*, max-w-* で使用される値
    width: {
      128: '32rem', // w-128
      144: '36rem', // w-144
      160: '40rem', // w-160

      // プロジェクト固有の幅
      sidebar: '280px', // w-sidebar
      content: '1024px', // w-content
      container: '1200px', // w-container
    },

    // 📏 高さの値の拡張
    // h-*, min-h-*, max-h-* で使用される値
    height: {
      128: '32rem', // h-128
      144: '36rem', // h-144
      160: '40rem', // h-160

      // プロジェクト固有の高さ
      header: '64px', // h-header
      footer: '120px', // h-footer
      toolbar: '56px', // h-toolbar
    },

    // 🏗️ グリッドテンプレートカラムの拡張
    // grid-cols-* で使用される値
    gridTemplateColumns: {
      16: 'repeat(16, minmax(0, 1fr))', // grid-cols-16
      20: 'repeat(20, minmax(0, 1fr))', // grid-cols-20
      24: 'repeat(24, minmax(0, 1fr))', // grid-cols-24

      // カスタムレイアウト
      'sidebar-content': '280px 1fr', // grid-cols-sidebar-content
      'nav-main-aside': '200px 1fr 300px', // grid-cols-nav-main-aside
    },

    // 🏗️ グリッドテンプレートローの拡張
    // grid-rows-* で使用される値
    gridTemplateRows: {
      7: 'repeat(7, minmax(0, 1fr))', // grid-rows-7
      8: 'repeat(8, minmax(0, 1fr))', // grid-rows-8
      12: 'repeat(12, minmax(0, 1fr))', // grid-rows-12

      // カスタムレイアウト
      'header-main-footer': '64px 1fr 120px', // grid-rows-header-main-footer
    },

    // 📚 Z-index値の拡張
    // z-* で使用される値
    zIndex: {
      60: '60', // z-60
      70: '70', // z-70
      80: '80', // z-80
      90: '90', // z-90
      100: '100', // z-100

      // セマンティックな名前
      dropdown: '1000', // z-dropdown
      modal: '2000', // z-modal
      tooltip: '3000', // z-tooltip
      notification: '4000', // z-notification
    },

    // 📋 Order値の拡張
    // order-* で使用される値
    order: {
      13: '13', // order-13
      14: '14', // order-14
      15: '15', // order-15
      16: '16', // order-16

      // セマンティックな名前
      header: '-10', // order-header
      nav: '-5', // order-nav
      main: '0', // order-main
      aside: '5', // order-aside
      footer: '10', // order-footer
    },

    // 📺 Display値の拡張
    // 新しいdisplayタイプが必要な場合
    display: {
      // 'custom-flex': 'flex', // 通常は不要
    },

    // コンポーネントクラスの定義
    components: {
      // レイアウト系コンポーネント
      'main-layout': 'w-lg mx-auto px-lg block',
      container: 'max-w-7xl mx-auto px-sm md:px-md lg:px-lg',
      section: 'py-xl md:py-2xl',

      // カード系コンポーネント
      card: 'p-md bg-white rounded-lg shadow-md',
      'card-header': 'pb-sm mb-sm border-b',
      'card-body': 'py-sm',
      'card-footer': 'pt-sm mt-sm border-t',

      // ボタン系コンポーネント
      btn: 'inline-block px-md py-sm rounded',
      'btn-primary': 'btn bg-blue-500 text-white hover:bg-blue-600',
      'btn-secondary': 'btn bg-gray-200 text-gray-800 hover:bg-gray-300',

      // フォーム系コンポーネント
      'form-group': 'mb-md',
      'form-label': 'block mb-xs font-medium',
      'form-input': 'w-full px-sm py-xs border rounded',

      // グリッド系コンポーネント
      'grid-container': 'grid grid-cols-12 gap-md',
      'grid-item': 'col-span-12 md:col-span-6 lg:col-span-4',

      // ヘッダー・フッター
      header: 'py-md border-b',
      footer: 'py-lg mt-auto border-t',

      // カスタムコンポーネントの例
      'hero-section': 'py-2xl md:py-3xl text-center',
      'feature-box': 'p-lg text-center hover:shadow-lg transition-shadow',

      // よく使うユーティリティの組み合わせ
      'flex-center': 'flex justify-center items-center',
      'flex-between': 'flex justify-between items-center',
      'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

      // レスポンシブなコンポーネント
      'responsive-grid': 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md',
      'sidebar-layout': 'flex flex-col lg:flex-row gap-lg',
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

// 💡 テーマ設定の使い方例：
//
// 🏗️ カスタムスペーシング:
// <div class="m-sidebar">              // margin: 280px;
// <div class="p-card">                 // padding: 1.5rem;
// <div class="gap-section">            // gap: 3rem;
//
// 📐 カスタム幅・高さ:
// <div class="w-sidebar">              // width: 280px;
// <div class="h-header">               // height: 64px;
// <div class="w-container">            // width: 1200px;
//
// 🏗️ カスタムグリッド:
// <div class="grid-cols-16">           // grid-template-columns: repeat(16, minmax(0, 1fr));
// <div class="grid-cols-sidebar-content"> // grid-template-columns: 280px 1fr;
//
// 📚 カスタムZ-index:
// <div class="z-modal">                // z-index: 2000;
// <div class="z-tooltip">              // z-index: 3000;
//
// 📋 カスタムOrder:
// <div class="order-header">           // order: -10;
// <div class="order-footer">           // order: 10;
