import { ImageCropper } from '@/components/tools/ImageCropper'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Cropper - Crop Images with Precision Online | DevToolkit',
  description: 'Free online image cropper with interactive crop selection, aspect ratio presets, and multiple output formats. Crop images with pixel-perfect precision.',
  keywords: 'image cropper, crop image, image editor, aspect ratio, crop tool, resize image, image editing',
}

export default function ImageCropperPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Image Cropper
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Crop images with precision using our interactive cropping tool. 
            All processing happens in your browser - your images never leave your device.
          </p>
        </div>
        
        <ImageCropper />
      </div>
    </div>
  )
} 