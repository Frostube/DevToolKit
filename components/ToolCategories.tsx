import { 
  Code, 
  FileImage, 
  Settings, 
  Hash, 
  Palette, 
  Database,
  ArrowRight,
  Command 
} from 'lucide-react'
import Link from 'next/link'

const categories = [
  {
    name: 'Code Formatters',
    description: 'Format and beautify your code with our advanced formatters',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    tools: ['JavaScript', 'CSS', 'HTML', 'JSON', 'XML'],
    href: '/formatters',
    toolCount: 12
  },
  {
    name: 'File Converters',
    description: 'Convert between different file formats instantly',
    icon: Database,
    color: 'from-purple-500 to-pink-500',
    tools: ['JSON to CSV', 'YAML to JSON', 'XML to JSON', 'CSV to JSON'],
    href: '/converters',
    toolCount: 18
  },
  {
    name: 'Image Tools',
    description: 'Resize, compress, and convert images with ease',
    icon: FileImage,
    color: 'from-green-500 to-emerald-500',
    tools: ['Resize', 'Compress', 'Format Convert', 'WebP Converter'],
    href: '/image-tools',
    toolCount: 8
  },
  {
    name: 'Generators',
    description: 'Generate hashes, UUIDs, QR codes, and more',
    icon: Hash,
    color: 'from-yellow-500 to-orange-500',
    tools: ['UUID', 'Hash Generator', 'QR Code', 'Password'],
    href: '/generators',
    toolCount: 15
  },
  {
    name: 'Color Tools',
    description: 'Work with colors, palettes, and gradients',
    icon: Palette,
    color: 'from-indigo-500 to-purple-500',
    tools: ['Palette Generator', 'Color Picker', 'Gradient', 'Contrast'],
    href: '/color-tools',
    toolCount: 6
  },
  {
    name: 'Utilities',
    description: 'Encode, decode, and transform text and data',
    icon: Settings,
    color: 'from-gray-500 to-slate-500',
    tools: ['Base64', 'URL Encode', 'Text Transform', 'Regex Tester'],
    href: '/utilities',
    toolCount: 22
  }
]

export function ToolCategories() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Browse our comprehensive collection of developer tools, organized by category
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link 
                key={category.name} 
                href={category.href}
                className="focus-ring rounded-xl"
                aria-label={`Explore ${category.name} - ${category.description}`}
              >
                <div className="tool-card group cursor-pointer animate-slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-r ${category.color} p-3 rounded-lg w-fit group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="text-right">
                      <span className="status-indicator status-info text-xs">
                        {category.toolCount} tools
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {category.name}
                  </h3>
                  
                  <p className="text-slate-300 mb-4 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.tools.slice(0, 3).map((tool) => (
                      <span
                        key={tool}
                        className="text-xs bg-slate-700/50 text-slate-300 px-3 py-1.5 rounded-full border border-slate-600/50"
                      >
                        {tool}
                      </span>
                    ))}
                    {category.tools.length > 3 && (
                      <span className="text-xs text-slate-400 px-3 py-1.5">
                        +{category.tools.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-300 text-sm font-medium group-hover:text-blue-200 transition-colors">
                      Explore tools
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                    
                    <div className="w-8 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Add a helpful tip section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg">
            <Command className="w-5 h-5 text-blue-300 mr-3" />
            <span className="text-slate-300">Pro tip: Use </span>
            <kbd className="mx-2 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm">⌘K</kbd>
            <span className="text-slate-300"> to quickly find any tool</span>
          </div>
        </div>
      </div>
    </section>
  )
} 