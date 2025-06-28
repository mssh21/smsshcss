import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeResetCSS: true,
      includeBaseCSS: true,
      minify: false,
      debug: false,

      content: [
        './index.html',
        './spacing.html',
        './color.html',
        './width-height.html',
        './gap.html',
        './apply.html',
        './src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        './components/**/*.{js,ts,jsx,tsx,vue}',
        './**/*.html',
      ],

      apply: {
        'main-layout': 'w-full max-w-12xl mx-auto px-md',
        container: 'w-full max-w-4xl mx-auto px-md',

        'text-notification': 'text-[rgb(255,0,0)]',
        'text-primary': 'text-[#259270]',

        'demo-title': 'font-size-xl bg-[#343a40] text-white',
        'test-card-title': 'font-size-[18px] text-[#1e293b]',
      },

      showPurgeReport: false,
    }),
  ],

  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        spacing: 'spacing.html',
        color: 'color.html',
        'width-height': 'width-height.html',
        gap: 'gap.html',
        apply: 'apply.html',
      },
    },
  },

  server: {
    port: 3000,
    open: true,
  },
});
