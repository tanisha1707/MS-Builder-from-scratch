"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import AdminBlogList from "@/components/admin/admin-blog-list"
import type { Blog } from "@/types"

export default function AdminBlogsPage() {
  const [user, setUser] = useState<any>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (!currentUser) {
        router.push("/admin")
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!user) return

      try {
        const blogsCollection = collection(db, "blogs")
        const blogsSnapshot = await getDocs(blogsCollection)
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

    if (user) {
      fetchBlogs()
    }
  }, [user])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-8">Manage Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <AdminBlogList blogs={blogs} />
      )}
    </div>
  )
}
