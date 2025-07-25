import { ImageWatermark } from '@/components/tools/ImageWatermark'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Watermark Tool - Add Text or Logo Watermarks Online | DevToolkit',
  description: 'Free online image watermark tool. Add text or logo watermarks to your images in batch. Control position, opacity, and style. Protect your images easily.',
  keywords: 'image watermark, add watermark, batch watermark, logo watermark, text watermark, protect images',
}

export default function ImageWatermarkPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Image Watermark
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Add text or logo watermarks to your images in batch. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <ImageWatermark />
      </div>
    </div>
  )
} 