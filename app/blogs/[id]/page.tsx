"use client"

import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"
import type { Blog } from "@/types"
import RelatedBlogs from "@/components/blogs/related-blogs"

export default function BlogPage({ params }: { params: { id: string } }) {
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const blogDoc = doc(db, "blogs", params.id)
        const blogSnapshot = await getDoc(blogDoc)

        if (blogSnapshot.exists()) {
          setBlog({
            id: blogSnapshot.id,
            ...blogSnapshot.data(),
          } as Blog)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching blog:", error)
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Blog Not Found</h1>
        <p className="text-muted-foreground mb-8">The blog you are looking for does not exist or has been removed.</p>
        <Link
          href="/blogs"
          className="bg-primary text-black px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Back to Blogs
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 page-transition">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">{blog.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{blog.readTime} min read</span>
          </div>
        </div>

        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
          <RelatedBlogs currentBlog={blog} />
        </div>
      </div>
    </div>
  )
}
