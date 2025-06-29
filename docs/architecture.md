# SmsshCSS アーキテクチャ概要

## Single Source of Truth 設計

SmsshCSSは、設定の重複を防ぎ、一貫性を保つために **Single Source of Truth (SSOT)** アーキテクチャを採用しています。

### アーキテクチャ図

```
┌─────────────────────────────────────────────────────────────┐
│                    SmsshCSS Core Package                    │
│                 (packages/smsshcss)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │           統合設定インデックス                          │    │
│  │        (src/config/index.ts)                        │    │
│  │                                                     │    │
│  │  • defaultConfig (統合設定オブジェクト)                │    │
│  │  • 個別設定エクスポート                                │    │
│  │  • ユーティリティ関数                                  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  個別設定ファイル:                                            │
│  • colorConfig.ts     • fontSizeConfig.ts                   │
│  • spacingConfig.ts   • sizeConfig.ts                       │
│  • gridConfig.ts                                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ import & 動的取得
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Vite Plugin Package                       │
│              (packages/@smsshcss/vite)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │           動的設定取得システム                          │    │
│  │        (src/__tests__/setup.ts)                     │    │
│  │                                                     │    │
│  │  • getCoreConfig() - 遅延ロード                      │    │
│  │  • 動的CSS生成関数群                                  │    │
│  │  • リアルタイム設定同期                                │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### 核心となる設計原則

#### 1. 単一の情報源 (Single Source of Truth)

すべての設定値は **コアパッケージの統合設定** から取得されます：

```typescript
// ❌ 従来の方法（重複・不整合の原因）
const colorMap = {
  'red-500': 'hsl(358 85% 55% / 1)', // ハードコード
};

// ✅ SSoTアーキテクチャ（推奨）
const coreConfig = getCoreConfig();
const colorValue = coreConfig.getColorValue('red-500'); // 動的取得
```

#### 2. 遅延ロード設計

vi.mockの制約を回避するため、設定は遅延ロードで取得されます：

```typescript
let coreConfigCache: any = null;

const getCoreConfig = () => {
  if (!coreConfigCache) {
    const smsshcss = require('smsshcss');
    coreConfigCache = {
      defaultConfig: smsshcss.defaultConfig,
      getColorValue: smsshcss.getColorValue,
      // ...
    };
  }
  return coreConfigCache;
};
```

#### 3. 動的CSS生成

設定値に基づいてCSSクラスを動的生成：

```typescript
const generateSpacingCSS = (): string => {
  const coreConfig = getCoreConfig();
  const spacingConfig = coreConfig.defaultConfig.spacing;

  let css = '';
  Object.entries(spacingConfig).forEach(([key, value]) => {
    css += `\n.m-${key} { margin: ${value}; }`;
    css += `\n.p-${key} { padding: ${value}; }`;
    // ...
  });

  return css;
};
```

## パッケージ間の連携

### コアパッケージ (smsshcss)

**責務**: 設定の定義・提供

- 各種設定ファイルの管理
- 統合設定オブジェクトの提供
- ユーティリティ関数の提供

**主要エクスポート**:

```typescript
export {
  defaultConfig, // 統合設定
  defaultColorConfig, // 個別設定
  defaultSpacingConfig, // 個別設定
  getColorValue, // ユーティリティ関数
  getSpacingValue, // ユーティリティ関数
  // ...
} from './config';
```

### Viteプラグイン (@smsshcss/vite)

**責務**: 設定の消費・CSS生成

- コア設定の動的取得
- CSS生成ロジックの実行
- テスト環境での設定適用

**設定取得パターン**:

```typescript
// 1. 遅延ロードによる設定取得
const coreConfig = getCoreConfig();

// 2. 特定値の動的取得
const colorValue = coreConfig.getColorValue(suffix);

// 3. 設定オブジェクトの利用
const spacingConfig = coreConfig.defaultConfig.spacing;
```

## 利点と効果

### 🎯 管理性の向上

- **一元管理**: すべての設定がコアパッケージに集約
- **重複排除**: ハードコードされた設定値を完全削除
- **自動同期**: コア設定の変更が全パッケージに自動反映

### 🚀 開発効率の向上

- **設定変更時**: 1箇所の変更で全体に反映
- **新機能追加**: コアパッケージの設定追加のみで完結
- **デバッグ**: 設定関連の問題の原因を特定しやすい

### 🔧 保守性の向上

- **一貫性保証**: 設定値の差異が構造的に発生しない
- **テスト信頼性**: 実際の設定値でテストが実行される
- **スケーラビリティ**: 新しいプラグインや機能も同様のパターンで実装可能

## 実装ベストプラクティス

### 設定追加時の手順

1. **コアパッケージで設定定義**

   ```typescript
   // packages/smsshcss/src/config/newConfig.ts
   export const defaultNewConfig = {
     // 設定値
   };
   ```

2. **統合インデックスに追加**

   ```typescript
   // packages/smsshcss/src/config/index.ts
   export { defaultNewConfig } from './newConfig';
   export const defaultConfig = {
     // ...
     new: defaultNewConfig,
   };
   ```

3. **プラグインで動的取得**
   ```typescript
   // プラグイン側
   const newValue = coreConfig.defaultConfig.new[key];
   ```

### テスト実装パターン

```typescript
// テスト用設定取得
const coreConfig = getCoreConfig();

// 実際の設定値でテスト
expect(result?.code).toContain(`.m-md { margin: ${coreConfig.defaultConfig.spacing.md}; }`);
```

## パフォーマンス考慮事項

- **キャッシュ機能**: 設定は初回ロード時にキャッシュされ、以降は高速アクセス
- **遅延ロード**: 必要な時にのみ設定を読み込み、起動時間を最適化
- **メモリ効率**: 重複する設定オブジェクトを排除し、メモリ使用量を削減

---

このアーキテクチャにより、SmsshCSSは拡張性と保守性を両立した堅牢な設計を実現しています。
