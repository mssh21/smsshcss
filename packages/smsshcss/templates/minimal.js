/**
 * SmsshCSS 最小構成設定ファイル
 */

module.exports = {
  // スキャン対象のファイル
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  // 常に含めるクラス
  safelist: [],
  // base.cssを含める
  includeBaseCSS: true,
  // テーマ設定
  theme: {
    colors: {
      primary: '#3366FF',
      textPrimary: '#333333',
      backgroundBase: '#FFFFFF',
    },
  },
};
