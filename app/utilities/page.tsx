import { Settings, Code2, TestTube, FileText, Lock, Shuffle } from 'lucide-react'
import Link from 'next/link'

const utilities = [
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with support for text and files',
    icon: Lock,
    href: '/tools/base64',
    status: 'coming-soon',
    features: ['Text & file support', 'URL-safe encoding', 'Batch processing'],
    category: 'Encoding'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components safely',
    icon: Code2,
    href: '/tools/url-encoder',
    status: 'coming-soon',
    features: ['Component encoding', 'Query string parsing', 'Validation'],
    category: 'Web'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live highlighting and explanations',
    icon: TestTube,
    href: '/tools/regex-tester',
    status: 'coming-soon',
    features: ['Live highlighting', 'Pattern explanation', 'Test cases'],
    category: 'Testing'
  },
  {
    id: 'text-transform',
    name: 'Text Transformer',
    description: 'Transform text case, remove duplicates, sort lines, and more',
    icon: Shuffle,
    href: '/tools/text-transform',
    status: 'coming-soon',
    features: ['Case conversion', 'Line operations', 'Text cleanup'],
    category: 'Text Processing'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode, verify, and debug JSON Web Tokens securely',
    icon: FileText,
    href: '/tools/jwt-decoder',
    status: 'coming-soon',
    features: ['Token verification', 'Payload inspection', 'Security analysis'],
    category: 'Security'
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convert between different timestamp formats and time zones',
    icon: Settings,
    href: '/tools/timestamp-converter',
    status: 'coming-soon',
    features: ['Multiple formats', 'Timezone support', 'Batch conversion'],
    category: 'Time'
  }
]

export default function UtilitiesPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-gray-500 to-slate-500 p-4 rounded-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Utilities
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Encode, decode, and transform text and data with our versatile utility tools. 
            Essential tools for every developer's toolkit.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {utilities.map((tool) => {
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
                  <div className="bg-gradient-to-r from-gray-500 to-slate-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full border border-gray-500/30 mb-3 inline-block">
                    {tool.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
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
                      className="block w-full text-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
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
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Utility Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-gray-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Lock className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Secure Processing</h3>
              <p className="text-slate-400 text-sm">All encoding and decoding happens locally for maximum security</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <TestTube className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Testing & Validation</h3>
              <p className="text-slate-400 text-sm">Test patterns, validate formats, and debug with real-time feedback</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Shuffle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Batch Operations</h3>
              <p className="text-slate-400 text-sm">Process multiple items at once with bulk transformation tools</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 