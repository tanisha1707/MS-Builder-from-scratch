"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import PropertyGallery from "@/components/properties/property-gallery"
import PropertyDetails from "@/components/properties/property-details"
import PropertyContact from "@/components/properties/property-contact"
import RelatedProperties from "@/components/properties/related-properties"
import type { Property } from "@/types"

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
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

    fetchProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The property you are looking for does not exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{property.title}</h1>
      <p className="text-lg text-muted-foreground mb-8">{property.location}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} video={property.video} />
          <PropertyDetails property={property} />
        </div>

        <div className="lg:col-span-1">
          <PropertyContact property={property} />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Similar Properties</h2>
        <RelatedProperties currentProperty={property} />
      </div>
    </div>
  )
}
