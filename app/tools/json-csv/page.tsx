import { JsonCsvConverter } from '@/components/tools/JsonCsvConverter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON ↔ CSV Converter - Convert Between JSON and CSV Online | DevToolkit',
  description: 'Free online JSON to CSV and CSV to JSON converter. Bi-directional conversion with intelligent field mapping, custom delimiters, and nested object support.',
  keywords: 'json csv converter, csv to json, json to csv, file converter, data conversion, json formatter, csv formatter',
}

export default function JsonCsvConverterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            JSON ↔ CSV Converter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Convert between JSON and CSV formats with intelligent field mapping and advanced options. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <JsonCsvConverter />
      </div>
    </div>
  )
} 