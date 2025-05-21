"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import BlogCard from "@/components/blogs/blog-card"
import type { Blog } from "@/types"

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs")
        const blogsQuery = query(blogsCollection, orderBy("createdAt", "desc"))
        const blogsSnapshot = await getDocs(blogsQuery)
        const blogsList = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[]

        setBlogs(blogsList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching blogs:", error)
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium">No blogs found</h3>
          <p className="text-muted-foreground mt-2">Check back later for new content</p>
        </div>
      )}
    </div>
  )
}
