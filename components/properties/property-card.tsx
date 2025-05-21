import Link from "next/link"
import Image from "next/image"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import type { Property } from "@/types"

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg property-card">
        <div className="relative h-48 w-full">
          <Image
            src={property.images[0] || "/placeholder.svg?height=400&width=600"}
            alt={property.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-primary text-black px-2 py-1 text-xs font-medium rounded">
            {property.category}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-1 truncate">{property.title}</h3>

          <div className="flex items-center text-muted-foreground text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-sm">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-sm">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-sm">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} sqft</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">${property.price.toLocaleString()}</p>
            <span className="text-xs text-muted-foreground">{new Date(property.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
