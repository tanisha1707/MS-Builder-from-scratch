"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import AdminPropertyList from "@/components/admin/admin-property-list"
import type { Property } from "@/types"

export default function AdminPropertiesPage() {
  const [user, setUser] = useState<any>(null)
  const [properties, setProperties] = useState<Property[]>([])
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
    const fetchProperties = async () => {
      if (!user) return

      try {
        const propertiesCollection = collection(db, "properties")
        const propertiesSnapshot = await getDocs(propertiesCollection)
        const propertiesList = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        setProperties(propertiesList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching properties:", error)
        setLoading(false)
      }
    }

    if (user) {
      fetchProperties()
    }
  }, [user])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-8">Manage Properties</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AdminPropertyList properties={properties} />
      )}
    </div>
  )
}
