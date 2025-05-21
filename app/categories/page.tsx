"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import PropertyCard from "@/components/properties/property-card"
import CategoryFilter from "@/components/categories/category-filter"
import type { Property } from "@/types"

export default function CategoriesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    location: "",
  })

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const propertiesCollection = collection(db, "properties")
        const propertiesSnapshot = await getDocs(propertiesCollection)
        const propertiesList = propertiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Property[]

        setProperties(propertiesList)
        setFilteredProperties(propertiesList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching properties:", error)
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  useEffect(() => {
    let filtered = [...properties]

    if (filters.category) {
      filtered = filtered.filter((property) => property.category === filters.category)
    }

    if (filters.location) {
      filtered = filtered.filter((property) => property.location.includes(filters.location))
    }

    setFilteredProperties(filtered)
  }, [filters, properties])

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <h1 className="text-4xl font-bold mb-8">Property Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CategoryFilter filters={filters} onFilterChange={handleFilterChange} />
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium">No properties found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
