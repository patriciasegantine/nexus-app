import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import React from "react"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/providers/auth-provider"
import { ThemeProvider } from '@/components/theme/theme-provider'
import { AppProvider } from "@/contexts/app-context"

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: {
    default: 'Nexus',
    template: '%s | Nexus'
  },
  description: 'A focused command center for projects, tasks, and progress.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className} suppressHydrationWarning>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AppProvider>
          {children}
        </AppProvider>
        <Toaster/>
      </AuthProvider>
    </ThemeProvider>
    </body>
    </html>
  )
}
