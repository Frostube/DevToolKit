import { YamlJsonConverter } from '@/components/tools/YamlJsonConverter'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YAML ↔ JSON Converter - Convert Between YAML and JSON Online | DevToolkit',
  description: 'Free online YAML to JSON and JSON to YAML converter. Bi-directional conversion with schema validation, syntax highlighting, and custom formatting options.',
  keywords: 'yaml json converter, json to yaml, yaml to json, configuration converter, yaml formatter, json formatter',
}

export default function YamlJsonConverterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            YAML ↔ JSON Converter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Convert between YAML and JSON formats seamlessly with schema validation and custom formatting. 
            All processing happens in your browser - completely secure and private.
          </p>
        </div>
        
        <YamlJsonConverter />
      </div>
    </div>
  )
} 