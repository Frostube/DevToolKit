import { Code2, Brackets, FileCode, Terminal, Braces, Hash } from 'lucide-react'
import Link from 'next/link'

const formatters = [
  // Tier 1 - Most Essential
  {
    id: 'js-formatter',
    name: 'JavaScript Formatter',
    description: 'Format and beautify JavaScript/ES6+ code with customizable style options',
    icon: Brackets,
    href: '/tools/js-formatter',
    status: 'ready',
    features: ['ES6+ support', 'Custom indentation', 'JSX formatting'],
    category: 'Web Development',
    popularity: 'high'
  },
  {
    id: 'python-formatter',
    name: 'Python Formatter',
    description: 'Format Python code following PEP 8 standards with Black compatibility',
    icon: Code2,
    href: '/tools/python-formatter',
    status: 'ready',
    features: ['PEP 8 compliance', 'Black formatting', 'Import sorting'],
    category: 'General Purpose',
    popularity: 'high'
  },
  {
    id: 'typescript-formatter',
    name: 'TypeScript Formatter',
    description: 'Format TypeScript code with type-aware beautification',
    icon: FileCode,
    href: '/tools/typescript-formatter',
    status: 'ready',
    features: ['Type preservation', 'Interface formatting', 'Generics support'],
    category: 'Web Development',
    popularity: 'high'
  },
  {
    id: 'java-formatter',
    name: 'Java Formatter',
    description: 'Format Java code with enterprise-standard style guidelines',
    icon: Hash,
    href: '/tools/java-formatter',
    status: 'coming-soon',
    features: ['Google style', 'Oracle conventions', 'Spring formatting'],
    category: 'Enterprise',
    popularity: 'high'
  },
  {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Beautify HTML markup with proper indentation and structure',
    icon: Brackets,
    href: '/tools/html-formatter',
    status: 'ready',
    features: ['Tag formatting', 'Attribute alignment', 'Minification'],
    category: 'Web Development',
    popularity: 'high'
  },
  {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Format CSS/SCSS/Less stylesheets with consistent styling',
    icon: Braces,
    href: '/tools/css-formatter',
    status: 'ready',
    features: ['Property sorting', 'Vendor prefixes', 'Media queries'],
    category: 'Web Development',
    popularity: 'high'
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format SQL queries with proper syntax highlighting and structure',
    icon: Terminal,
    href: '/tools/sql-formatter',
    status: 'coming-soon',
    features: ['Multiple dialects', 'Query optimization', 'Keyword casing'],
    category: 'Database',
    popularity: 'high'
  },

  // Tier 2 - Very Important
  {
    id: 'cpp-formatter',
    name: 'C/C++ Formatter',
    description: 'Format C and C++ code with clang-format compatibility',
    icon: Code2,
    href: '/tools/cpp-formatter',
    status: 'coming-soon',
    features: ['Clang-format styles', 'Custom rules', 'Header formatting'],
    category: 'Systems',
    popularity: 'medium'
  },
  {
    id: 'csharp-formatter',
    name: 'C# Formatter',
    description: 'Format C# code following Microsoft coding conventions',
    icon: Hash,
    href: '/tools/csharp-formatter',
    status: 'coming-soon',
    features: ['.NET standards', 'LINQ formatting', 'Async/await'],
    category: 'Enterprise',
    popularity: 'medium'
  },
  {
    id: 'php-formatter',
    name: 'PHP Formatter',
    description: 'Format PHP code with PSR standards and framework support',
    icon: Code2,
    href: '/tools/php-formatter',
    status: 'coming-soon',
    features: ['PSR-12 standard', 'Laravel support', 'Namespace sorting'],
    category: 'Web Development',
    popularity: 'medium'
  },
  {
    id: 'go-formatter',
    name: 'Go Formatter',
    description: 'Format Go code with gofmt compatibility and best practices',
    icon: Terminal,
    href: '/tools/go-formatter',
    status: 'coming-soon',
    features: ['Gofmt standard', 'Import grouping', 'Error handling'],
    category: 'Systems',
    popularity: 'medium'
  },
  {
    id: 'rust-formatter',
    name: 'Rust Formatter',
    description: 'Format Rust code with rustfmt and cargo integration',
    icon: Code2,
    href: '/tools/rust-formatter',
    status: 'coming-soon',
    features: ['Rustfmt standard', 'Macro formatting', 'Lifetime syntax'],
    category: 'Systems',
    popularity: 'medium'
  },

  // Tier 3 - Specialized
  {
    id: 'swift-formatter',
    name: 'Swift Formatter',
    description: 'Format Swift code for iOS/macOS development',
    icon: Code2,
    href: '/tools/swift-formatter',
    status: 'coming-soon',
    features: ['Apple guidelines', 'SwiftUI support', 'Protocol formatting'],
    category: 'Mobile',
    popularity: 'medium'
  },
  {
    id: 'kotlin-formatter',
    name: 'Kotlin Formatter',
    description: 'Format Kotlin code for Android and JVM development',
    icon: Hash,
    href: '/tools/kotlin-formatter',
    status: 'coming-soon',
    features: ['Android standards', 'Coroutines support', 'DSL formatting'],
    category: 'Mobile',
    popularity: 'medium'
  },
  {
    id: 'ruby-formatter',
    name: 'Ruby Formatter',
    description: 'Format Ruby code with RuboCop standards and Rails support',
    icon: Code2,
    href: '/tools/ruby-formatter',
    status: 'coming-soon',
    features: ['RuboCop rules', 'Rails conventions', 'Gem formatting'],
    category: 'Web Development',
    popularity: 'medium'
  },
  {
    id: 'dart-formatter',
    name: 'Dart Formatter',
    description: 'Format Dart code for Flutter and web development',
    icon: Code2,
    href: '/tools/dart-formatter',
    status: 'coming-soon',
    features: ['Flutter widgets', 'Pub standards', 'Async formatting'],
    category: 'Mobile',
    popularity: 'medium'
  }
]

export default function FormattersPage() {
  const highPriorityTools = formatters.filter(tool => tool.popularity === 'high')
  const mediumPriorityTools = formatters.filter(tool => tool.popularity === 'medium')

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl">
              <Code2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Code Formatters
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Beautify and format your code with professional-grade formatting tools. 
            Support for all major programming languages with customizable styles.
          </p>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center justify-left space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/#tool-categories" className="hover:text-white transition-colors">
            Tools
          </Link>
          <span>/</span>
          <span className="text-white">Formatters</span>
        </nav>
        {/* Priority Section - Most Popular Languages */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-green-500/20 p-2 rounded-lg mr-3">
              <Brackets className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Most Popular Languages</h2>
            <span className="ml-3 text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
              High Demand 2024
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highPriorityTools.map((tool) => {
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
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg w-fit mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-500/30 mb-3 inline-block">
                      {tool.category}
                    </span>
                    
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

                  {/* CTA */}
                  <div className="mt-auto">
                    {isReady ? (
                      <Link 
                        href={tool.href}
                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Format Code
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
        </div>

        {/* Secondary Section - Other Important Languages */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
              <Terminal className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Specialized & Systems Languages</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mediumPriorityTools.map((tool) => {
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
                        Format Code
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
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Code Formatting Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Code2 className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Industry Standards</h3>
              <p className="text-slate-400 text-sm">Follow established coding standards like PEP 8, Google Style Guide, and more</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Brackets className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Customizable Rules</h3>
              <p className="text-slate-400 text-sm">Adjust indentation, spacing, and style rules to match your project needs</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Terminal className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-slate-400 text-sm">Format your code instantly with real-time preview and copy functionality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 