import { Base64Converter } from '@/components/tools/Base64Converter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base64 Encoder/Decoder - Encode & Decode Base64 Online | DevToolkit',
  description: 'Free online Base64 encoder and decoder. Encode text to Base64 or decode Base64 to text with URL-safe options and file support. Works offline in your browser.',
  keywords: 'base64 encoder, base64 decoder, base64 converter, encode base64, decode base64, url safe base64',
}

export default function Base64ConverterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Base64 Encoder/Decoder
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Encode text to Base64 or decode Base64 strings with URL-safe options and advanced formatting. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <Base64Converter />
      </div>
    </div>
  )
} 