# SmsshCSS Debug Guide

SmsshCSSは開発者体験を向上させるための高度なデバッグシステムを提供しています。このガイドでは、新しいデバッグ機能の使用方法を説明します。

## デバッグシステムの概要

新しいデバッグシステムは`debug`ライブラリをベースとした構造化ロギングを提供し、以下の利点があります：

- 環境変数による細かいログレベル制御
- パフォーマンス分析機能
- 構造化されたレポート出力
- 非推奨機能の追跡

## デバッグの有効化

### 基本的な使用方法

```bash
# すべてのSmsshCSSデバッグログを有効化
DEBUG=smsshcss:* npm run build

# 特定のコンポーネントのみ
DEBUG=smsshcss:generator npm run build
DEBUG=smsshcss:purger npm run build
```

### 利用可能なデバッグ名前空間

- `smsshcss:generator` - CSS生成プロセス
- `smsshcss:purger` - CSSパージプロセス
- `smsshcss:validator` - 設定バリデーション
- `smsshcss:cache` - パフォーマンスキャッシュ
- `smsshcss:config` - 設定管理
- `smsshcss:utils` - ユーティリティ関数
- `smsshcss:vite` - Viteプラグイン

## 環境変数による制御

### レポート表示の制御

```bash
# パージレポートを常に表示
SMSSHCSS_SHOW_REPORTS=true npm run build

# キャッシュ統計を表示
SMSSHCSS_SHOW_CACHE_STATS=true npm run build

# 設定バリデーション結果を表示
SMSSHCSS_SHOW_VALIDATION=true npm run build

# すべてのログを無効化
SMSSHCSS_SILENT=true npm run build

# レガシーログの有効化（移行期間用）
SMSSHCSS_LEGACY_LOGS=true npm run build
```

## パフォーマンス分析

### タイミング測定

```javascript
import { performanceTiming } from 'smsshcss/utils';

performanceTiming.start('custom-operation');
// 何らかの処理
performanceTiming.end('custom-operation');
```

### キャッシュ統計の取得

```javascript
import { logCacheStats } from 'smsshcss';

// キャッシュ統計をコンソールに出力
logCacheStats();
```

## 開発者ヘルパー

### クラス抽出のデバッグ

```javascript
import { devHelpers } from 'smsshcss/utils';

const content = 'class="p-4 m-2"';
const classes = ['p-4', 'm-2'];
devHelpers.logClassExtraction('example.html', classes);
```

### CSS生成セクションの分析

```javascript
import { devHelpers } from 'smsshcss/utils';

const sections = ['reset', 'base', 'utilities', 'components'];
devHelpers.logGeneratedSections(sections);
```

## カスタムデバッグ出力

### 構造化ログ

```javascript
import { debugGenerator } from 'smsshcss/utils';

debugGenerator('Custom message', { 
  context: 'additional data',
  count: 42 
});
```

### 警告システム

```javascript
import { logWarning } from 'smsshcss/utils';

// 非推奨化警告
logWarning.deprecation('oldFunction()', 'newFunction()', 'https://docs.example.com');

// パフォーマンス警告
logWarning.performance('Large file detected', { fileSize: 1024 });

// ファイル処理エラー
logWarning.fileProcessing('file.js', new Error('Parse error'));
```

## 非推奨機能の移行

### generateFullCSSSync の代替

```javascript
// ❌ 非推奨（将来削除予定）
const css = generator.generateFullCSSSync();

// ✅ 推奨
const css = await generator.generateFullCSS();

// ✅ 最新のAPIを使用
import { generateCSS } from 'smsshcss';
const css = await generateCSS(config);
```

### 移行検出の無効化

一時的に非推奨警告を無効化する場合：

```javascript
process.env.SMSSHCSS_SILENT = 'true';
```

## トラブルシューティング

### よくある問題

1. **デバッグログが表示されない**
   ```bash
   # DEBUG環境変数を確認
   echo $DEBUG
   
   # 正しく設定
   DEBUG=smsshcss:* npm run build
   ```

2. **パフォーマンスが低下している**
   ```bash
   # キャッシュ統計を確認
   SMSSHCSS_SHOW_CACHE_STATS=true npm run build
   ```

3. **レガシーログとの混在**
   ```bash
   # レガシーログを無効化
   unset SMSSHCSS_LEGACY_LOGS
   ```

### デバッグ設定の例

```bash
# 開発環境での推奨設定
export DEBUG=smsshcss:generator,smsshcss:purger
export SMSSHCSS_SHOW_REPORTS=true

# 本番環境での推奨設定
export SMSSHCSS_SILENT=true
```

## 今後の改善計画

1. **PostCSS統合**: より堅牢なCSS解析
2. **AST操作**: クラス抽出の精度向上
3. **プラグインAPI**: カスタムデバッグ拡張
4. **TypeScript型**: 完全な型安全性

詳細な情報については、[API Reference](./API_REFERENCE.md)および[Migration Guide](./MIGRATION_GUIDE.md)を参照してください。 