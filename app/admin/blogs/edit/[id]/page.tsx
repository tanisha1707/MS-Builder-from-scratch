"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import AdminBlogForm from "@/components/admin/admin-blog-form"
import type { Blog } from "@/types"

export default function EditBlogPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null)
  const [blog, setBlog] = useState<Blog | null>(null)
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
    const fetchBlog = async () => {
      if (!user) return

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

    if (user) {
      fetchBlog()
    }
  }, [user, params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user || !blog) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 page-transition">
      <h1 className="text-3xl font-bold mb-8">Edit Blog</h1>
      <AdminBlogForm blog={blog} />
    </div>
  )
}
