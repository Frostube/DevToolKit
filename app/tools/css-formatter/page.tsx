import { CSSFormatter } from '@/components/tools/CSSFormatter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSS Formatter - Format & Beautify CSS Code Online | DevToolkit',
  description: 'Free online CSS formatter and beautifier. Format CSS stylesheets with consistent styling instantly. Works offline in your browser.',
  keywords: 'css formatter, css beautifier, css code formatter, stylesheet formatter, css formatter online',
}

export default function CSSFormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            CSS Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Format and beautify your CSS stylesheets with consistent styling and organization. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <CSSFormatter />
      </div>
    </div>
  )
} 