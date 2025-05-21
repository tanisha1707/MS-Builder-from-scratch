"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className=" bg-black relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Luxury Property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-3xl transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Discover Your Dream Property with MSBUILDER's
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Premium properties tailored to your lifestyle and investment goals
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary text-black px-8 py-3 rounded-md text-lg font-medium hover:bg-primary/90 transition-all transform hover:-translate-y-1 btn-hover-effect"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  )
}
