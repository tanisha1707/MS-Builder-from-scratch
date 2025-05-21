"use client"

import { useState, useEffect } from "react"
import { collection, query, where, limit, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import BlogCard from "./blog-card"
import type { Blog } from "@/types"

export default function RelatedBlogs({ currentBlog }: { currentBlog: Blog }) {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        // Fetch blogs with similar tags or categories
        const blogsQuery = query(collection(db, "blogs"), where("id", "!=", currentBlog.id), limit(3))

        const blogsSnapshot = await getDocs(blogsQuery)
        const blogsList = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Blog[]

        setBlogs(blogsList)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching related blogs:", error)
        setLoading(false)
      }
    }

    fetchRelatedBlogs()
  }, [currentBlog])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-100 rounded-lg">
        <p className="text-muted-foreground">No related articles found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
