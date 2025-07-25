'use client'

import { useState, useRef } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileText } from 'lucide-react'
import Link from 'next/link'
import * as beautify from 'js-beautify'

interface FormatOptions {
  indent_size: number
  indent_char: string
  preserve_newlines: boolean
  max_preserve_newlines: number
  wrap_line_length: number
  end_with_newline: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function JavaScriptFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [options, setOptions] = useState<FormatOptions>({
    indent_size: 2,
    indent_char: ' ',
    preserve_newlines: true,
    max_preserve_newlines: 2,
    wrap_line_length: 120,
    end_with_newline: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasError: false,
    isSuccess: false
  })
  const [copySuccess, setCopySuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProcess = async (action: 'format' | 'minify') => {
    if (!input.trim()) return

    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })
    
    // Simulate processing delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    try {
      let result: string
      if (action === 'format') {
        result = beautify.js(input, options)
      } else {
        result = beautify.js(input, {
          indent_size: 0,
          preserve_newlines: false,
          max_preserve_newlines: 0
        })
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
    
    const blob = new Blob([output], { type: 'text/javascript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted-code.js'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileSelect = async (file: File) => {
    if (!file) return
    
    // Check file type
    const allowedTypes = [
      'text/javascript',
      'application/javascript',
      'text/plain',
      'application/x-javascript'
    ]
    
    const isValidType = allowedTypes.includes(file.type) || 
                       file.name.endsWith('.js') || 
                       file.name.endsWith('.mjs') || 
                       file.name.endsWith('.jsx') ||
                       file.name.endsWith('.ts') ||
                       file.name.endsWith('.tsx')
    
    if (!isValidType) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'Please select a valid JavaScript/TypeScript file (.js, .mjs, .jsx, .ts, .tsx)'
      })
      return
    }

    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'File size should be less than 1MB'
      })
      return
    }

    try {
      const text = await file.text()
      setInput(text)
      setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'Failed to read file. Please try again.'
      })
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const loadSampleCode = () => {
    const sample = `function calculateSum(a,b){if(typeof a!=='number'||typeof b!=='number'){throw new Error('Both arguments must be numbers');}return a+b;}const result=calculateSum(5,10);console.log('Result:',result);`
    setInput(sample)
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".js,.mjs,.jsx,.ts,.tsx,text/javascript,application/javascript,text/plain"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/formatters" className="breadcrumb-item hover:text-slate-200 transition-colors">Formatters</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">JavaScript Formatter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">JavaScript Formatter</h1>
            <p className="text-slate-300">Format, beautify, and minify your JavaScript code</p>
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
            onClick={triggerFileInput}
            className="btn-ghost flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
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

      {/* Error Display */}
      {processingState.hasError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Error:</span>
            <span>{processingState.errorMessage}</span>
          </div>
        </div>
      )}

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
                Max Preserve Newlines
              </label>
              <input
                type="number"
                value={options.max_preserve_newlines}
                onChange={(e) => setOptions({ ...options, max_preserve_newlines: Number(e.target.value) })}
                className="form-input w-full"
                min="0"
                max="10"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserve_newlines"
                checked={options.preserve_newlines}
                onChange={(e) => setOptions({ ...options, preserve_newlines: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="preserve_newlines" className="ml-2 text-sm text-slate-300">
                Preserve existing line breaks
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="end_with_newline"
                checked={options.end_with_newline}
                onChange={(e) => setOptions({ ...options, end_with_newline: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="end_with_newline" className="ml-2 text-sm text-slate-300">
                End with newline
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!input.trim() ? (
        // Upload/Input Area with Drag & Drop
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 mb-8 ${
            isDragging 
              ? 'border-yellow-400 bg-yellow-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-yellow-500/20 p-4 rounded-full">
              <FileText className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragging ? 'Drop your JavaScript file here' : 'Upload a JavaScript file or start typing'}
              </h3>
              <p className="text-slate-400 mb-4">
                Drag and drop a JavaScript file, click to browse, or paste your code below
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={triggerFileInput}
                  className="btn-secondary"
                >
                  Choose File
                </button>
                <button
                  onClick={loadSampleCode}
                  className="btn-ghost"
                >
                  Load Sample
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Supports: .js, .mjs, .jsx, .ts, .tsx • Max file size: 1MB
            </p>
          </div>
        </div>
      ) : null}

      {/* Code Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Input</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={triggerFileInput}
                className="btn-ghost text-sm" 
                title="Upload file"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JavaScript code here..."
            className="form-textarea w-full h-96 font-mono text-sm"
            spellCheck={false}
          />

          {/* Format/Minify Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleProcess('format')}
              disabled={!input.trim() || processingState.isProcessing}
              className="btn-primary flex items-center space-x-2"
            >
              {processingState.isProcessing ? (
                <>
                  <div className="loading-spinner w-4 h-4" />
                  <span>Formatting...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Format</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => handleProcess('minify')}
              disabled={!input.trim() || processingState.isProcessing}
              className="btn-secondary flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Minify</span>
            </button>

            {processingState.isSuccess && (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Processed successfully!</span>
              </div>
            )}
          </div>

          {input && (
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>{input.split('\n').length} lines • {input.length} characters</span>
            </div>
          )}
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
              placeholder="Formatted code will appear here..."
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
              <li>• Automatically fixes indentation and spacing</li>
              <li>• Preserves code logic and functionality</li>
              <li>• Customizable formatting options</li>
              <li>• Supports drag & drop file upload</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Minification</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Removes unnecessary whitespace</li>
              <li>• Reduces file size for production</li>
              <li>• Maintains code functionality</li>
              <li>• Perfect for deployment optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 