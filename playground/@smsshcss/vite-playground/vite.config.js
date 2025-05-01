import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { smsshcssTheme } from './smsshcss.config.js';

export default defineConfig({
  plugins: [
    smsshcss({
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      includeResetCSS: true,
      includeBaseCSS: true,
      debug: true,
      theme: smsshcssTheme,
    }),
  ],
});
