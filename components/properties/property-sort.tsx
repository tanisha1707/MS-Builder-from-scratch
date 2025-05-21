"use client"

export default function PropertySort({
  onSort,
  currentSort,
}: {
  onSort: (option: string) => void
  currentSort: string
}) {
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="sort" className="text-sm font-medium">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => onSort(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="price-high">Price: High to Low</option>
        <option value="price-low">Price: Low to High</option>
      </select>
    </div>
  )
}
