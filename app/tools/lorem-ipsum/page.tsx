import { Metadata } from 'next'
import { LoremIpsumGenerator } from '@/components/tools/LoremIpsumGenerator'

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator - Seva Tools',
  description: 'Generate Lorem Ipsum placeholder text for design and development. Customize paragraphs, sentences, words, and output formats.',
  keywords: 'lorem ipsum generator, placeholder text, dummy text, design mockups, typography testing, content placeholder',
  openGraph: {
    title: 'Lorem Ipsum Generator - Seva Tools',
    description: 'Generate Lorem Ipsum placeholder text for design and development.',
    type: 'website',
  },
}

export default function LoremIpsumPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Lorem Ipsum Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate Lorem Ipsum placeholder text for design and development. 
            Customize the output with paragraphs, sentences, or words in various formats.
          </p>
        </div>
        
        <LoremIpsumGenerator />
      </div>
    </div>
  )
} 