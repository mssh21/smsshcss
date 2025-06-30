# Apply Plugin System Guide

## 概要

新しいApplyプラグインシステムは、ユーティリティクラスの管理を自動化し、拡張可能な設計を提供します。これまでの手動でのapply.ts管理から、プラグインベースの自動化されたシステムに移行しました。

## 主要な改善点

### 🚀 自動化されたユーティリティ管理

- 新しいユーティリティクラス追加時の手動反映が不要
- 既存のvalue-helpersの再利用
- プラグインの自動登録

### 🔧 高い拡張性

- プラグインアーキテクチャによる柔軟な拡張
- 優先度システムによる処理順序の制御
- パターンベースのマッチング

### 🧹 保守性の向上

- コードの重複排除
- 単一責任の原則に基づく設計
- 包括的なテストカバレッジ

## アーキテクチャ

```
apply-system.ts          # コアシステム
├── ApplyPlugin          # プラグインインターフェース
├── ApplyPluginRegistry  # プラグイン管理
└── generateApplyClasses # メイン生成関数

apply-plugins/           # プラグイン実装
├── spacing-plugin.ts    # スペーシング処理
├── size-plugin.ts       # サイズ処理
├── color-plugin.ts      # カラー処理
├── flexbox-plugin.ts    # Flexbox処理
├── display-plugin.ts    # Display処理
└── index.ts            # 自動登録
```

## 📋 開発手順 - 新しいプラグイン追加

### 1. プラグインファイルの作成

```bash
# 新しいプラグインファイルを作成
touch packages/smsshcss/src/utils/apply-plugins/[plugin-name]-plugin.ts
```

### 2. プラグインの実装

#### 2.1 シンプルなプラグインの場合

```typescript
// font-weight-plugin.ts
import { createApplyPlugin } from '../apply-system';

export const fontWeightPlugin = createApplyPlugin({
  name: 'font-weight',
  patterns: [
    /^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
    /^font-(\d+)$/,
  ],
  extractCSS: (utilityClass, match) => {
    const [, weight] = match;

    // 定義済みの重み
    const weightMap: Record<string, string> = {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    };

    const fontWeight = weightMap[weight] || weight;
    return `font-weight: ${fontWeight};`;
  },
  priority: 8,
});
```

#### 2.2 複雑なプラグインの場合

```typescript
// transform-plugin.ts
import { createMultiPatternPlugin } from '../apply-system';
import { normalizeCustomValue } from '../value-helpers';

export const transformPlugin = createMultiPatternPlugin(
  'transform',
  [
    {
      // rotate-45, rotate-[45deg]
      pattern: /^rotate-(.+)$/,
      handler: (utilityClass, match) => {
        const [, value] = match;
        let rotateValue = value;

        // カスタム値の処理
        if (value.startsWith('[') && value.endsWith(']')) {
          rotateValue = normalizeCustomValue(value.slice(1, -1));
        } else {
          // 数値の場合、deg単位を追加
          rotateValue = isNaN(Number(value)) ? value : `${value}deg`;
        }

        return `transform: rotate(${rotateValue});`;
      },
    },
    {
      // scale-110, scale-[1.5]
      pattern: /^scale-(.+)$/,
      handler: (utilityClass, match) => {
        const [, value] = match;
        let scaleValue = value;

        if (value.startsWith('[') && value.endsWith(']')) {
          scaleValue = normalizeCustomValue(value.slice(1, -1));
        } else {
          // パーセンテージを小数に変換 (110 -> 1.1)
          scaleValue = (parseInt(value) / 100).toString();
        }

        return `transform: scale(${scaleValue});`;
      },
    },
  ],
  7
);
```

### 3. テストファイルの作成

```typescript
// __tests__/transform-plugin.test.ts
import { describe, it, expect } from 'vitest';
import { transformPlugin } from '../apply-plugins/transform-plugin';
import { applyPluginRegistry } from '../apply-system';

describe('Transform Plugin', () => {
  beforeAll(() => {
    applyPluginRegistry.register(transformPlugin);
  });

  it('rotate値を正しく処理する', () => {
    const result = applyPluginRegistry.processUtility('rotate-45');
    expect(result).toBe('transform: rotate(45deg);');
  });

  it('カスタムrotate値を処理する', () => {
    const result = applyPluginRegistry.processUtility('rotate-[30deg]');
    expect(result).toBe('transform: rotate(30deg);');
  });

  it('scale値を正しく処理する', () => {
    const result = applyPluginRegistry.processUtility('scale-110');
    expect(result).toBe('transform: scale(1.1);');
  });

  it('カスタムscale値を処理する', () => {
    const result = applyPluginRegistry.processUtility('scale-[1.5]');
    expect(result).toBe('transform: scale(1.5);');
  });
});
```

### 4. プラグインの登録

```typescript
// apply-plugins/index.ts に追加
import { transformPlugin } from './transform-plugin';

export function registerAllApplyPlugins(): void {
  // ... 既存のプラグイン登録

  // 新しいプラグインを追加
  applyPluginRegistry.register(transformPlugin);
}

// エクスポートも追加
export { transformPlugin } from './transform-plugin';
```

### 5. 型定義の更新（必要に応じて）

```typescript
// もし新しい設定が必要な場合
export interface TransformConfig {
  rotateValues?: Record<string, string>;
  scaleValues?: Record<string, string>;
}
```

