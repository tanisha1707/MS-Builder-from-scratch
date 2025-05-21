import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { FirebaseProvider } from "@/context/firebase-context"


const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MSBUILDER's - Premium Real Estate",
  description: "Discover premium properties with MSBUILDER's real estate company"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </FirebaseProvider>
      </body>
    </html>
  )
}
