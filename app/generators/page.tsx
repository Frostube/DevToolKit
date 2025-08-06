import { Hash, QrCode, Key, Dices, Fingerprint, Shield, FileText, Palette } from 'lucide-react'
import Link from 'next/link'

const generators = [
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate RFC 4122 compliant UUIDs (Universally Unique Identifiers)',
    icon: Hash,
    href: '/tools/uuid-generator',
    status: 'ready' as const
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Create QR codes with custom text, colors, and logos',
    icon: QrCode,
    href: '/tools/qr-generator',
    status: 'ready' as const
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate cryptographically secure passwords with customizable options',
    icon: Shield,
    href: '/tools/password-generator',
    status: 'ready' as const
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate cryptographic hashes (MD5, SHA-1, SHA-256, etc.)',
    icon: Hash,
    href: '/tools/hash-generator',
    status: 'ready' as const
  },
  {
    id: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for design and development',
    icon: FileText,
    href: '/tools/lorem-ipsum',
    status: 'ready' as const
  },
  {
    id: 'color-generator',
    name: 'Color Generator',
    description: 'Generate random colors, palettes, and gradients',
    icon: Palette,
    href: '/tools/color-generator',
    status: 'ready' as const
  }
]

export default function GeneratorsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl">
              <Hash className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Generators
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Generate hashes, UUIDs, QR codes, passwords, and more. 
            Cryptographically secure tools for all your generation needs.
          </p>
          
          {/* Breadcrumb */}
          <nav className="flex items-center justify-left space-x-2 text-sm text-gray-400 mb-8">
            <Link href="/#tool-categories" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-white">Generators</span>
          </nav>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {generators.map((tool) => {
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
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-auto">
                  {isReady ? (
                    <Link 
                      href={tool.href}
                      className="block w-full text-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
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
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Generation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-yellow-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Shield className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Cryptographically Secure</h3>
              <p className="text-slate-400 text-sm">Uses secure random number generation for production-ready results</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Dices className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Highly Customizable</h3>
              <p className="text-slate-400 text-sm">Adjust parameters, formats, and options to meet your exact needs</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Key className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Instant Generation</h3>
              <p className="text-slate-400 text-sm">Generate results instantly with one-click copy and bulk operations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 