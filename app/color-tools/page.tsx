import { Palette, Pipette, Contrast, Eye, Sparkles, Paintbrush } from 'lucide-react'
import Link from 'next/link'

const colorTools = [
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick and convert colors between formats (HEX, RGB, HSL, HSV)',
    icon: Pipette,
    href: '/tools/color-picker',
    status: 'ready',
    features: ['Format conversion', 'Color harmony', 'Accessibility check'],
    category: 'Conversion'
  },
  {
    id: 'palette-generator',
    name: 'Palette Generator',
    description: 'Generate beautiful color palettes with AI-powered suggestions',
    icon: Palette,
    href: '/tools/palette-generator',
    status: 'coming-soon',
    features: ['AI suggestions', 'Export formats', 'Color theory'],
    category: 'Generation'
  },
  {
    id: 'gradient-generator',
    name: 'Gradient Generator',
    description: 'Create stunning CSS gradients with visual editor',
    icon: Sparkles,
    href: '/tools/gradient-generator',
    status: 'coming-soon',
    features: ['Visual editor', 'CSS export', 'Multiple types'],
    category: 'Generation'
  },
  {
    id: 'contrast-checker',
    name: 'Contrast Checker',
    description: 'Check color contrast ratios for accessibility compliance',
    icon: Contrast,
    href: '/tools/contrast-checker',
    status: 'coming-soon',
    features: ['WCAG compliance', 'AA/AAA ratings', 'Suggestions'],
    category: 'Accessibility'
  },
  {
    id: 'color-blindness',
    name: 'Color Blindness Simulator',
    description: 'Simulate how colors appear to users with color vision deficiency',
    icon: Eye,
    href: '/tools/color-blindness',
    status: 'coming-soon',
    features: ['Multiple types', 'Real-time preview', 'Accessibility tips'],
    category: 'Accessibility'
  },
  {
    id: 'color-mixer',
    name: 'Color Mixer',
    description: 'Mix colors digitally and explore color relationships',
    icon: Paintbrush,
    href: '/tools/color-mixer',
    status: 'coming-soon',
    features: ['Digital mixing', 'Blend modes', 'Color theory'],
    category: 'Creative'
  }
]

export default function ColorToolsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4 rounded-xl">
              <Palette className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Color Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Work with colors, palettes, and gradients like a pro. 
            From accessibility checking to palette generation, we've got your color needs covered.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {colorTools.map((tool) => {
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
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full border border-indigo-500/30 mb-3 inline-block">
                    {tool.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></div>
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
                      className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
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
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Color Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Palette className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Professional Tools</h3>
              <p className="text-slate-400 text-sm">Designer-grade color tools for professional workflows and projects</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Eye className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Accessibility First</h3>
              <p className="text-slate-400 text-sm">WCAG compliance checking and color blindness simulation built-in</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Export Ready</h3>
              <p className="text-slate-400 text-sm">Export in multiple formats: CSS, Sketch, Adobe, Figma, and more</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 