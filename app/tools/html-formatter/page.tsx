import { HTMLFormatter } from '@/components/tools/HTMLFormatter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HTML Formatter - Format & Beautify HTML Code Online | DevToolkit',
  description: 'Free online HTML formatter and beautifier. Format HTML markup with proper indentation and structure instantly. Works offline in your browser.',
  keywords: 'html formatter, html beautifier, html code formatter, markup formatter, html formatter online',
}

export default function HTMLFormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            HTML Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Beautify and format your HTML markup with proper indentation and structure. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <HTMLFormatter />
      </div>
    </div>
  )
} 