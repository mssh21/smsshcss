# GitHub Actions Setup

このプロジェクトでは、GitHub Actionsを使用してmasterブランチへのマージ時に自動的にパッケージをnpmに公開します。

## 必要な設定

### 1. NPM Token の設定

1. [npmjs.com](https://www.npmjs.com/) にログイン
2. アカウント設定 → Access Tokens → Generate New Token
3. Token Type: **Automation** を選択
4. 生成されたトークンをコピー

### 2. GitHub Secrets の設定

1. GitHubリポジトリの Settings → Secrets and variables → Actions
2. 以下のシークレットを追加：

| Name        | Value                 | Description |
| ----------- | --------------------- | ----------- |
| `NPM_TOKEN` | npmで生成したトークン | npm公開用   |

### 3. ワークフローの動作

#### CI ワークフロー (`.github/workflows/ci.yml`)

- **トリガー**: すべてのブランチへのpush、PRの作成
- **実行内容**:
  - Lint チェック
  - 型チェック
  - テスト実行
  - ビルド確認
  - プレイグラウンドのビルドテスト

#### Release ワークフロー (`.github/workflows/release.yml`)

- **トリガー**: masterブランチへのpush
- **実行内容**:
  1. CI チェック（lint, type-check, test, build）
  2. バージョン変更の確認
  3. npm公開（バージョンが変更されている場合のみ）
  4. Gitタグの作成
  5. GitHub Releaseの作成（自動changelog生成）

## リリースプロセス

### 1. 通常のリリース

1. `packages/smsshcss/package.json` のバージョンを更新
2. `packages/@smsshcss/vite/package.json` のバージョンを更新
3. 変更をコミット・プッシュ
4. masterブランチにマージ
5. GitHub Actionsが自動的に：
   - パッケージをnpmに公開
   - Gitタグを作成
   - GitHub Releaseを作成

### 2. バージョン更新の例

```bash
# パッチバージョンアップ (2.0.0 → 2.0.1)
yarn version patch

# マイナーバージョンアップ (2.0.0 → 2.1.0)
yarn version minor

# メジャーバージョンアップ (2.0.0 → 3.0.0)
yarn version major
```

### 3. CI をスキップしたい場合

コミットメッセージに `skip ci` を含めると、リリースワークフローをスキップできます：

```bash
git commit -m "docs: update README [skip ci]"
```

## トラブルシューティング

### NPM公開エラー

- NPM_TOKENが正しく設定されているか確認
- トークンの権限が適切か確認（Automation権限が必要）
- パッケージ名が既存のものと重複していないか確認

### バージョン重複エラー

- 既に同じバージョンが公開されていないか確認
- package.jsonのバージョンを適切に更新

### GitHub Release作成エラー

- GITHUB_TOKENの権限を確認
- リポジトリの設定でActionsの権限を確認
