import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "@/components/session-provider"
import "./globals.css"
import { DataProvider } from "@/lib/data-context"
import { PageTransition } from "@/components/page-transition"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Loop - Your City Assistant",
  description: "Enhance your urban living with tailored information and community resources",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <DataProvider>
            <PageTransition>{children}</PageTransition>
          </DataProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
