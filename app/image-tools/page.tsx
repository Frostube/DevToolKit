import { FileImage, Scissors, Archive, RefreshCw, Maximize, Palette } from 'lucide-react'
import Link from 'next/link'

const imageTools = [
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images to reduce file size while maintaining quality',
    icon: Archive,
    href: '/tools/image-compressor',
    status: 'ready',
    features: ['Lossless compression', 'Batch processing', 'Multiple formats'],
    category: 'Optimization'
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images with intelligent scaling and aspect ratio preservation',
    icon: Maximize,
    href: '/tools/image-resizer',
    status: 'ready',
    features: ['Smart scaling', 'Aspect ratio lock', 'Custom dimensions'],
    category: 'Transformation'
  },
  {
    id: 'image-converter',
    name: 'Image Format Converter',
    description: 'Convert between different image formats (JPG, PNG, WebP, AVIF)',
    icon: RefreshCw,
    href: '/tools/image-converter',
    status: 'ready',
    features: ['Format conversion', 'Quality control', 'Modern formats'],
    category: 'Conversion'
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    description: 'Crop images with precision using our intuitive cropping tool',
    icon: Scissors,
    href: '/tools/image-cropper',
    status: 'ready',
    features: ['Precision cropping', 'Preset ratios', 'Custom selection'],
    category: 'Editing'
  },
  {
    id: 'webp-converter',
    name: 'WebP Converter',
    description: 'Convert images to WebP format for better web performance',
    icon: FileImage,
    href: '/tools/webp-converter',
    status: 'ready',
    features: ['WebP optimization', 'Quality settings', 'Bulk conversion'],
    category: 'Web Optimization'
  },
  {
    id: 'image-optimizer',
    name: 'Web Image Optimizer',
    description: 'Optimize images for web with automatic format selection',
    icon: Palette,
    href: '/tools/image-optimizer',
    status: 'ready',
    features: ['Auto-optimization', 'Format selection', 'Size reduction'],
    category: 'Web Optimization'
  },
  {
    id: 'image-watermark',
    name: 'Image Watermark',
    description: 'Add text or logo watermarks to your images in batch',
    icon: FileImage,
    href: '/tools/image-watermark',
    status: 'ready',
    features: ['Text/logo watermark', 'Position control', 'Batch processing', 'Opacity/size control'],
    category: 'Editing'
  }
]

export default function ImageToolsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-xl">
              <FileImage className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Image Tools
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Resize, compress, and convert images with ease. 
            Professional-grade image processing tools that work entirely in your browser.
          </p>
        </div>


        {/* Breadcrumb */}
        <nav className="flex items-center justify-left space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/#tool-categories" className="hover:text-white transition-colors">
            Tools
          </Link>
          <span>/</span>
          <span className="text-white">Image Tools</span>
        </nav>
        

        

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {imageTools.map((tool) => {
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
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30 mb-3 inline-block">
                    {tool.category}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-green-400 transition-colors">
                    {tool.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-4">
                    {tool.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
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
                      className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
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
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Image Processing Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Archive className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Advanced Compression</h3>
              <p className="text-slate-400 text-sm">Reduce file sizes by up to 90% while maintaining visual quality</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <FileImage className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Format Support</h3>
              <p className="text-slate-400 text-sm">Support for JPG, PNG, WebP, AVIF, and other modern formats</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mx-auto mb-4">
                <Scissors className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Browser Processing</h3>
              <p className="text-slate-400 text-sm">All processing happens locally - your images never leave your device</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 