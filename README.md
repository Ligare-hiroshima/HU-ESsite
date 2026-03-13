# HU就活ナビ — フロントエンドプロトタイプ

広島大学生専用のESシェアサービスのフロントエンドプロトタイプです。

> ⚠️ **これはフロントエンドプロトタイプです。** 認証・DB・APIは一切実装されていません。

## セットアップ

```bash
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## 画面一覧

### 公開画面
| パス | 説明 |
|------|------|
| `/` | トップページ |
| `/posts` | ES一覧（検索・フィルタ付き） |
| `/posts/[id]` | ES詳細 |
| `/submit/basic` | 投稿Step1: 基本情報 |
| `/submit/questions` | 投稿Step2: 設問・回答 |
| `/submit/evidence` | 投稿Step3: 証跡アップロード |
| `/submit/masking` | 投稿Step4: マスキング確認 |
| `/mypage/posts` | マイ投稿一覧 |
| `/takedown` | 削除依頼フォーム |
| `/terms` | 利用規約 |
| `/guidelines` | 投稿ガイドライン |

### 管理者画面（モード切替で「管理者」を選択）
| パス | 説明 |
|------|------|
| `/admin` | 管理ダッシュボード |
| `/admin/posts` | 投稿審査一覧 |
| `/admin/posts/[id]` | 投稿審査詳細 |
| `/admin/reports` | 通報管理 |
| `/admin/takedowns` | 削除依頼管理 |
| `/admin/logs` | 監査ログ |
| `/admin/companies` | 企業名正規化 |

## モード切替

画面右上の「閲覧 / 投稿者 / 管理者」トグルでUIモードを切り替えられます。

- **閲覧**: ES一覧・詳細の閲覧のみ
- **投稿者**: ES投稿フロー、マイ投稿管理が使える
- **管理者**: 管理者画面全体にアクセスできる

モードはlocalStorageで保持されます。

## 技術スタック

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand（状態管理）
- React Hook Form + Zod（フォームバリデーション）
- date-fns（日付フォーマット）
- Lucide Icons

## データ構造

### モックデータ (`src/mocks/data/`)
- `posts.ts` — 28件の投稿（公開12件、審査待ち6件、差し戻し4件、却下3件、下書き3件）
- `companies.ts` — 14社（NTTデータ、リクルート、マツダなど、地場企業含む）
- `reports.ts` — 6件の通報
- `takedowns.ts` — 5件の削除依頼
- `logs.ts` — 18件の監査ログ

### localStorage で保持するもの
| キー | 内容 |
|------|------|
| `viewer-mode` | 現在の表示モード |
| `hu-es-store` | 投稿・通報・削除依頼・ログの状態変更 |
| `hu-es-draft` | 投稿フローの下書きデータ |

## バックエンド接続時の差し替えポイント

詳細は `docs/frontend-prototype-notes.md` を参照してください。

主な差し替えポイント：
1. `src/stores/postStore.ts` のlocalStorage読み書き → API呼び出しに置き換え
2. `src/stores/submitStore.ts` のdraft保持 → APIのdraftエンドポイントに置き換え
3. `src/stores/viewerModeStore.ts` のモード切替 → 実際のJWT認証に置き換え
4. `src/lib/masking/index.ts` → サーバーサイドのマスキングロジックと併用
