import { MapPin, Bed, Bath, Square, Calendar, Tag } from "lucide-react"
import type { Property } from "@/types"

export default function PropertyDetails({ property }: { property: Property }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Property Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="flex items-center">
          <Bed className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Bedrooms</p>
            <p className="font-medium">{property.bedrooms}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Bath className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Bathrooms</p>
            <p className="font-medium">{property.bathrooms}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Square className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Area</p>
            <p className="font-medium">{property.area} sqft</p>
          </div>
        </div>

        <div className="flex items-center">
          <Tag className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="font-medium">{property.category}</p>
          </div>
        </div>

        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{property.location}</p>
          </div>
        </div>

        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-3" />
          <div>
            <p className="text-sm text-muted-foreground">Listed On</p>
            <p className="font-medium">{new Date(property.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Description</h3>
      <p className="text-muted-foreground mb-6">{property.description}</p>

      {property.features && property.features.length > 0 && (
        <>
          <h3 className="text-xl font-semibold mb-4">Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {property.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <span className="h-2 w-2 bg-primary rounded-full mr-2"></span>
                {feature}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
