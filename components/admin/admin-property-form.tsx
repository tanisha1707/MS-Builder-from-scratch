"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import type { Property } from "@/types"

export default function AdminPropertyForm({ property }: { property?: Property }) {
  const router = useRouter()
  const isEditing = !!property
  
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    location: property?.location || "",
    category: property?.category || "",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || 0,
    features: property?.features || [""],
    video: property?.video || "",
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const categories = [
    "Residential",
    "Commercial",
    "Apartment",
    "Villa",
    "Office",
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name === "price" || name === "bedrooms" || name === "bathrooms" || name === "area") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }))
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setImages((prev) => [...prev, ...selectedFiles])
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const removeImageUrl = (index: number) => {
    const updatedImageUrls = [...imageUrls]
    updatedImageUrls.splice(index, 1)
    setImageUrls(updatedImageUrls)
  }

  const uploadImages = async () => {
    const uploadedUrls = [...imageUrls]
    
    for (const image of images) {
      const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
      await uploadBytes(storageRef, image)
      const url = await getDownloadURL(storageRef)
      uploadedUrls.push(url)
    }
    
    return uploadedUrls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    
    try {
      const uploadedImageUrls = await uploadImages()
      
      const propertyData = {
        ...formData,
        images: uploadedImageUrls,
        features: formData.features.filter((feature) => feature.trim() !== ""),
        updatedAt: serverTimestamp(),
      }
      
      if (isEditing && property) {
        // Update existing property
        await updateDoc(doc(db, "properties", property.id), propertyData)
      } else {
        // Add new property
        propertyData.createdAt = serverTimestamp()
        await addDoc(collection(db, "properties"), propertyData)
      }
      
      setSuccess(true)
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/admin/properties")
      }, 2000)
    } catch (error) {
      console.error("Error saving property:", error)
      setError("An error occurred while saving the property. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
          Property {isEditing ? "updated" : "added"} successfully! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium mb-1">
              Bedrooms *
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2\
