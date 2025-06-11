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
      // 📁 スキャンするファイルパターン
      content: [
        'index.html',
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte,astro}',
        'components/**/*.{js,ts,jsx,tsx,vue,svelte}',
        'pages/**/*.{js,ts,jsx,tsx,vue,svelte}',
        'app/**/*.{js,ts,jsx,tsx,vue,svelte}',
        // Astro の場合
        // 'src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}',
      ],

      // 📝 基本CSS・リセットCSSの包含設定
      includeReset: true, // Normalize/Reset CSSを含める
      includeBase: true, // 基本スタイルを含める

      // 🗜️ CSS パージ設定（本番環境で最適化）
      purge: {
        enabled: true, // 自動で本番環境でのみ有効化

        // 保護対象のクラス（削除されない）
        safelist: [
          // 動的に生成されるクラス
          'm-2xl',
          'p-2xl',
          'gap-2xl',

          // パターンマッチング（正規表現）
          /^hover:/, // hover系の疑似クラス
          /^focus:/, // focus系の疑似クラス
          /^sm:/, // レスポンシブクラス（将来の実装）
          /^md:/,
          /^lg:/,
          /^xl:/,

          // よく使われる動的クラス
          /^bg-/,
          /^text-/,
          /^border-/,
        ],

        // 除外対象のクラス（強制的に削除）
        blocklist: [
          'm-2xs', // 使用しない小さすぎるマージン
          'p-2xs', // 使用しない小さすぎるパディング
          'gap-2xs', // 使用しない小さすぎるギャップ
          /^deprecated-/, // 廃止されたクラス
          /^old-/, // 古いクラス
        ],

        // CSS内の特殊構文の処理
        keyframes: true, // @keyframesを保持
        fontFace: true, // @font-faceを保持
        variables: true, // CSS変数を保持
      },

      // 🎨 テーマ設定（ユーティリティクラスの値をカスタマイズ）
      theme: {
        // 📏 スペーシング値の拡張（m-*, p-*, gap-* で使用）
        spacing: {
          // 数値ベースのサイズ
          72: '18rem', // m-72, p-72, gap-72
          80: '20rem', // m-80, p-80, gap-80
          96: '24rem', // m-96, p-96, gap-96
          128: '32rem', // m-128, p-128, gap-128

          // セマンティックな名前（プロジェクト固有）
          sidebar: '280px', // m-sidebar, p-sidebar
          header: '64px', // m-header, p-header
          footer: '120px', // m-footer, p-footer
          card: '1.5rem', // m-card, p-card
          section: '3rem', // m-section, p-section

          // デザインシステムに合わせたカスタム値
          'component-padding': '24px',
          'layout-gap': '32px',
        },

        // 📐 幅の値の拡張（w-*, min-w-*, max-w-* で使用）
        width: {
          // 大きなサイズ
          128: '32rem', // w-128
          144: '36rem', // w-144
          160: '40rem', // w-160

          // プロジェクト固有の幅
          sidebar: '280px', // w-sidebar
          'sidebar-mini': '64px', // w-sidebar-mini
          content: '1024px', // w-content
          container: '1200px', // w-container
          'container-wide': '1400px', // w-container-wide

          // レスポンシブ幅
          mobile: '375px', // w-mobile
          tablet: '768px', // w-tablet
          desktop: '1024px', // w-desktop
        },

        // 📏 高さの値の拡張（h-*, min-h-*, max-h-* で使用）
        height: {
          // 大きなサイズ
          128: '32rem', // h-128
          144: '36rem', // h-144
          160: '40rem', // h-160

          // プロジェクト固有の高さ
          header: '64px', // h-header
          'header-mobile': '56px', // h-header-mobile
          footer: '120px', // h-footer
          toolbar: '48px', // h-toolbar
          nav: '80px', // h-nav

          // ビューポート単位
          'vh-minus-header': 'calc(100vh - 64px)', // h-vh-minus-header
          'vh-minus-nav': 'calc(100vh - 80px)', // h-vh-minus-nav
        },

        // 🏗️ グリッドカラムの設定
        gridCols: {
          16: '16', // grid-cols-16
          20: '20', // grid-cols-20
          24: '24', // grid-cols-24
        },

        // 🏗️ グリッドローの設定
        gridRows: {
          7: '7', // grid-rows-7
          8: '8', // grid-rows-8
          12: '12', // grid-rows-12
        },

        // 📚 Z-index値の拡張（z-* で使用）
        zIndex: {
          // 数値ベース
          60: '60', // z-60
          70: '70', // z-70
          80: '80', // z-80
          90: '90', // z-90
          100: '100', // z-100

          // セマンティックな名前
          dropdown: '1000', // z-dropdown
          modal: '2000', // z-modal
          overlay: '2500', // z-overlay
          tooltip: '3000', // z-tooltip
          notification: '4000', // z-notification
          debug: '9999', // z-debug
        },

        // 📋 Order値の拡張（order-* で使用）
        order: {
          // 数値ベース
          13: '13', // order-13
          14: '14', // order-14
          15: '15', // order-15
          16: '16', // order-16

          // セマンティックな名前（レイアウト順序）
          header: '-10', // order-header
          nav: '-5', // order-nav
          main: '0', // order-main（デフォルト）
          aside: '5', // order-aside
          footer: '10', // order-footer
        },

        // 📺 Display値の拡張（必要に応じて）
        display: {
          // 通常は不要ですが、カスタムディスプレイ値が必要な場合
          // 'custom-flex': 'flex',
          // 'custom-grid': 'grid',
        },
      },

      // 🚀 パフォーマンス設定（v2.2.0+）
      cache: true, // キャッシュを有効化（開発時の高速化）

      // 🐛 デバッグ設定（v2.2.0+）
      debug: import.meta.env.DEV, // 開発時のみデバッグログを表示

      // 📊 パージレポート表示（本番ビルド時）
      showPurgeReport: import.meta.env.PROD,

      // ⚠️ CSS Minify設定
      // arbitrary value syntax（gap-[min(1rem, 3vw)]など）使用時は false に設定
      minify: true,
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
