import { Hero } from '@/components/Hero'
import { ToolCategories } from '@/components/ToolCategories'
import { FeaturedTools } from '@/components/FeaturedTools'
import { SEOContent } from '@/components/SEOContent'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <ToolCategories />
      <FeaturedTools />
      <SEOContent />
    </div>
  )
} 