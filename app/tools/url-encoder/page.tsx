import { UrlEncoder } from '@/components/tools/UrlEncoder'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'URL Encoder/Decoder - Encode & Decode URLs Online | DevToolkit',
  description: 'Free online URL encoder and decoder. Encode URLs and URI components or decode URL-encoded strings with validation and multiple encoding types.',
  keywords: 'url encoder, url decoder, uri encoder, percent encoding, url escape, query string encoder',
}

export default function UrlEncoderPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            URL Encoder/Decoder
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Encode and decode URLs and URI components with validation and multiple encoding types. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <UrlEncoder />
      </div>
    </div>
  )
} 