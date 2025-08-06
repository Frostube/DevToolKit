import { Metadata } from 'next'
import { ColorGenerator } from '@/components/tools/ColorGenerator'

export const metadata: Metadata = {
  title: 'Color Generator - Seva Tools',
  description: 'Generate random colors, palettes, and gradients. Create beautiful color schemes with various color theory principles.',
  keywords: 'color generator, color palette, random colors, color theory, hex colors, rgb colors, hsl colors, design tools',
  openGraph: {
    title: 'Color Generator - Seva Tools',
    description: 'Generate random colors, palettes, and gradients.',
    type: 'website',
  },
}

export default function ColorGeneratorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Color Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate random colors, palettes, and gradients. Create beautiful color schemes 
            using various color theory principles like monochromatic, analogous, and complementary.
          </p>
        </div>
        
        <ColorGenerator />
      </div>
    </div>
  )
} 