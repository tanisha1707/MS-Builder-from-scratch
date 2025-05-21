"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import PropertyCard from "@/components/properties/property-card"
import type { Property } from "@/types"

export default function CategoryListings() {
  const [residentialProperties, setResidentialProperties] = useState<Property[]>([])
  const [commercialProperties, setCommercialProperties] = useState<Property[]>([])
  const [apartmentProperties, setApartmentProperties] = useState<Property[]>([])
  const [villaProperties, setVillaProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPropertiesByCategory = async () => {
      try {
        // Fetch Residential Properties
        const residentialQuery = query(
          collection(db, "properties"),
          where("category", "==", "Residential"),
          orderBy("createdAt", "desc"),
          limit(4),
        )
        const residentialSnapshot = await getDocs(residentialQuery)
        const residentialList = residentialSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        // Fetch Commercial Properties
        const commercialQuery = query(
          collection(db, "properties"),
          where("category", "==", "Commercial"),
          orderBy("createdAt", "desc"),
          limit(4),
        )
        const commercialSnapshot = await getDocs(commercialQuery)
        const commercialList = commercialSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        // Fetch Apartment Properties
        const apartmentQuery = query(
          collection(db, "properties"),
          where("category", "==", "Apartment"),
          orderBy("createdAt", "desc"),
          limit(4),
        )
        const apartmentSnapshot = await getDocs(apartmentQuery)
        const apartmentList = apartmentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        // Fetch Villa Properties
        const villaQuery = query(
          collection(db, "properties"),
          where("category", "==", "Villa"),
          orderBy("createdAt", "desc"),
          limit(4),
        )
        const villaSnapshot = await getDocs(villaQuery)
        const villaList = villaSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        setResidentialProperties(residentialList)
        setCommercialProperties(commercialList)
        setApartmentProperties(apartmentList)
        setVillaProperties(villaList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching properties by category:", error)
        setLoading(false)
      }
    }

    fetchPropertiesByCategory()
  }, [])

  const renderCategorySection = (title: string, properties: Property[], category: string) => (
    <div className="mb-16">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h3 className="text-2xl font-bold">{title}</h3>
        <Link
          href={`/categories?category=${category}`}
          className="mt-4 md:mt-0 text-black hover:text-primary transition-colors font-medium"
        >
          View All
        </Link>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-100 rounded-lg">
          <p className="text-muted-foreground">No properties available in this category</p>
        </div>
      )}
    </div>
  )

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {renderCategorySection("Residential Properties", residentialProperties, "Residential")}
            {renderCategorySection("Commercial Properties", commercialProperties, "Commercial")}
            {renderCategorySection("Apartments", apartmentProperties, "Apartment")}
            {renderCategorySection("Luxury Villas", villaProperties, "Villa")}
          </>
        )}
      </div>
    </section>
  )
}
