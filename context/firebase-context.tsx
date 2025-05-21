"use client"

import { createContext, useContext, ReactNode } from "react"
import { db } from "@/lib/firebase"  // Import db ONLY

interface FirebaseContextType {
  db: typeof db
}

const FirebaseContext = createContext<FirebaseContextType>({ db })

// Provider component
export const FirebaseProvider = ({ children }: { children: ReactNode }) => (
  <FirebaseContext.Provider value={{ db }}>
    {children}
  </FirebaseContext.Provider>
)

// Hook to use context
export const useFirebase = () => useContext(FirebaseContext)
