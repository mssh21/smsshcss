import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import { smsshcssTheme } from './smsshcss.config.js';

export default defineConfig({
  plugins: [smsshcss(smsshcssTheme)],
});
