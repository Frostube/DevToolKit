'use client'

import { ArrowRight, Zap, Shield, Command, Terminal } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Badge with improved styling */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4 mr-2" />
            Lightning-fast • Privacy-first • API-enabled
          </div>

          {/* Main Heading with better spacing */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight animate-slide-in-up">
            The Fastest{' '}
            <span className="gradient-text">Developer Toolbox</span>
            <br />
            Built for{' '}
            <span className="gradient-text">Modern Workflows</span>
          </h1>

          {/* Subtitle with improved contrast */}
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            Search any tool in milliseconds. Process files in-browser for privacy. 
            Automate with our REST API. The Swiss Army knife that actually fits your workflow.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/tools" className="btn-primary group flex items-center space-x-2">
              <span>Try Tools</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary flex items-center space-x-2 group">
              <Command className="w-4 h-4" />
              <span>Press ⌘K to search</span>
              <div className="flex items-center space-x-1 text-xs ml-2">
                <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-300 group-hover:bg-slate-600 transition-colors">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-300 group-hover:bg-slate-600 transition-colors">K</kbd>
              </div>
            </button>
          </div>

          {/* Enhanced Key Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-blue-500/15 p-4 rounded-xl mb-4 border border-blue-400/30 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition-all duration-300">
                <Command className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Instant Tool Discovery</h3>
              <p className="text-slate-300 leading-relaxed">Command palette (⌘K) finds any tool in milliseconds. No more hunting through menus.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-green-500/15 p-4 rounded-xl mb-4 border border-green-400/30 group-hover:bg-green-500/20 group-hover:border-green-400/40 transition-all duration-300">
                <Shield className="w-8 h-8 text-green-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Privacy-First Processing</h3>
              <p className="text-slate-300 leading-relaxed">WASM-powered tools run in your browser. Your code never leaves your device.</p>
            </div>
            
            <div className="flex flex-col items-center text-center group animate-slide-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="bg-purple-500/15 p-4 rounded-xl mb-4 border border-purple-400/30 group-hover:bg-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300">
                <Terminal className="w-8 h-8 text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Automation Ready</h3>
              <p className="text-slate-300 leading-relaxed">REST API for CI/CD integration. Script your conversions and automate workflows.</p>
            </div>
          </div>

          {/* Enhanced Demo hint */}
          <div className="mt-12 text-center animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-slate-400 mb-4">Try it now:</p>
            <div className="inline-flex items-center space-x-2 bg-slate-800/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-slate-700/50 hover:bg-slate-800/80 transition-all duration-300">
              <kbd className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm">⌘</kbd>
              <kbd className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-slate-300 text-sm">K</kbd>
              <span className="text-slate-300">→ type "json" → Enter</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-green-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  )
} 