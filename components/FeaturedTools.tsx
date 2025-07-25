import { Star, Zap, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const featuredTools = [
  {
    name: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript code with customizable options',
    usage: '12.5k',
    rating: 4.9,
    href: '/formatters/javascript',
    badge: 'Most Popular',
    badgeColor: 'from-yellow-400 to-orange-500',
    category: 'Code Formatter',
    trend: '+15%'
  },
  {
    name: 'JSON to CSV Converter',
    description: 'Convert JSON data to CSV format with advanced mapping options',
    usage: '8.2k',
    rating: 4.8,
    href: '/converters/json-csv',
    badge: "Editor's Choice",
    badgeColor: 'from-purple-400 to-pink-500',
    category: 'File Converter',
    trend: '+8%'
  },
  {
    name: 'Image Compressor',
    description: 'Compress images while maintaining quality using advanced algorithms',
    usage: '15.1k',
    rating: 4.9,
    href: '/image-tools/compress',
    badge: 'Trending',
    badgeColor: 'from-green-400 to-emerald-500',
    category: 'Image Tool',
    trend: '+32%'
  },
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes with custom colors, logos, and error correction',
    usage: '6.7k',
    rating: 4.7,
    href: '/generators/qr-code',
    badge: 'New',
    badgeColor: 'from-blue-400 to-cyan-500',
    category: 'Generator',
    trend: 'New!'
  }
]

export function FeaturedTools() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Featured Tools
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Our most loved and frequently used tools by the developer community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredTools.map((tool, index) => (
            <Link 
              key={tool.name} 
              href={tool.href}
              className="focus-ring rounded-xl"
              aria-label={`Try ${tool.name} - ${tool.description}`}
            >
              <div className="tool-card-featured group cursor-pointer relative overflow-hidden animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Enhanced Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`bg-gradient-to-r ${tool.badgeColor} text-black text-xs font-medium px-3 py-1.5 rounded-full shadow-lg`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Category tag */}
                <div className="mb-4">
                  <span className="status-indicator status-info text-xs">
                    {tool.category}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Enhanced metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center text-slate-400 mb-1">
                      <Users className="w-4 h-4 mr-1" />
                    </div>
                    <div className="text-lg font-semibold text-white">{tool.usage}</div>
                    <div className="text-xs text-slate-400">users</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-yellow-400 mb-1">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                    </div>
                    <div className="text-lg font-semibold text-white">{tool.rating}</div>
                    <div className="text-xs text-slate-400">rating</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center text-green-400 mb-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                    </div>
                    <div className="text-lg font-semibold text-green-300">{tool.trend}</div>
                    <div className="text-xs text-slate-400">growth</div>
                  </div>
                </div>

                {/* Enhanced CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-blue-300 font-medium group-hover:text-blue-200 transition-colors">
                    <Zap className="w-4 h-4 mr-2" />
                    Try it now
                  </div>
                  
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(tool.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Enhanced hover effect with better gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                
                {/* Progress bar on hover */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl"></div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/tools"
            className="btn-primary group"
          >
            <span>View All Tools</span>
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
} 