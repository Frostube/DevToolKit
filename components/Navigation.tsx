'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Menu, X, Code, Command, Globe, Book, Info } from 'lucide-react'
import { CommandPalette } from './CommandPalette'

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(true)
      }
      // Close mobile menu on escape
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  const navItems = [
    { href: '/tools', label: 'All Tools', icon: Globe },
    { href: '/api-docs', label: 'API', icon: Book },
    { href: '/about', label: 'About', icon: Info }
  ]

  return (
    <>
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'glass-morphism shadow-xl' : 'glass-morphism'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Enhanced Logo */}
            <Link href="/" className="flex items-center space-x-3 group focus-ring rounded-lg p-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">DevToolkit</span>
                <span className="text-xs text-slate-400 hidden sm:block">Swiss Army Knife</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700/30 px-4 py-2 rounded-lg transition-all duration-200 focus-ring"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Command Palette & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Enhanced Command Palette Trigger */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden sm:flex items-center space-x-3 px-4 py-2 bg-slate-800/60 border border-slate-600/50 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 hover:border-slate-500/60 transition-all duration-200 focus-ring group"
                aria-label="Open command palette"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search tools...</span>
                <div className="flex items-center space-x-1 text-xs">
                  <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300 transition-colors">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-300 transition-colors">K</kbd>
                </div>
              </button>

              {/* Mobile search button */}
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="sm:hidden text-slate-300 hover:text-white hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-200 focus-ring"
                aria-label="Search tools"
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white hover:bg-slate-700/30 p-2 rounded-lg transition-all duration-200 focus-ring"
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-slate-700/50 mt-4 pt-4 animate-slide-in-up">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-700/30 px-4 py-3 rounded-lg transition-all duration-200 focus-ring"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
                
                {/* Mobile-specific quick actions */}
                <div className="pt-4 mt-4 border-t border-slate-700/50">
                  <button
                    onClick={() => {
                      setIsCommandPaletteOpen(true)
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 text-slate-300 hover:text-white hover:bg-slate-700/30 px-4 py-3 rounded-lg transition-all duration-200 w-full focus-ring"
                  >
                    <Command className="w-4 h-4" />
                    <span>Search Tools</span>
                    <div className="flex items-center space-x-1 text-xs ml-auto">
                      <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400">⌘</kbd>
                      <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded text-slate-400">K</kbd>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Command Palette */}
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
    </>
  )
} 