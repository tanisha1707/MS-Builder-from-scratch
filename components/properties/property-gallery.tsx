"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"

export default function PropertyGallery({
  images,
  video,
}: {
  images: string[]
  video?: string
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showVideo, setShowVideo] = useState(false)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setShowVideo(false)
  }

  return (
    <div className="mb-8">
      <div className="relative h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-md">
        {showVideo && video ? (
          <iframe src={video} title="Property Video" className="w-full h-full" allowFullScreen></iframe>
        ) : (
          <Image
            src={images[currentIndex] || "/placeholder.svg?height=500&width=800"}
            alt="Property Image"
            fill
            className="object-cover"
          />
        )}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {video && (
          <button
            onClick={() => setShowVideo(!showVideo)}
            className={`absolute bottom-4 right-4 ${
              showVideo ? "bg-primary" : "bg-white/80 hover:bg-white"
            } text-black p-2 rounded-full shadow-md transition-all z-10`}
            aria-label={showVideo ? "Show images" : "Play video"}
          >
            <Play className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative h-16 w-24 rounded-md overflow-hidden transition-all ${
              currentIndex === index ? "ring-2 ring-primary" : "opacity-70"
            }`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Property Image ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
