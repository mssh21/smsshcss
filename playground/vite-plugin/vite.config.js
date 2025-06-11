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

      apply: {
        'main-layout': 'w-lg mx-auto px-lg block',
        card: 'p-md',
        'card-header': 'pb-sm mb-sm',
        'card-body': 'py-sm',
        'card-footer': 'pt-sm mt-sm',
        btn: 'inline-block px-md py-sm',
        'flex-center': 'flex justify-center items-center',
      },

      showPurgeReport: true,
    }),
  ],
});
