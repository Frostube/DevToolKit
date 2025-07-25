import { Database, RefreshCw, FileText, Braces, Table, Code } from 'lucide-react'
import Link from 'next/link'

const converters = [
  {
    id: 'json-csv',
    name: 'JSON ↔ CSV Converter',
    description: 'Convert between JSON and CSV formats with intelligent field mapping',
    icon: Table,
    href: '/tools/json-csv',
    status: 'ready',
    features: ['Bi-directional conversion', 'Field mapping', 'Bulk processing'],
    category: 'Data'
  },
  {
    id: 'yaml-json',
    name: 'YAML ↔ JSON',
    description: 'Convert between YAML and JSON formats seamlessly',
    icon: Braces,
    href: '/tools/yaml-json',
    status: 'ready',
    features: ['Two-way conversion', 'Schema validation', 'Syntax highlighting'],
    category: 'Configuration'
  },
  {
    id: 'xml-json',
    name: 'XML ↔ JSON',
    description: 'Convert XML documents to JSON and vice versa',
    icon: Code,
    href: '/tools/xml-json',
    status: 'coming-soon',
    features: ['Attribute handling', 'Namespace support', 'Custom mapping'],
    category: 'Data'
  },
  {
    id: 'base64-converter',
    name: 'Base64 Converter',
    description: 'Encode and decode Base64 strings with file support',
    icon: RefreshCw,
    href: '/tools/base64',
    status: 'ready',
    features: ['Text & file support', 'URL-safe encoding', 'Batch processing'],
    category: 'Encoding'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components',
    icon: RefreshCw,
    href: '/tools/url-encoder',
    status: 'ready',
    features: ['Component encoding', 'Query string parsing', 'Validation'],
    category: 'Web'
  }
]

export default function ConvertersPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl">
              <Database className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            File Converters
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Convert between different file formats instantly. 
            Support for JSON, CSV, XML, YAML, and more with intelligent mapping.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {converters.map((tool) => {
            const IconComponent = tool.icon
            const isReady = tool.status === 'ready'
            
            return (
              <div key={tool.id} className="tool-card group relative">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {isReady ? (
                    <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2 py-1 rounded-full border border-green-500/30">
                      Ready
                    </span>
                  ) : (
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full border border-yellow-500/30">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Tool Content */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full border border-purple-500/30 mb-3 inline-block">
                    {tool.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  {isReady ? (
                    <Link 
                      href={tool.href}
                      className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Try Now
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="block w-full text-center px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Conversion Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <RefreshCw className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Intelligent Mapping</h3>
              <p className="text-slate-400 text-sm">Smart field detection and type inference for accurate conversions</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Database className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Bulk Processing</h3>
              <p className="text-slate-400 text-sm">Convert multiple files at once with batch processing</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Format Validation</h3>
              <p className="text-slate-400 text-sm">Validate input and ensure output format correctness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 