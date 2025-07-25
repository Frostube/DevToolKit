import { WebImageOptimizer } from '@/components/tools/WebImageOptimizer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Web Image Optimizer - Optimize Images for Web Performance | DevToolkit',
  description: 'Free online web image optimizer with auto-format selection, smart compression, and batch processing. Optimize images for faster websites and better SEO.',
  keywords: 'web image optimizer, image optimization, webp, avif, compress image, batch image optimizer, web performance',
}

export default function WebImageOptimizerPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Web Image Optimizer
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Optimize images for web with automatic format selection and smart compression. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <WebImageOptimizer />
      </div>
    </div>
  )
} 