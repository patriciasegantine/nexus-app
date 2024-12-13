import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: {
    default: 'Nexus',
    template: '%s | Nexus'
  },
  description: 'Connect and organize your workflow with Nexus - The central hub for your tasks and projects.',
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
    <html lang="en">
    <body className={inter.className}>
    <QueryProvider>
      <Header/>
      <main className="pt-14">
        {children}
      </main>
      <Toaster/>
    </QueryProvider>
    </body>
    </html>
  )
}
