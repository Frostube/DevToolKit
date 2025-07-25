import { WebPConverter } from '@/components/tools/WebPConverter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WebP Converter - Convert Images to WebP for Better Performance | DevToolkit',
  description: 'Free online WebP converter with batch processing, quality control, and lossless options. Convert JPG, PNG, GIF to WebP format for faster websites.',
  keywords: 'webp converter, convert to webp, image optimization, web performance, batch converter, webp format',
}

export default function WebPConverterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            WebP Converter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Convert images to WebP format for better web performance. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <WebPConverter />
      </div>
    </div>
  )
} 