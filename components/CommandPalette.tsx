'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Search, ArrowRight, Clock, Star, Zap, X, Command } from 'lucide-react'
import Link from 'next/link'

interface Tool {
  id: string
  name: string
  description: string
  href: string
  category: string
  popular?: boolean
  recent?: boolean
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentTools, setRecentTools] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Mock tools data - in real app, this would come from API/context
  const allTools: Tool[] = [
    { id: 'js-formatter', name: 'JavaScript Formatter', description: 'Format and beautify JavaScript code', href: '/tools/js-formatter', category: 'Formatters', popular: true },
    { id: 'json-formatter', name: 'JSON Formatter', description: 'Format and validate JSON data', href: '/tools/json-formatter', category: 'Formatters', popular: true },
    { id: 'css-formatter', name: 'CSS Formatter', description: 'Format and beautify CSS stylesheets', href: '/tools/css-formatter', category: 'Formatters' },
    { id: 'html-formatter', name: 'HTML Formatter', description: 'Format and beautify HTML markup', href: '/tools/html-formatter', category: 'Formatters' },
    { id: 'json-to-csv', name: 'JSON to CSV Converter', description: 'Convert JSON data to CSV format', href: '/tools/json-to-csv', category: 'Converters', popular: true },
    { id: 'yaml-to-json', name: 'YAML to JSON', description: 'Convert YAML files to JSON format', href: '/tools/yaml-to-json', category: 'Converters' },
    { id: 'base64-encoder', name: 'Base64 Encoder/Decoder', description: 'Encode and decode Base64 strings', href: '/tools/base64', category: 'Utilities' },
    { id: 'uuid-generator', name: 'UUID Generator', description: 'Generate random UUIDs', href: '/tools/uuid-generator', category: 'Generators' },
    { id: 'qr-generator', name: 'QR Code Generator', description: 'Generate QR codes with custom options', href: '/tools/qr-generator', category: 'Generators', popular: true },
    { id: 'color-picker', name: 'Color Picker', description: 'Pick and convert colors between formats', href: '/tools/color-picker', category: 'Color Tools' },
    { id: 'image-compressor', name: 'Image Compressor', description: 'Compress images while maintaining quality', href: '/tools/image-compressor', category: 'Image Tools', popular: true },
  ]

  // Load recent tools from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentTools')
    if (stored) {
      setRecentTools(JSON.parse(stored))
    }
  }, [])

  // Filter tools based on search query
  const filteredTools = query.trim() === '' 
    ? allTools.filter(tool => tool.popular || recentTools.includes(tool.id)).slice(0, 8)
    : allTools.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)

  // Add recent flag to tools
  const toolsWithRecent = filteredTools.map(tool => ({
    ...tool,
    recent: recentTools.includes(tool.id)
  }))

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % toolsWithRecent.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev === 0 ? toolsWithRecent.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (toolsWithRecent[selectedIndex]) {
          handleToolSelect(toolsWithRecent[selectedIndex])
        }
        break
      case 'Escape':
        onClose()
        break
    }
  }

  // Handle tool selection
  const handleToolSelect = (tool: Tool) => {
    // Add to recent tools
    const newRecent = [tool.id, ...recentTools.filter(id => id !== tool.id)].slice(0, 5)
    setRecentTools(newRecent)
    localStorage.setItem('recentTools', JSON.stringify(newRecent))
    
    // Close palette and navigate
    onClose()
    window.location.href = tool.href
  }

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && selectedIndex >= 0) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl glass-morphism rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center px-6 py-4 border-b border-slate-700/50">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools..."
            className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-lg"
          />
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50 transition-colors ml-3"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-96 overflow-y-auto py-2">
          {toolsWithRecent.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">No tools found</p>
              <p className="text-slate-500 text-sm">Try searching for "format", "convert", or "generate"</p>
            </div>
          ) : (
            <>
              {query.trim() === '' && (
                <div className="px-6 py-3 border-b border-slate-700/30">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                    {recentTools.length > 0 ? 'Recent & Popular Tools' : 'Popular Tools'}
                  </h3>
                </div>
              )}
              
              {toolsWithRecent.map((tool, index) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolSelect(tool)}
                  className={`w-full px-6 py-4 text-left transition-colors ${
                    index === selectedIndex 
                      ? 'bg-slate-700/50 border-r-2 border-blue-500' 
                      : 'hover:bg-slate-800/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-1">
                        <span className="text-white font-medium">{tool.name}</span>
                        <div className="flex items-center space-x-2">
                          {tool.recent && (
                            <span className="status-indicator status-info">
                              <Clock className="w-3 h-3 mr-1" />
                              Recent
                            </span>
                          )}
                          {tool.popular && (
                            <span className="status-indicator status-warning">
                              <Star className="w-3 h-3 mr-1" />
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm truncate">{tool.description}</p>
                      <div className="flex items-center mt-2 space-x-3 text-xs">
                        <span className="text-slate-500">{tool.category}</span>
                        {index === selectedIndex && (
                          <div className="flex items-center text-blue-400">
                            <span>Press Enter to open</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index === selectedIndex && (
                      <div className="flex items-center space-x-2 text-blue-400 ml-4">
                        <Zap className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-700/50 bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded">↑↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded">↵</kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-slate-700 border border-slate-600 rounded">esc</kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Command className="w-3 h-3" />
              <span>Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 