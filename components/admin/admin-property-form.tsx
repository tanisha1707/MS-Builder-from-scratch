"use client"

import React, { useState } from "react"
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

  const categories = ["Residential", "Commercial", "Apartment", "Villa", "Office"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "bedrooms" || name === "bathrooms" || name === "area" ? Number(value) : value,
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ""] }))
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData((prev) => ({ ...prev, features: updatedFeatures }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files)])
    }
  }

  const removeImage = (index: number) => {
    const updated = [...images]
    updated.splice(index, 1)
    setImages(updated)
  }

  const removeImageUrl = (index: number) => {
    const updated = [...imageUrls]
    updated.splice(index, 1)
    setImageUrls(updated)
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
        features: formData.features.filter((f) => f.trim() !== ""),
        updatedAt: serverTimestamp(),
      }

      if (isEditing && property) {
        await updateDoc(doc(db, "properties", property.id), propertyData)
      } else {
        propertyData.createdAt = serverTimestamp()
        await addDoc(collection(db, "properties"), propertyData)
      }

      setSuccess(true)
      setTimeout(() => router.push("/admin/properties"), 2000)
    } catch (err) {
      console.error("Error saving property:", err)
      setError("An error occurred while saving the property. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && <div className="bg-green-100 text-green-800 p-4 rounded">Property {isEditing ? "updated" : "added"} successfully!</div>}
      {error && <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label>Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="w-full border rounded p-2">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label>Price *</label>
            <input name="price" type="number" min="0" value={formData.price} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label>Location *</label>
            <input name="location" value={formData.location} onChange={handleChange} required className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-2">
            <label>Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full border rounded p-2" required />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label>Bedrooms *</label>
            <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} min={0} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label>Bathrooms *</label>
            <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} min={0} required className="w-full border rounded p-2" />
          </div>
          <div>
            <label>Area (sq ft) *</label>
            <input name="area" type="number" value={formData.area} onChange={handleChange} min={0} required className="w-full border rounded p-2" />
          </div>
          <div className="md:col-span-3">
            <label>Video (YouTube URL)</label>
            <input name="video" value={formData.video} onChange={handleChange} className="w-full border rounded p-2" />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt="Uploaded" className="w-full h-32 object-cover rounded" />
              <button type="button" onClick={() => removeImageUrl(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded px-1">X</button>
            </div>
          ))}
          {images.map((file, index) => (
            <div key={index} className="relative">
              <img src={URL.createObjectURL(file)} alt="New" className="w-full h-32 object-cover rounded" />
              <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded px-1">X</button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
          {loading ? "Saving..." : isEditing ? "Update Property" : "Add Property"}
        </button>
      </div>
    </form>
  )
}
