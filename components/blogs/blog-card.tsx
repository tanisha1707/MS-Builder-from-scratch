import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User } from "lucide-react"
import type { Blog } from "@/types"

export default function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg property-card">
        <div className="relative h-48 w-full">
          <Image
            src={blog.image || "/placeholder.svg?height=400&width=600"}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{blog.title}</h3>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              <span>{blog.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{blog.readTime} min read</span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{blog.excerpt}</p>

          <div className="text-sm font-medium text-primary hover:underline">Read More</div>
        </div>
      </div>
    </Link>
  )
}
