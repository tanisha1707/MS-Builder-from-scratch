"use client"

import { useState, useEffect } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import PropertyCard from "@/components/properties/property-card"
import PropertySearch from "@/components/properties/property-search"
import PropertySort from "@/components/properties/property-sort"
import type { Property } from "@/types"

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOption, setSortOption] = useState("newest")

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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      default:
        break
    }

    setFilteredProperties(filtered)
  }, [searchTerm, sortOption, properties])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleSort = (option: string) => {
    setSortOption(option)
  }

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <h1 className="text-4xl font-bold mb-8">All Properties</h1>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PropertySearch onSearch={handleSearch} />
        <PropertySort onSort={handleSort} currentSort={sortOption} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
