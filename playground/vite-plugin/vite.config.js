import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeReset: true,
      includeBase: true,
      minify: false,

      content: [
        'index.html',
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        'components/**/*.{js,ts,jsx,tsx,vue}',
        '**/*.html',
      ],

      purge: {
        enabled: true,
        safelist: [
          'm-2xl',
          'p-2xl',
          'mt-2xl',
          'mb-2xl',
          'mx-2xl',
          'py-2xl',
          'gap-2xl',
          'gap-x-2xl',
          'gap-y-2xl',
          /^hover:p-/,
          /^focus:m-/,
        ],
        blocklist: ['m-2xs', 'p-2xs', 'gap-2xs', 'mt-2xs', 'mb-2xs', /^gap-x-2xs/, /^gap-y-2xs/],
        keyframes: true,
        fontFace: true,
        variables: true,
      },

      theme: {
        spacing: {
          72: '18rem',
          84: '21rem',
          96: '24rem',
          custom: '2.5rem',
        },
        display: {
          'custom-flex': 'flex',
          'custom-grid': 'grid',
        },
        width: {
          container: '1600px',
        },
      },

      showPurgeReport: true,
    }),
  ],
});
