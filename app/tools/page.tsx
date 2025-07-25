import { Code, RefreshCw, TestTube, Image, Shield, Zap, Lock, Clock } from 'lucide-react'
import Link from 'next/link'

const mvpTools = [
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    description: 'Format, beautify, and minify JavaScript code with customizable options',
    icon: Code,
    href: '/tools/js-formatter',
    status: 'ready',
    features: ['Format & minify', 'File upload', 'Customizable options'],
    usageCount: '12.5k'
  },
  {
    id: 'json-csv',
    name: 'JSON ↔ CSV Converter',
    description: 'Convert between JSON and CSV formats with intelligent field mapping',
    icon: RefreshCw,
    href: '/tools/json-csv',
    status: 'coming-soon',
    features: ['Bi-directional conversion', 'Field mapping', 'Bulk processing'],
    usageCount: 'New'
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test regular expressions with live highlighting and explanation',
    icon: TestTube,
    href: '/tools/regex-tester',
    status: 'coming-soon',
    features: ['Live highlighting', 'Pattern explanation', 'Test cases'],
    usageCount: 'New'
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Compress and optimize images in-browser using WebAssembly',
    icon: Image,
    href: '/tools/image-optimizer',
    status: 'coming-soon',
    features: ['WASM-powered', 'Format conversion', 'Quality control'],
    usageCount: 'New'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode, verify, and debug JSON Web Tokens securely',
    icon: Shield,
    href: '/tools/jwt-decoder',
    status: 'coming-soon',
    features: ['Token verification', 'Payload inspection', 'Security analysis'],
    usageCount: 'New'
  }
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Developer Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Lightning-fast tools that respect your privacy. Process files in-browser, 
            search instantly with ⌘K, and automate with our API.
          </p>
          
          {/* Value Props */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center space-x-2 text-green-400">
              <Zap className="w-4 h-4" />
              <span>Instant processing</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <Lock className="w-4 h-4" />
              <span>Privacy-first</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <Clock className="w-4 h-4" />
              <span>No registration</span>
            </div>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mvpTools.map((tool) => {
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
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage & CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {tool.usageCount === 'New' ? (
                      <span className="text-blue-400 font-medium">New Tool</span>
                    ) : (
                      <span>{tool.usageCount} monthly users</span>
                    )}
                  </div>
                  
                  {isReady ? (
                    <Link 
                      href={tool.href}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Try Now
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed text-sm font-medium"
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* MVP Message */}
        <div className="mt-16 text-center">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">
              More Tools Coming Soon
            </h2>
            <p className="text-gray-300 mb-6">
              We're starting with 5 high-impact tools that solve 80% of daily developer needs. 
              Each tool is built with privacy-first principles and lightning-fast performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Request a Tool
              </button>
              <Link 
                href="/api-docs" 
                className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                View API Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 