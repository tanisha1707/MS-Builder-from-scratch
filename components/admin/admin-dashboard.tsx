"use client"

import Link from "next/link"
import { Building, FileText, Home, LogOut, Plus } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function AdminDashboard({ user }: { user: any }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-4 md:mt-0 flex items-center text-red-600 hover:text-red-800 transition-colors"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Properties</h2>
            <Home className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">Manage your property listings</p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/admin/properties"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 transition-colors text-center"
            >
              View All Properties
            </Link>
            <Link
              href="/admin/properties/add"
              className="flex items-center justify-center bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Property
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Blogs</h2>
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">Manage your blog articles</p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/admin/blogs"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 transition-colors text-center"
            >
              View All Blogs
            </Link>
            <Link
              href="/admin/blogs/add"
              className="flex items-center justify-center bg-primary text-black px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Blog
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Website</h2>
            <Building className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">View your public website</p>
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className="bg-black text-white px-4 py-2 rounded-md hover:bg-black/90 transition-colors text-center"
              target="_blank"
            >
              View Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
