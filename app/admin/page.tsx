"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import AdminDashboard from "@/components/admin/admin-dashboard"
import AdminLogin from "@/components/admin/admin-login"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
     
      const cameFromLogin = sessionStorage.getItem("adminLoggedIn")
      if (cameFromLogin) {
        setUser(currentUser)
      } else {
       
        auth.signOut()
      }
    }
    setLoading(false)
  })

  return () => unsubscribe()
}, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <div className="page-transition">{user ? <AdminDashboard user={user} /> : <AdminLogin />}</div>
}
