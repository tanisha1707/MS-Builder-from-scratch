"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import AdminPropertyForm from "@/components/admin/admin-property-form"
import type { Property } from "@/types"

export default function EditPropertyPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (!currentUser) {
        router.push("/admin")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchProperty = async () => {
      if (!user) return

      try {
        const propertyDoc = doc(db, "properties", params.id)
        const propertySnapshot = await getDoc(propertyDoc)

        if (propertySnapshot.exists()) {
          setProperty({
            id: propertySnapshot.id,
            ...propertySnapshot.data(),
          } as Property)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching property:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchProperty()
    }
  }, [user, params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !property) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-8">Edit Property</h1>
      <AdminPropertyForm property={property} />
    </div>
  )
}
