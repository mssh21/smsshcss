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
    'flex', 'items-center', 'justify-between', 'grow',
    'text-center', 'p-4', 'bg-gray-100' // テスト用に追加
  ],
  // デバッグモード (オプション)
  debug: false
}; 