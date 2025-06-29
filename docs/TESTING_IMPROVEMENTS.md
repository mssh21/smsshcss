# Viteプラグインのテストケース改善提案

## 1. `packages/@smsshcss/vite/src/__tests__/setup.ts` の現状評価

Viteプラグインのテスト環境をセットアップする役割を担う現在の `setup.ts` ファイルには、いくつかの問題があります。

- **コアロジックの重複**: このファイルは、`smsshcss` コアライブラリ本来の機能であるはずのものを広範囲にわたって再実装しています。これには以下が含まれます。

  - `generateMockCSS`: `smsshcss` コアが生成すべきCSSを手動で構築しています。
  - `parseUtilityClasses`、`parseUtilityClass`、`parseUtilityWithValue`、`getThemeValue`、`parseUtilityWithDefaultValue`、`parseSimpleUtilityClass`: `smsshcss` コアのユーティリティクラスのパースとCSS生成ロジックを複製しています。
  - `mockExtractCustom...Classes` および `mockGenerateApplyClasses`: コアライブラリの抽出および生成ロジックを模倣しています。

- **`smsshcss` コアの広範なモック**: `vi.mock('smsshcss', ...)` を使用して `smsshcss` パッケージ全体がモックされており、テスト実行時に実際の `smsshcss` コアコードは使用されていません。同様に、`vi.mock('../../../../smsshcss/src/config', ...)` は、コアの設定値とゲッター関数をハードコードされた値で置き換えています。

**これらの問題の結果:**

- **高いメンテナンスコスト**: `smsshcss` コアライブラリの変更（新しいユーティリティクラス、ロジックの修正、設定の更新など）があるたびに、`setup.ts` 内のモック実装を手動で更新する必要があります。これは時間がかかり、エラーの原因となります。
- **真の統合テストの欠如**: テストは、プラグインと実際の `smsshcss` コアとの統合を検証していません。代わりに、モックされた「偽の」コアとの相互作用を検証しています。これにより、プラグインが実際の環境で正しく機能するという保証が弱まります。
- **コードの複雑性**: `setup.ts` ファイル自体が、重複したロジックのために大きく複雑になり、可読性が低下し、デバッグがより困難になっています。

## 2. 改善提案

現在のテストセットアップの根本的な問題は、Viteプラグインのテストが `smsshcss` コアライブラリの機能を再実装している点にあります。Viteプラグインのテストは、プラグインが `smsshcss` コアと**正しく統合されているか**を検証することに焦点を当てるべきです。

**提案するアプローチ:**

1.  **`smsshcss` コアのモックを最小限にする**: `smsshcss` パッケージ全体をモックするのではなく、テストに本当に必要で、テスト実行速度に大きな影響を与えたり、外部依存性を導入したりする**特定の関数のみ**をモックするようにします。
2.  **Viteプラグインの責務に焦点を当てる**: テストは、Viteプラグインが以下の点を正しく処理していることを主に確認すべきです。
    - 設定（例: `content`、`includeResetCSS`、`apply`）のパース。
    - ソースファイル（HTML、Vue、React、TSXなど）の読み込みとクラス名の抽出。
    - 抽出したクラス名とプラグイン設定を `smsshcss` コアのCSS生成関数に渡すこと。
    - Vite固有のフック（例: `transform`、`configResolved`）の処理。
    - 必要に応じたCSSのミニファイ適用。
    - ファイルシステム操作（例: 一時ディレクトリの作成/削除）。

## 3. 改善のための具体的なステップ

- **`setup.ts` から `generateMockCSS` および関連するパースロジックを削除する**: これらの関数は `smsshcss` コアライブラリの機能を重複しているため、冗長です。
- **`setup.ts` から `mockExtractCustom...Classes` および `mockGenerateApplyClasses` を削除する**: これらもコアロジックの重複です。
- **`vi.mock('smsshcss', ...)` の変更**: `smsshcss` パッケージ全体を完全に置き換えるのではなく、実際のモジュールをインポートし、**本当にモックが必要な関数のみ**を上書きするようにします。例えば、`generatePurgeReport` はテストパフォーマンスに影響を与える可能性があるため、モックされるかもしれません。

  **`vi.mock` 変更例:**

  ```typescript
  import { vi } from 'vitest';

  vi.mock('smsshcss', async (importOriginal) => {
    const actual = await importOriginal<typeof import('smsshcss')>();
    return {
      ...actual, // 実際のsmsshcssの関数を全てインポート
      // 必要に応じて、特定の関数のみをモックする
      generatePurgeReport: vi.fn().mockResolvedValue({
        totalClasses: 100,
        usedClasses: 50,
        purgedClasses: 50,
        buildTime: 100,
      }),
    };
  });
  ```

- **`vi.mock('../../../../smsshcss/src/config', ...)` の削除または簡素化**: このモックは通常、Viteプラグインのテストには不要です。Viteプラグインは `smsshcss` コアと連携すべきであり、コアは自身の設定を管理すべきです。コアの設定読み込みをモックする必要がある場合は、コアライブラリ自身のテストで行うべきです。

## 4. このアプローチの利点

- **信頼性の向上**: テストがプラグインと実際の `smsshcss` コアとの統合を検証するため、実際の環境でのパフォーマンスに対する信頼性が大幅に向上します。
- **メンテナンスコストの削減**: `smsshcss` コアの変更が `setup.ts` の更新を直接引き起こすことが少なくなり、テストコードのメンテナンスが容易になります。
- **テストコードの簡素化**: `setup.ts` が大幅に小さく、理解しやすくなり、コードの可読性とデバッグ効率が向上します。
