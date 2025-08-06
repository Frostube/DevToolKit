import { Metadata } from 'next'
import { HashGenerator } from '@/components/tools/HashGenerator'

export const metadata: Metadata = {
  title: 'Hash Generator - Seva Tools',
  description: 'Generate cryptographic hashes using various algorithms like SHA-256, SHA-512, MD5, and more. Secure, client-side hash generation.',
  keywords: 'hash generator, cryptographic hash, SHA-256, SHA-512, MD5, SHA-1, hash function, security',
  openGraph: {
    title: 'Hash Generator - Seva Tools',
    description: 'Generate cryptographic hashes using various algorithms.',
    type: 'website',
  },
}

export default function HashGeneratorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Hash Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate cryptographic hashes using various algorithms like SHA-256, SHA-512, and more. 
            All processing happens in your browser - your data never leaves your device.
          </p>
        </div>
        
        <HashGenerator />
      </div>
    </div>
  )
} 