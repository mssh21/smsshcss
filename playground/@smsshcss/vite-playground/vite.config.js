import { defineConfig } from 'vite';
import smsshcss from '@smsshcss/vite';
import smsshConfig from './smsshcss.config.js';

export default defineConfig({
  plugins: [
    smsshcss({
      ...smsshConfig,
    }),
  ],
});
