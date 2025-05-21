"use client"

import { useState, useEffect } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import BlogCard from "@/components/blogs/blog-card"
import type { Blog } from "@/types"

export default function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsCollection = collection(db, "blogs")
        const blogsQuery = query(blogsCollection, orderBy("createdAt", "desc"), limit(3))
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">Latest from Our Blog</h2>
          <Link href="/blogs" className="mt-4 md:mt-0 text-black hover:text-primary transition-colors font-medium">
            View All Articles
          </Link>
        </div>

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
    </section>
  )
}
