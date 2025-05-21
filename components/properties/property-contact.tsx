"use client"

import type React from "react"

import { useState } from "react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { Property } from "@/types"

export default function PropertyContact({ property }: { property: Property }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in this property: ${property.title}`,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await addDoc(collection(db, "inquiries"), {
        ...formData,
        propertyId: property.id,
        propertyTitle: property.title,
        createdAt: serverTimestamp(),
      })

      setSuccess(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: `I'm interested in this property: ${property.title}`,
      })
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      setError("An error occurred while submitting your inquiry. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
      <h3 className="text-xl font-bold mb-2">Interested in this property?</h3>
      <p className="text-muted-foreground mb-6">Fill out the form below and we'll get back to you soon.</p>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
          Thank you for your inquiry! We will contact you shortly.
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-black py-2 rounded-md font-medium hover:bg-primary/90 transition-colors btn-hover-effect disabled:opacity-70"
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="font-bold text-2xl mb-1">${property.price.toLocaleString()}</p>
        <p className="text-muted-foreground">Listed on {new Date(property.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
