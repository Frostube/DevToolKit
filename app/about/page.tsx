import { Code, Zap, Shield, Users, Heart, Github, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            About DevToolkit
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            The Swiss Army knife for developers, built with privacy-first principles and lightning-fast performance.
          </p>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <p className="text-lg text-gray-300 leading-relaxed mb-4">
              DevToolkit was born from a simple frustration: developers need reliable, fast, and secure tools, 
              but most online utilities compromise on speed, privacy, or functionality.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              We built DevToolkit to solve this problem. Every tool runs in your browser using WebAssembly for maximum speed, 
              your data never leaves your device, and our API enables seamless automation in your workflows.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">What Makes Us Different</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-500/20 p-4 rounded-xl w-fit mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Privacy First</h3>
              <p className="text-gray-400">
                All processing happens in your browser. Your code, data, and files never leave your device. 
                Zero tracking, zero data collection.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500/20 p-4 rounded-xl w-fit mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">
                WASM-powered tools that run at near-native speed. Command palette (⌘K) finds any tool in milliseconds. 
                No loading, no waiting.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 p-4 rounded-xl w-fit mx-auto mb-4">
                <Code className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Developer Focused</h3>
              <p className="text-gray-400">
                Built by developers, for developers. API-first design enables automation. 
                Tools that actually fit your workflow.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-400">Tools Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">100K+</div>
                <div className="text-sm text-gray-400">Monthly Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">0ms</div>
                <div className="text-sm text-gray-400">Data Transmission</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Availability</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Built with Love</h2>
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart className="w-8 h-8 text-red-400 fill-current" />
            </div>
            <p className="text-lg text-gray-300 mb-6">
              DevToolkit is crafted by a passionate team of developers who understand the daily challenges 
              you face. We use these tools ourselves, every single day.
            </p>
            <div className="flex justify-center space-x-6">
              <Link 
                href="https://github.com/devtoolkit" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </Link>
              <Link 
                href="https://twitter.com/devtoolkit" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </Link>
              <Link 
                href="mailto:hello@devtoolkit.com" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="mb-16">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <Github className="w-6 h-6 text-white mr-3" />
              <h3 className="text-xl font-semibold text-white">Open Source</h3>
            </div>
            <p className="text-gray-300 mb-6">
              DevToolkit is open source and always will be. We believe in transparency, 
              community contributions, and giving back to the developer ecosystem.
            </p>
            <Link 
              href="https://github.com/devtoolkit" 
              className="btn-primary"
            >
              <Github className="w-4 h-4" />
              <span>View on GitHub</span>
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            Have questions, suggestions, or just want to say hi? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="mailto:hello@devtoolkit.com" 
              className="btn-primary"
            >
              <Mail className="w-4 h-4" />
              <span>Send us an Email</span>
            </Link>
            <Link 
              href="/contact" 
              className="btn-secondary"
            >
              <Users className="w-4 h-4" />
              <span>Contact Form</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 