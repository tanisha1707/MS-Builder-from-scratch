"use client"

import { useState, useEffect } from "react"
import { collection, query, where, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import PropertyCard from "./property-card"
import type { Property } from "@/types"

export default function RelatedProperties({ currentProperty }: { currentProperty: Property }) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProperties = async () => {
      try {
        // Fetch properties in the same category
        const propertiesQuery = query(
          collection(db, "properties"),
          where("category", "==", currentProperty.category),
          where("id", "!=", currentProperty.id),
          limit(4),
        )

        const propertiesSnapshot = await getDocs(propertiesQuery)
        const propertiesList = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        setProperties(propertiesList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching related properties:", error)
        setLoading(false)
      }
    }

    fetchRelatedProperties()
  }, [currentProperty])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-100 rounded-lg">
        <p className="text-muted-foreground">No related properties found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
