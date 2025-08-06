import { JavaScriptFormatter } from '@/components/tools/JavaScriptFormatter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JavaScript Formatter - Format & Beautify JS Code Online | DevToolkit',

  description: 'Free online JavaScript formatter and beautifier. Format, minify, and validate JavaScript code instantly. Works offline in your browser.',
  keywords: 'javascript formatter, js beautifier, javascript minifier, code formatter, js formatter online',
}

export default function JavaScriptFormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            JavaScript Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Format, beautify, and validate your JavaScript code instantly. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        
        <JavaScriptFormatter />
      </div>
    </div>
  )
} 