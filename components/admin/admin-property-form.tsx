"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { db, storage } from "@/lib/firebase"
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore"
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage"
import type { Property } from "@/types"

const PROPERTY_CATEGORIES = [
  "Residential",
  "Commercial",
  "Apartment",
  "Villa",
  "Office",
]

export default function AdminPropertyForm({ property }: { property?: Property }) {
  const router = useRouter()
  const isEditing = Boolean(property)

  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    price: property?.price || 0,
    location: property?.location || "",
    category: property?.category || "",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    area: property?.area || 0,
    features: property?.features?.length ? property.features : [""],
    video: property?.video || "",
  })

  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "bedrooms", "bathrooms", "area"].includes(name)
        ? Number(value)
        : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
     const filesArray = Array.from(e.target.files as FileList)
     setImages((prev) => [...prev, ...filesArray])
    }

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...formData.features]
    updated[index] = value
    setFormData((prev) => ({ ...prev, features: updated }))
  }

  const uploadImages = async (): Promise<string[]> => {
    try {
      const urls = [...imageUrls]
      for (const image of images) {
        const storageRef = ref(storage, `properties/${Date.now()}_${image.name}`)
        await uploadBytes(storageRef, image)
        const url = await getDownloadURL(storageRef)
        urls.push(url)
      }
      return urls
    } catch (err) {
      console.error("Image upload failed:", err)
      throw new Error("Failed to upload images.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const uploadedUrls = await uploadImages()

      const payload = {
        ...formData,
        images: uploadedUrls,
        features: formData.features.filter((f) => f.trim() !== ""),
        updatedAt: serverTimestamp(),
      }

      if (isEditing && property?.id) {
        await updateDoc(doc(db, "properties", property.id), payload)
      } else {
        await addDoc(collection(db, "properties"), {
          ...payload,
          createdAt: serverTimestamp(),
        })
      }

      router.push("/admin/properties")
    } catch (err) {
      console.error(err)
      setError("Failed to save property. Please try again.")
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 bg-white"
          >
            <option value="">Select category</option>
            {PROPERTY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="md:col-span-2 w-full border rounded p-2 bg-white"
            required
          />
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="bedrooms"
            type="number"
            placeholder="Bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            min={0}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <input
            name="bathrooms"
            type="number"
            placeholder="Bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            min={0}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <input
            name="area"
            type="number"
            placeholder="Area (sq ft)"
            value={formData.area}
            onChange={handleChange}
            min={0}
            required
            className="w-full border rounded p-2 bg-white"
          />
          <input
            name="video"
            placeholder="YouTube Video URL (optional)"
            value={formData.video}
            onChange={handleChange}
            className="md:col-span-3 w-full border rounded p-2 bg-white"
          />
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        {formData.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={feature}
              placeholder="Feature"
              onChange={(e) => handleFeatureChange(idx, e.target.value)}
              className="w-full border rounded p-2 bg-white"
            />
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  features: prev.features.filter((_, i) => i !== idx),
                }))
              }
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              features: [...prev.features, ""],
            }))
          }
          className="mt-2 text-blue-600 underline"
        >
          + Add Feature
        </button>
      </div>

      {/* Images */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Images</h3>
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
        <div className="grid grid-cols-3 gap-4 mt-4">
          {imageUrls.map((url, idx) => (
            <div key={idx} className="relative">
              <img
                src={url}
                className="w-full h-32 object-cover rounded"
                alt="Existing"
              />
              <button
                type="button"
                onClick={() =>
                  setImageUrls((urls) => urls.filter((_, i) => i !== idx))
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded px-2"
              >
                X
              </button>
            </div>
          ))}
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                className="w-full h-32 object-cover rounded"
                alt="Preview"
              />
              <button
                type="button"
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== idx))
                }
                className="absolute top-1 right-1 bg-red-500 text-white rounded px-2"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Property"
            : "Add Property"}
        </button>
      </div>
    </form>
  )
}
  }