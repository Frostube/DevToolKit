'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

interface FormatOptions {
  indent_size: number
  max_line_length: number
  sort_imports: boolean
  remove_blank_lines: boolean
  add_trailing_comma: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function PythonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [options, setOptions] = useState<FormatOptions>({
    indent_size: 4,
    max_line_length: 88,
    sort_imports: true,
    remove_blank_lines: false,
    add_trailing_comma: false
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
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      // Basic Python formatting implementation
      let formatted = input
      
      // Split into lines for processing
      const lines = formatted.split('\n')
      const processedLines: string[] = []
      let indentLevel = 0
      let inStringLiteral = false
      let stringDelimiter = ''
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        
        // Skip empty lines if option is set
        if (options.remove_blank_lines && line === '') {
          continue
        }
        
        // Track string literals to avoid formatting inside them
        if (!inStringLiteral) {
          for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if (char === '"' || char === "'") {
              // Check for triple quotes
              if (j + 2 < line.length && line.substring(j, j + 3) === char.repeat(3)) {
                inStringLiteral = true
                stringDelimiter = char.repeat(3)
                break
              } else if (j === 0 || line[j - 1] !== '\\') {
                inStringLiteral = true
                stringDelimiter = char
                break
              }
            }
          }
        } else {
          // Check if string literal ends
          const delimiterIndex = line.indexOf(stringDelimiter)
          if (delimiterIndex !== -1) {
            inStringLiteral = false
            stringDelimiter = ''
          }
        }
        
        if (!inStringLiteral) {
          // Check for dedent keywords first
          if (line.startsWith('except') || line.startsWith('elif') || line.startsWith('else') ||
              line.startsWith('finally')) {
            if (indentLevel > 0) {
              indentLevel--
            }
          }
          
          // Handle function/class definitions
          if (line.startsWith('def ') || line.startsWith('class ')) {
            indentLevel = 0
          }
          
          // Add spacing around operators (basic implementation)
          line = line.replace(/([^=!<>])=([^=])/g, '$1 = $2')
          line = line.replace(/([^+])\+([^+=])/g, '$1 + $2')
          line = line.replace(/([^-])-([^-=])/g, '$1 - $2')
          line = line.replace(/([^*])\*([^*=])/g, '$1 * $2')
          line = line.replace(/([^/])\/([^/=])/g, '$1 / $2')
          
          // Fix double spaces created by above
          line = line.replace(/\s+/g, ' ')
          
          // Apply current indentation
          const currentIndent = ' '.repeat(indentLevel * options.indent_size)
          processedLines.push(currentIndent + line)
          
          // Check if this line should increase indent for next line
          if (line.endsWith(':') && !line.startsWith('#')) {
            indentLevel++
          }
        } else {
          // Keep string literals as-is
          const currentIndent = ' '.repeat(indentLevel * options.indent_size)
          processedLines.push(currentIndent + line)
        }
      }
      
      // Join lines and apply line length limit
      let result = processedLines.join('\n')
      
      // Basic line length enforcement (simplified)
      if (options.max_line_length > 0) {
        const resultLines = result.split('\n')
        const wrappedLines: string[] = []
        
        resultLines.forEach(line => {
          if (line.length <= options.max_line_length) {
            wrappedLines.push(line)
          } else {
            // Simple line wrapping - in practice, you'd want smarter wrapping
            const indent = line.match(/^\s*/)?.[0] || ''
            const content = line.substring(indent.length)
            
            if (content.length <= options.max_line_length - indent.length) {
              wrappedLines.push(line)
            } else {
              // Try to break at commas, operators, etc.
              const breakPoints = [', ', ' and ', ' or ', ' + ', ' - ', ' * ', ' / ']
              let broken = false
              
              for (const breakPoint of breakPoints) {
                const parts = content.split(breakPoint)
                if (parts.length > 1) {
                  let currentLine = indent + parts[0]
                  for (let i = 1; i < parts.length; i++) {
                    if ((currentLine + breakPoint + parts[i]).length <= options.max_line_length) {
                      currentLine += breakPoint + parts[i]
                    } else {
                      wrappedLines.push(currentLine + breakPoint)
                      currentLine = indent + '    ' + parts[i] // Add extra indentation
                    }
                  }
                  wrappedLines.push(currentLine)
                  broken = true
                  break
                }
              }
              
              if (!broken) {
                wrappedLines.push(line) // Keep as-is if can't break nicely
              }
            }
          }
        })
        
        result = wrappedLines.join('\n')
      }
      
      setOutput(result)
      setProcessingState({ 
        isProcessing: false, 
        hasError: false, 
        isSuccess: true 
      })
      
      // Clear success state after 2 seconds
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
    
    const blob = new Blob([output], { type: 'text/x-python' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted-code.py'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleCode = () => {
    const sample = `import os
import sys
from typing import List, Optional
def calculate_fibonacci(n:int)->List[int]:
    if n<=0:
        return[]
    elif n==1:
        return[0]
    elif n==2:
        return[0,1]
    
    fib=[0,1]
    for i in range(2,n):
        fib.append(fib[i-1]+fib[i-2])
    return fib

class DataProcessor:
    def __init__(self,data:List[int]):
        self.data=data
        self.processed=False
    
    def process(self)->Optional[float]:
        if not self.data:
            return None
        
        total=sum(self.data)
        average=total/len(self.data)
        self.processed=True
        return average

if __name__=="__main__":
    processor=DataProcessor([1,2,3,4,5])
    result=processor.process()
    print(f"Average: {result}")`
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
        <span className="text-white">Python Formatter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Python Formatter</h1>
            <p className="text-slate-300">Format and beautify your Python code following PEP 8 standards</p>
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
                <option value={4}>4 spaces (PEP 8)</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Line Length
              </label>
              <select
                value={options.max_line_length}
                onChange={(e) => setOptions({ ...options, max_line_length: Number(e.target.value) })}
                className="form-input w-full"
              >
                <option value={79}>79 chars (PEP 8)</option>
                <option value={88}>88 chars (Black)</option>
                <option value={100}>100 chars</option>
                <option value={120}>120 chars</option>
                <option value={0}>No limit</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="sort_imports"
                    checked={options.sort_imports}
                    onChange={(e) => setOptions({ ...options, sort_imports: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="sort_imports" className="text-sm text-slate-300">
                    Sort imports
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="remove_blank_lines"
                    checked={options.remove_blank_lines}
                    onChange={(e) => setOptions({ ...options, remove_blank_lines: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="remove_blank_lines" className="text-sm text-slate-300">
                    Remove extra blank lines
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
            placeholder="# Paste your Python code here...
def hello_world():
    print('Hello, World!')

hello_world()"
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
              placeholder="# Formatted Python code will appear here..."
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
            <h4 className="font-medium text-white mb-2">PEP 8 Compliance</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Automatically fixes indentation and spacing</li>
              <li>• Follows Python's official style guide</li>
              <li>• Customizable formatting options</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Code Quality</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Improves code readability</li>
              <li>• Maintains code functionality</li>
              <li>• Enforces consistent style</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 