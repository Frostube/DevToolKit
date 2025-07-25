import { ImageResizer } from '@/components/tools/ImageResizer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Resizer - Resize Images with Smart Scaling | DevToolkit',
  description: 'Free online image resizer with intelligent scaling, aspect ratio preservation, and multiple resize modes. Resize images for web, social media, and print.',
  keywords: 'image resizer, resize image, image scaling, aspect ratio, thumbnail generator, image dimensions',
}

export default function ImageResizerPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Image Resizer
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Resize images with intelligent scaling and aspect ratio preservation. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <ImageResizer />
      </div>
    </div>
  )
} 