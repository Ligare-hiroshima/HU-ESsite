# フロントエンドプロトタイプ — 実装メモ

## 今回未実装のもの

- 本物の認証（JWT / セッション）
- 本物のDB（PostgreSQL等）
- 本物のAPI（REST / GraphQL）
- 本物のファイルアップロード（S3等）
- 本物のメール送信（差し戻し通知等）
- 本物の権限制御（RBACなど）
- 全文検索インデックス（Elasticsearch等）
- ページネーション（モックデータ件数が少ないため省略）
- 画像のサムネイル生成

## 将来バックエンド接続するときの差し替えポイント

### 1. 状態管理ストア

**`src/stores/postStore.ts`**
- 現在: 初期値をモックデータから読み込み、変更をlocalStorageに保存
- 将来: `initialize()` → `GET /api/posts` 等のAPI呼び出しに置き換え
- `updatePost()` → `PATCH /api/posts/:id`
- `addPost()` → `POST /api/posts`
- `addReport()` → `POST /api/reports`
- etc.

**`src/stores/submitStore.ts`**
- 現在: Zustand persist でlocalStorageに下書き保存
- 将来: `POST /api/posts/draft` でサーバー側に保存

**`src/stores/viewerModeStore.ts`**
- 現在: localStorageに保存したモード文字列で切り替え
- 将来: JWTのclaimsからロール（student / admin）を読み取り

### 2. マスキングロジック

**`src/lib/masking/index.ts`**
- 現在: クライアントサイドの正規表現ベース
- 将来: サーバーサイドのNLP/正規表現ベースの検出APIと併用
- フロント検出はあくまでUIアシスト。最終チェックはサーバーで行う

### 3. ファイルアップロード

**`src/app/submit/evidence/page.tsx`**
- 現在: ブラウザのFileオブジェクトをstate保持するだけ
- 将来: `PUT /api/upload/presigned-url` → S3 presigned URL にPUT

### 4. 認証フロー

- 現在: モード切替ボタンで擬似的に切り替え
- 将来: 広島大学のSSOまたはGoogleアカウント（@hiroshima-u.ac.jp）で認証

### 5. 審査通知

- 現在: マイ投稿画面で状態変更が反映される（localStorage経由）
- 将来: メール通知（差し戻し・承認・却下時に投稿者へ自動送信）

## モックデータ構造の説明

### Post
```
status: 'draft' | 'pending' | 'approved' | 'rejected' | 'revise' | 'unpublished'
verificationStatus: 'unverified' | 'verified' | 'flagged'
```
- `approved` かつ `verified` のみ一般公開ページに表示される
- `dangerFlagCount` は投稿者がマスキングしなかった検出件数
- `posterUserId: 'user1'` がマイ投稿で表示される投稿者ID

### 権限分離の設計意図

画面がデータを直接触らず、必ず `usePostStore` を経由する構造にしています。
将来APIに差し替える際は、ストアの実装を変えるだけで画面側の変更は最小限になります。

```
画面コンポーネント
  ↓ usePostStore() のアクションを呼ぶ
Zustand Store (postStore.ts)
  ↓ 現在はlocalStorage / 将来はAPI呼び出し
モックデータ or 本番API
```

## 開発上の注意

- `src/components/ui/button.tsx` は `@base-ui/react/button` ベースのため `asChild` prop は使えない
- リンクボタンは `<Link className={buttonVariants(...)}>` パターンを使うこと
- 管理者画面は `useViewerModeStore().mode === 'admin'` のガードで保護されている（本番では JWT認証に置き換え）
