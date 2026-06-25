import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '놀작 원장 글쓰기 지원',
  description: '놀작에듀 원장님을 위한 AI 글쓰기 지원 서비스',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
