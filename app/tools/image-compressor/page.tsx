import { ImageCompressor } from '@/components/tools/ImageCompressor'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Compressor - Compress Images Online | DevToolkit',
  description: 'Free online image compressor. Reduce image file sizes while maintaining quality. Supports JPG, PNG, WebP formats with drag-and-drop upload.',
  keywords: 'image compressor, compress images, reduce image size, image optimization, jpeg compression, png compression, webp',
}

export default function ImageCompressorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Image Compressor
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Compress images to reduce file size while maintaining visual quality. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <ImageCompressor />
      </div>
    </div>
  )
} 