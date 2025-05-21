import HeroSection from "@/components/home/hero-section"
import ImageGallery from "@/components/home/image-gallery"
import AboutSection from "@/components/home/about-section"
import BlogSection from "@/components/home/blog-section"
import CategoryListings from "@/components/home/category-listings"

export default function Home() {
  return (
    <div className="page-transition">
      <HeroSection />
      <ImageGallery />
      <AboutSection />
      <CategoryListings />
      <BlogSection />
    </div>
  )
}
