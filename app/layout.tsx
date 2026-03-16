import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CasaFolino OS — HACCP Manager',
  description: 'Food Safety Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body>
        {children}
      </body>
    </html>
  )
}