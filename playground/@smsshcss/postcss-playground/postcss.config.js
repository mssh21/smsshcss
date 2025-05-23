module.exports = {
  plugins: [
    // @smsshcss/postcssプラグインを使用
    require('@smsshcss/postcss')({
      debug: true, // デバッグモードを有効化
      content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // コンテンツファイルのパターン
    }),
  ],
};
