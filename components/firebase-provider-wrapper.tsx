"use client"

import { ReactNode } from "react"
import { FirebaseProvider } from "@/context/firebase-context"

export default function FirebaseProviderWrapper({ children }: { children: ReactNode }) {
  return <FirebaseProvider>{children}</FirebaseProvider>
}

