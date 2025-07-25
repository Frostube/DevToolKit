import { Metadata } from 'next'
import { UUIDGenerator } from '../../../components/tools/UUIDGenerator'

export const metadata: Metadata = {
  title: 'UUID Generator',
  description: 'Generate random UUIDs (v1, v4) for databases and applications. Supports bulk generation and copy to clipboard.'
}

export default function UUIDGeneratorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            UUID Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate RFC 4122 compliant UUIDs (Universally Unique Identifiers) in bulk. 
            All processing happens in your browser - your data never leaves your device.
          </p>
        </div>
        
        <UUIDGenerator />
      </div>
    </div>
  )
} 