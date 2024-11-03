// layout.tsx
import { Inter, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const notoSansJp = Noto_Sans_JP({ subsets: ['latin'] })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJp.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}