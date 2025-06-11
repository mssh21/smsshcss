import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';

export default defineConfig({
  plugins: [
    smsshcss({
      includeReset: true,
      includeBase: true,
      minify: false,
      debug: true,

      content: [
        'index.html',
        'src/**/*.{html,js,ts,jsx,tsx,vue,svelte}',
        'components/**/*.{js,ts,jsx,tsx,vue}',
        '**/*.html',
      ],

      purge: {
        enabled: false,
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
        'main-layout': 'w-full max-w-12xl mx-auto px-md',
        container: 'w-full max-w-4xl mx-auto px-md',
        'section-spacing': 'py-xl px-lg',

        card: 'p-lg bg-white border border-gray-200 rounded-lg shadow-sm',
        'card-header': 'pb-md mb-md border-b border-gray-100',
        'card-body': 'py-md',
        'card-footer': 'pt-md mt-md border-t border-gray-100',

        btn: 'inline-flex items-center justify-center px-md py-sm text-sm font-medium rounded-md transition-colors',
        'btn-primary': 'btn bg-blue-600 text-white hover:bg-blue-700',
        'btn-secondary': 'btn bg-gray-200 text-gray-900 hover:bg-gray-300',
        'btn-danger': 'btn bg-red-600 text-white hover:bg-red-700',
        'btn-sm': 'px-sm py-xs text-xs',
        'btn-lg': 'px-lg py-md text-base',

        'flex-center': 'flex justify-center items-center',
        'flex-between': 'flex justify-between items-center',
        'flex-col-center': 'flex flex-col justify-center items-center',
        'grid-auto-fit': 'grid gap-md',
        'grid-2-cols': 'grid grid-cols-2 gap-md',
        'grid-3-cols': 'grid grid-cols-3 gap-md',
        'grid-4-cols': 'grid grid-cols-4 gap-sm',

        'heading-1': 'text-3xl font-bold leading-tight mb-md',
        'heading-2': 'text-2xl font-semibold leading-tight mb-sm',
        'heading-3': 'text-xl font-medium leading-tight mb-sm',
        'body-text': 'text-base leading-relaxed',
        caption: 'text-sm text-gray-600',

        'form-group': 'mb-md',
        'form-label': 'block text-sm font-medium mb-xs',
        'form-input':
          'w-full px-sm py-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500',
        'form-textarea': 'form-input min-h-[100px] resize-vertical',
        'form-select': 'form-input appearance-none bg-white',

        'visually-hidden': 'sr-only',
        'text-truncate': 'truncate',
        'aspect-square': 'aspect-ratio-1/1',
        'aspect-video': 'aspect-ratio-16/9',

        interactive: 'cursor-pointer transition-all duration-200 hover:scale-105',
        disabled: 'opacity-50 cursor-not-allowed pointer-events-none',
        loading: 'animate-pulse',

        'stack-sm': 'space-y-sm',
        'stack-md': 'space-y-md',
        'stack-lg': 'space-y-lg',
        'inline-stack-sm': 'space-x-sm',
        'inline-stack-md': 'space-x-md',
        'inline-stack-lg': 'space-x-lg',

        'w-sidebar': 'w-64 min-w-[256px]',
        'w-content': 'flex-1 min-w-0',
        'h-screen-minus-header': 'h-[calc(100vh-64px)]',
        'h-full-minus-footer': 'h-[calc(100%-80px)]',
      },

      showPurgeReport: true,
    }),
  ],

  server: {
    port: 3000,
    open: true,
  },
});
