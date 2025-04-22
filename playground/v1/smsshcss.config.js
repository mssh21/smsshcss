/**
 * smsshcss 設定ファイル
 */

module.exports = {
  // スキャン対象のファイル
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // 常に含めるクラス
  safelist: [
    'flex', 'items-center', 'justify-between', 'grow'
  ],
  // デバッグモード (オプション)
  debug: false
}; 