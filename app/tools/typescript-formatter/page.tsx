import { TypeScriptFormatter } from '@/components/tools/TypeScriptFormatter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TypeScript Formatter - Format & Beautify TypeScript Code Online | DevToolkit',
  description: 'Free online TypeScript formatter and beautifier. Format TypeScript code with type-aware formatting instantly. Works offline in your browser.',
  keywords: 'typescript formatter, ts beautifier, typescript code formatter, type-aware formatting, typescript formatter online',
}

export default function TypeScriptFormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            TypeScript Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Format and beautify your TypeScript code with type-aware formatting. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <TypeScriptFormatter />
      </div>
    </div>
  )
} 