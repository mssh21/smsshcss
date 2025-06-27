/**
 * SmsshCSS Vite Plugin Configuration Example
 *
 * このファイルをコピーして `vite.config.js` として使用してください
 *
 * 使用方法:
 * 1. cp vite.config.example.js vite.config.js
 * 2. 必要に応じて設定をカスタマイズ
 * 3. pnpm dev または npm run dev でサーバーを起動
 */

import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

// React用の場合（必要に応じて）
// import react from '@vitejs/plugin-react';

// Vue用の場合（必要に応じて）
// import vue from '@vitejs/plugin-vue';

// Svelte用の場合（必要に応じて）
// import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    // フレームワークプラグイン（必要に応じてコメントアウト）
    // react(),
    // vue(),
    // svelte(),

    // 🎨 SmsshCSS Vite Plugin
    smsshcss({
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

      // 🎨 Apply設定（よく使うユーティリティクラスの組み合わせを定義）
      apply: {
        // レイアウト系コンポーネント
        'main-layout': 'w-lg mx-auto px-lg block',
        container: 'max-w-[var(--container-width)] mx-auto px-sm md:px-md lg:px-lg',
        section: 'py-xl md:py-2xl',

        // カード系コンポーネント
        card: 'p-md',
        'card-header': 'pb-sm mb-sm',
        'card-body': 'py-sm',
        'card-footer': 'pt-sm mt-sm',

        // ボタン系コンポーネント
        btn: 'inline-block px-md py-sm',
        'btn-primary': 'btn',
        'btn-secondary': 'btn',

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
    }),
  ],

  // 🔧 Vite設定
  build: {
    // CSS関連の設定
    cssCodeSplit: true,
    cssMinify: true,

    // アセット関連
    assetsDir: 'assets',

    // ロールアップ設定
    rollupOptions: {
      output: {
        // CSS ファイル名の設定
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },

  // 📁 エイリアス設定（必要に応じて）
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@utils': '/src/utils',
      '@styles': '/src/styles',
    },
  },

  // 🌐 開発サーバー設定
  server: {
    port: 3000,
    open: true,

    // HMR設定
    hmr: {
      overlay: true,
    },
  },

  // 🧪 テスト設定（Vitest使用時）
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});

// 💡 設定のヒント:
//
// 🎨 カスタムテーマの使い方:
// <div class="m-sidebar">           // margin: 280px;
// <div class="p-card">              // padding: 1.5rem;
// <div class="w-container">         // width: 1200px;
// <div class="h-header">            // height: 64px;
// <div class="z-modal">             // z-index: 2000;
// <div class="order-header">        // order: -10;
//
// 🚀 パフォーマンス最適化:
// - 開発時: cache=true, debug=true, purge.enabled=false
// - 本番時: cache=false, debug=false, purge.enabled=true
//
// 📝 よく使う設定パターン:
//
// // React + TypeScript
// export default defineConfig({
//   plugins: [react(), smsshcss({ /* 設定 */ })],
// });
//
// // Vue 3 + TypeScript
// export default defineConfig({
//   plugins: [vue(), smsshcss({ /* 設定 */ })],
// });
//
// // Svelte + TypeScript
// export default defineConfig({
//   plugins: [svelte(), smsshcss({ /* 設定 */ })],
// });
//
// // Astro
// export default defineConfig({
//   integrations: [/* Astro統合 */],
//   vite: {
//     plugins: [smsshcss({ /* 設定 */ })],
//   },
// });

// 🔍 デバッグコマンド:
// pnpm dev --debug           # デバッグモードで開発サーバー起動
// pnpm build --reporter      # パージレポート付きでビルド
// pnpm preview              # ビルド結果をプレビュー
