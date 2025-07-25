import { PythonFormatter } from '@/components/tools/PythonFormatter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Python Formatter - Format & Beautify Python Code Online | DevToolkit',
  description: 'Free online Python formatter and beautifier. Format Python code following PEP 8 standards instantly. Works offline in your browser.',
  keywords: 'python formatter, python beautifier, pep 8 formatter, python code formatter, python formatter online',
}

export default function PythonFormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Python Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Format and beautify your Python code following PEP 8 standards. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <PythonFormatter />
      </div>
    </div>
  )
} 