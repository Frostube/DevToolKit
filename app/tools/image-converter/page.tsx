import { ImageConverter } from '@/components/tools/ImageConverter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Format Converter - Convert JPEG, PNG, WebP Online | DevToolkit',
  description: 'Free online image format converter. Convert between JPEG, PNG, and WebP formats with quality control and transparency options.',
  keywords: 'image converter, format converter, jpeg to png, png to webp, webp converter, image format',
}

export default function ImageConverterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Image Format Converter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Convert between JPEG, PNG, and WebP formats with quality control. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <ImageConverter />
      </div>
    </div>
  )
} 