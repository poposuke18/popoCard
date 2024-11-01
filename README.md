# PopoCard

PixelArtスタイルのカードバトルゲーム

## 開発状況

### 実装済み機能
- 基本的なUI構造
- モンスター表示システム
- カードコンポーネント
- デッキ生成システム
- 基本的なゲームフロー

### 使用技術
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

### ディレクトリ構造
```
src/
  ├── app/
  │   ├── globals.css
  │   ├── layout.tsx
  │   └── page.tsx
  ├── components/
  │   ├── game.tsx
  │   ├── game-card.tsx
  │   └── ui/
  └── lib/
      └── utils.ts
public/
  └── images/
      ├── GOBLIN.png
      ├── DEVIL.png
      ├── DARK_KNIGHT.png
      └── DARK_QUEEN.png
```

### 次の実装予定
1. カードの効果処理
2. モンスターとの戦闘システム
3. スコアシステム
4. 勝利/敗北条件

## セットアップ方法
```bash
# インストール
npm install

# 開発サーバー起動
npm run dev
```

## ゲームルール
[ここにゲームのルールや遊び方を記述]