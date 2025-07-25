'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

interface FormatOptions {
  indent_size: number
  wrap_line_length: number
  preserve_newlines: boolean
  minify: boolean
  sort_attributes: boolean
  close_void_elements: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function HTMLFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [options, setOptions] = useState<FormatOptions>({
    indent_size: 2,
    wrap_line_length: 120,
    preserve_newlines: true,
    minify: false,
    sort_attributes: false,
    close_void_elements: true
  })
  const [showSettings, setShowSettings] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasError: false,
    isSuccess: false
  })
  const [copySuccess, setCopySuccess] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) return

    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })
    
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      let formatted = input
      
      if (options.minify) {
        // Minify HTML
        formatted = formatted
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .replace(/\s+>/g, '>')
          .replace(/<!--[\s\S]*?-->/g, '')
          .trim()
      } else {
        // Format HTML
        let indentLevel = 0
        const lines: string[] = []
        const voidElements = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']
        
        // Clean up and normalize
        formatted = formatted
          .replace(/\s+/g, ' ')
          .replace(/>\s+</g, '><')
          .trim()
        
        // Split by tags
        const tokens = formatted.split(/(<[^>]*>)/)
        let currentLine = ''
        
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i].trim()
          if (!token) continue
          
          if (token.startsWith('<')) {
            const isClosingTag = token.startsWith('</')
            const isVoidElement = voidElements.some(el => token.toLowerCase().includes(`<${el}`) || token.toLowerCase().includes(`</${el}`))
            const isSelfClosing = token.endsWith('/>')
            
            if (isClosingTag) {
              indentLevel = Math.max(0, indentLevel - 1)
            }
            
            const indent = ' '.repeat(indentLevel * options.indent_size)
            
            if (currentLine.trim()) {
              lines.push(currentLine.trim())
              currentLine = ''
            }
            
            // Sort attributes if enabled
            let processedToken = token
            if (options.sort_attributes && !isClosingTag && token.includes(' ')) {
              const match = token.match(/^<(\w+)(.*)>$/)
              if (match) {
                const tagName = match[1]
                const attrs = match[2].trim()
                if (attrs) {
                  const attrPairs = attrs.split(/\s+/).filter(Boolean)
                  const sortedAttrs = attrPairs.sort().join(' ')
                  processedToken = `<${tagName} ${sortedAttrs}>`
                }
              }
            }
            
            // Close void elements if enabled
            if (options.close_void_elements && isVoidElement && !isSelfClosing && !isClosingTag) {
              processedToken = processedToken.replace(/>\s*$/, ' />')
            }
            
            lines.push(indent + processedToken)
            
            if (!isClosingTag && !isVoidElement && !isSelfClosing) {
              indentLevel++
            }
          } else {
            // Text content
            if (token.trim()) {
              const indent = ' '.repeat(indentLevel * options.indent_size)
              if (currentLine.trim()) {
                currentLine += ' ' + token
              } else {
                currentLine = indent + token
              }
            }
          }
        }
        
        if (currentLine.trim()) {
          lines.push(currentLine.trim())
        }
        
        formatted = lines.join('\n')
        
        // Line length enforcement
        if (options.wrap_line_length > 0) {
          const resultLines = formatted.split('\n')
          const wrappedLines: string[] = []
          
          resultLines.forEach(line => {
            if (line.length <= options.wrap_line_length) {
              wrappedLines.push(line)
            } else {
              const indent = line.match(/^\s*/)?.[0] || ''
              const content = line.substring(indent.length)
              
              if (content.startsWith('<') && content.includes(' ')) {
                // Wrap attributes
                const tagMatch = content.match(/^(<\w+)(.*)>(.*)$/)
                if (tagMatch) {
                  const [, openTag, attrs, rest] = tagMatch
                  const attrPairs = attrs.trim().split(/\s+/).filter(Boolean)
                  
                  wrappedLines.push(indent + openTag)
                  attrPairs.forEach(attr => {
                    wrappedLines.push(indent + '  ' + attr)
                  })
                  wrappedLines.push(indent + '>' + rest)
                } else {
                  wrappedLines.push(line)
                }
              } else {
                wrappedLines.push(line)
              }
            }
          })
          
          formatted = wrappedLines.join('\n')
        }
      }
      
      setOutput(formatted)
      setProcessingState({ 
        isProcessing: false, 
        hasError: false, 
        isSuccess: true 
      })
      
      setTimeout(() => {
        setProcessingState(prev => ({ ...prev, isSuccess: false }))
      }, 2000)
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to process code'
      })
    }
  }

  const copyToClipboard = async () => {
    if (!output) return
    
    try {
      await navigator.clipboard.writeText(output)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadAsFile = () => {
    if (!output) return
    
    const blob = new Blob([output], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted-code.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleCode = () => {
    const sample = `<!DOCTYPE html><html><head><title>Sample Page</title><meta charset="UTF-8"><link rel="stylesheet" href="styles.css"></head><body><header class="main-header" id="header"><h1>Welcome to My Site</h1><nav><ul><li><a href="#home">Home</a></li><li><a href="#about">About</a></li><li><a href="#contact">Contact</a></li></ul></nav></header><main><section class="content"><h2>About Us</h2><p>This is a sample paragraph with some <strong>bold text</strong> and <em>italic text</em>.</p><img src="image.jpg" alt="Sample image" width="300" height="200"><div class="features"><h3>Features</h3><ul><li>Feature 1</li><li>Feature 2</li><li>Feature 3</li></ul></div></section></main><footer><p>&copy; 2024 My Website. All rights reserved.</p></footer></body></html>`
    setInput(sample)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/formatters" className="breadcrumb-item hover:text-slate-200 transition-colors">Formatters</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">HTML Formatter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">HTML Formatter</h1>
            <p className="text-slate-300">Beautify and format your HTML markup with proper indentation</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={loadSampleCode}
            className="btn-ghost flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>Load Sample</span>
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-ghost flex items-center space-x-2 ${showSettings ? 'bg-slate-700/50' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button 
            onClick={clearAll}
            className="btn-ghost flex items-center space-x-2 text-red-300 hover:text-red-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Formatting Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Indent Size
              </label>
              <select
                value={options.indent_size}
                onChange={(e) => setOptions({ ...options, indent_size: Number(e.target.value) })}
                className="form-input w-full"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Line Wrap Length
              </label>
              <input
                type="number"
                value={options.wrap_line_length}
                onChange={(e) => setOptions({ ...options, wrap_line_length: Number(e.target.value) })}
                className="form-input w-full"
                min="60"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="minify"
                    checked={options.minify}
                    onChange={(e) => setOptions({ ...options, minify: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="minify" className="text-sm text-slate-300">
                    Minify HTML
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sort_attributes"
                    checked={options.sort_attributes}
                    onChange={(e) => setOptions({ ...options, sort_attributes: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sort_attributes" className="text-sm text-slate-300">
                    Sort attributes
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="close_void_elements"
                    checked={options.close_void_elements}
                    onChange={(e) => setOptions({ ...options, close_void_elements: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="close_void_elements" className="text-sm text-slate-300">
                    Close void elements
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {processingState.hasError && (
        <div className="error-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error processing code</p>
            <p className="text-sm opacity-90">{processingState.errorMessage}</p>
          </div>
        </div>
      )}

      {processingState.isSuccess && (
        <div className="success-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Code processed successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Input</h2>
            <div className="flex items-center space-x-2">
              <button className="btn-ghost text-sm" title="Upload file">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="<!-- Paste your HTML code here... -->
<!DOCTYPE html>
<html>
<head>
  <title>Sample Page</title>
</head>
<body>
  <h1>Hello World!</h1>
</body>
</html>"
            className="form-textarea w-full h-96 font-mono text-sm"
            spellCheck={false}
          />

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleProcess}
              disabled={!input.trim() || processingState.isProcessing}
              className="btn-primary group flex items-center space-x-2"
            >
              {processingState.isProcessing ? (
                <>
                  <div className="loading-spinner w-4 h-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Format Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Output</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyToClipboard}
                disabled={!output}
                className="btn-ghost text-sm flex items-center space-x-1"
                title="Copy to clipboard"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={downloadAsFile}
                disabled={!output}
                className="btn-ghost text-sm"
                title="Download as file"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={output}
              readOnly
              className="form-textarea w-full h-96 font-mono text-sm resize-none"
              placeholder="<!-- Formatted HTML code will appear here... -->"
            />
            
            {processingState.isProcessing && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-3 text-white">
                  <div className="loading-spinner w-6 h-6" />
                  <span>Processing your code...</span>
                </div>
              </div>
            )}
          </div>

          {output && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{output.split('\n').length} lines • {output.length} characters</span>
              <span className="status-indicator status-success">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Formatting</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Proper tag indentation and nesting</li>
              <li>• Attribute alignment and sorting</li>
              <li>• Semantic HTML structure preservation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Optimization</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Minification for production builds</li>
              <li>• Void element closing for XHTML compatibility</li>
              <li>• Clean, readable markup output</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 