### 6. ドキュメント更新

```markdown
### Transform Plugin (優先度: 7)

- `rotate-*`: 回転変換
- `scale-*`: スケール変換
- `translate-*`: 移動変換（今後追加予定）
```

## 🔄 開発ワークフロー

### Phase 1: 設計・検討

1. **要件定義**

   - どのようなユーティリティクラスが必要か
   - 既存のユーティリティとの重複がないか
   - パフォーマンスへの影響は許容範囲か

2. **設計レビュー**
   - パターンマッチングの設計
   - 優先度の決定
   - エラーハンドリングの方針

### Phase 2: 実装

3. **プラグイン実装**

   - パターンの定義
   - CSS生成ロジック
   - value-helpersの活用

4. **テスト実装**
   - 単体テスト
   - 統合テスト
   - エッジケースのテスト

### Phase 3: 統合・検証

5. **統合テスト**

   ```bash
   npm test packages/smsshcss/src/utils/__tests__/apply-system.test.ts
   ```

6. **パフォーマンステスト**

   ```bash
   npm run test:performance
   ```

7. **型チェック**
   ```bash
   npm run type-check
   ```

### Phase 4: デプロイ準備

8. **ドキュメント更新**

   - README.md
   - API_REFERENCE.md
   - APPLY_PLUGIN_GUIDE.md

9. **CHANGELOG更新**

   ```markdown
   ## [2.4.0] - 2024-01-XX

   ### Added

   - Transform plugin for rotation and scaling utilities
   - Support for rotate-_ and scale-_ classes
   ```

## 🛠️ 開発ツールとコマンド

### 開発時のコマンド

```bash
# 開発サーバー起動
npm run dev

# テスト実行（監視モード）
npm run test:watch

# 特定のプラグインテスト
npm test -- apply-plugins

# パフォーマンステスト
npm run test:performance

# 型チェック
npm run type-check

# ビルド
npm run build
```

### デバッグコマンド

```bash
# プラグイン一覧確認
node -e "
const { applyPluginRegistry } = require('./dist');
console.log(applyPluginRegistry.getRegisteredPlugins());
"

# 特定のユーティリティクラステスト
node -e "
const { applyPluginRegistry } = require('./dist');
console.log(applyPluginRegistry.processUtility('rotate-45'));
"
```

## 🔍 品質チェックリスト

### プラグイン実装前

- [ ] 既存のプラグインとの重複確認
- [ ] パフォーマンス影響の評価
- [ ] API設計のレビュー

### プラグイン実装中

- [ ] 既存のvalue-helpersを最大限活用
- [ ] 適切なエラーハンドリング
- [ ] パターンマッチングの最適化
- [ ] TypeScript型定義の追加

### プラグイン実装後

- [ ] 単体テストのカバレッジ100%
- [ ] 統合テストの実行確認
- [ ] パフォーマンステストの実行
- [ ] ドキュメントの更新
- [ ] 既存機能の回帰テスト

## 🚀 チーム開発のベストプラクティス

### 1. ブランチ戦略

```bash
# 新機能ブランチ作成
git checkout -b feature/transform-plugin

# プラグイン実装
# ... 開発作業 ...

# プルリクエスト作成
git push origin feature/transform-plugin
```

### 2. コードレビューポイント

#### 必須チェック項目

- [ ] パターンマッチングが適切
- [ ] エラーハンドリングが実装されている
- [ ] テストカバレッジが十分
- [ ] ドキュメントが更新されている
- [ ] パフォーマンス影響が許容範囲

#### 推奨チェック項目

- [ ] 既存コードとの一貫性
- [ ] 命名規則の遵守
- [ ] コメントの適切さ
- [ ] リファクタリングの機会

### 3. CI/CD統合

```yaml
# .github/workflows/test.yml
name: Test Apply Plugins
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run apply plugin tests
        run: npm test -- apply-plugins

      - name: Performance test
        run: npm run test:performance

      - name: Type check
        run: npm run type-check
```

## 📊 監視・メトリクス

### パフォーマンス監視

```typescript
// 開発時のパフォーマンス測定
const startTime = performance.now();
const result = generateApplyClasses(largeConfig);
const endTime = performance.now();

console.log(`Processing time: ${endTime - startTime}ms`);
console.log(`Generated CSS size: ${result.length} characters`);
```

### プラグイン使用統計

```typescript
// プラグインの使用頻度分析
const stats = applyPluginRegistry.getUsageStats();
console.log('Most used plugins:', stats.mostUsed);
console.log('Unused plugins:', stats.unused);
```

## 🎯 今後の拡張計画

### 短期目標（1-2ヶ月）

- [ ] Grid専用プラグインの実装
- [ ] Font関連プラグインの完全実装
- [ ] Order/Z-indexプラグインの追加

### 中期目標（3-6ヶ月）

- [ ] Transform/Animationプラグインの実装
- [ ] カスタムプロパティ対応の強化
- [ ] プラグインマーケットプレイスの構築

### 長期目標（6ヶ月以上）

- [ ] サードパーティプラグインのエコシステム
- [ ] リアルタイムコード生成の最適化
- [ ] ビジュアルプラグインエディター

このガイドに従うことで、一貫性のある高品質なプラグインを効率的に開発できます。
