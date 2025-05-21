"use client"

export default function CategoryFilter({
  filters,
  onFilterChange,
}: {
  filters: { category: string; location: string }
  onFilterChange: (name: string, value: string) => void
}) {
  const categories = ["All", "Residential", "Commercial", "Apartment", "Villa", "Office"]

  const locations = ["All", "New York", "Los Angeles", "Chicago", "Miami", "San Francisco"]

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6">Filter Properties</h3>

      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  id={`category-${category}`}
                  name="category"
                  checked={filters.category === (category === "All" ? "" : category)}
                  onChange={() => onFilterChange("category", category === "All" ? "" : category)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor={`category-${category}`} className="ml-2 text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Location</h4>
          <div className="space-y-2">
            {locations.map((location) => (
              <div key={location} className="flex items-center">
                <input
                  type="radio"
                  id={`location-${location}`}
                  name="location"
                  checked={filters.location === (location === "All" ? "" : location)}
                  onChange={() => onFilterChange("location", location === "All" ? "" : location)}
                  className="h-4 w-4 text-primary focus:ring-primary"
                />
                <label htmlFor={`location-${location}`} className="ml-2 text-sm">
                  {location}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
