'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, ArrowLeftRight, Globe } from 'lucide-react'
import Link from 'next/link'

interface EncodingOptions {
  encodingType: 'url' | 'component' | 'form' | 'html'
  preserveSlashes: boolean
  plusForSpaces: boolean
  upperCaseHex: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function UrlEncoder() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [conversionMode, setConversionMode] = useState<'encode' | 'decode'>('encode')
  const [options, setOptions] = useState<EncodingOptions>({
    encodingType: 'url',
    preserveSlashes: false,
    plusForSpaces: false,
    upperCaseHex: false
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
    
    await new Promise(resolve => setTimeout(resolve, 200))

    try {
      let result = ''
      
      if (conversionMode === 'encode') {
        result = encodeUrl(input)
      } else {
        result = decodeUrl(input)
      }
      
      setOutput(result)
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
        errorMessage: error instanceof Error ? error.message : 'Failed to process URL'
      })
    }
  }

  const encodeUrl = (text: string): string => {
    try {
      let encoded = ''
      
      switch (options.encodingType) {
        case 'url':
          encoded = encodeURI(text)
          break
        case 'component':
          encoded = encodeURIComponent(text)
          break
        case 'form':
          encoded = encodeURIComponent(text).replace(/%20/g, '+')
          break
        case 'html':
          encoded = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
          break
        default:
          encoded = encodeURIComponent(text)
      }
      
      // Handle slashes preservation
      if (options.preserveSlashes && options.encodingType === 'component') {
        encoded = encoded.replace(/%2F/g, '/')
      }
      
      // Handle plus for spaces
      if (options.plusForSpaces && options.encodingType !== 'form') {
        encoded = encoded.replace(/%20/g, '+')
      }
      
      // Handle hex case
      if (options.upperCaseHex) {
        encoded = encoded.replace(/%[0-9a-f]{2}/gi, match => match.toUpperCase())
      }
      
      return encoded
    } catch (error) {
      throw new Error('Failed to encode URL. Please check your input.')
    }
  }

  const decodeUrl = (text: string): string => {
    try {
      let decoded = text
      
      switch (options.encodingType) {
        case 'url':
          decoded = decodeURI(text)
          break
        case 'component':
          decoded = decodeURIComponent(text)
          break
        case 'form':
          decoded = decodeURIComponent(text.replace(/\+/g, ' '))
          break
        case 'html':
          decoded = text
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&#x27;/g, "'")
          break
        default:
          decoded = decodeURIComponent(text)
      }
      
      return decoded
    } catch (error) {
      throw new Error('Invalid URL encoding. Please check your input.')
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
    
    const extension = 'txt'
    const mimeType = 'text/plain'
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `url-${conversionMode}d.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleData = () => {
    if (conversionMode === 'encode') {
      const sample = "https://example.com/search?q=hello world&category=web tools&lang=en"
      setInput(sample)
    } else {
      const sample = "https%3A//example.com/search%3Fq%3Dhello%20world%26category%3Dweb%20tools%26lang%3Den"
      setInput(sample)
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const switchMode = () => {
    setConversionMode(prev => prev === 'encode' ? 'decode' : 'encode')
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const validateUrl = (url: string): { isValid: boolean; message: string } => {
    try {
      if (conversionMode === 'encode') {
        // Basic URL validation for encoding
        if (url.includes('..') || url.includes('//')) {
          return { isValid: false, message: 'URL contains suspicious patterns' }
        }
        return { isValid: true, message: 'Valid URL format' }
      } else {
        // Validate encoded URL
        if (/%[^0-9A-Fa-f]/.test(url) || /%[0-9A-Fa-f][^0-9A-Fa-f]/.test(url)) {
          return { isValid: false, message: 'Invalid percent encoding' }
        }
        return { isValid: true, message: 'Valid encoded format' }
      }
    } catch {
      return { isValid: false, message: 'Invalid format' }
    }
  }

  const urlValidation = input ? validateUrl(input) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/converters" className="breadcrumb-item hover:text-slate-200 transition-colors">Converters</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">URL Encoder/Decoder</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">URL Encoder/Decoder</h1>
            <p className="text-slate-300">Encode and decode URLs and URI components with validation</p>
          </div>
        </div>

        {/* Mode Switch & Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={switchMode}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{conversionMode === 'encode' ? 'Switch to Decode' : 'Switch to Encode'}</span>
          </button>
          <button 
            onClick={loadSampleData}
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
          <h3 className="text-lg font-semibold text-white mb-4">Encoding Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Encoding Type
              </label>
              <select
                value={options.encodingType}
                onChange={(e) => setOptions({ ...options, encodingType: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="url">URL (encodeURI)</option>
                <option value="component">Component (encodeURIComponent)</option>
                <option value="form">Form data (application/x-www-form-urlencoded)</option>
                <option value="html">HTML entities</option>
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
                    id="preserveSlashes"
                    checked={options.preserveSlashes}
                    onChange={(e) => setOptions({ ...options, preserveSlashes: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="preserveSlashes" className="text-sm text-slate-300">
                    Preserve slashes (/)
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="plusForSpaces"
                    checked={options.plusForSpaces}
                    onChange={(e) => setOptions({ ...options, plusForSpaces: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="plusForSpaces" className="text-sm text-slate-300">
                    Use + for spaces
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="upperCaseHex"
                    checked={options.upperCaseHex}
                    onChange={(e) => setOptions({ ...options, upperCaseHex: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="upperCaseHex" className="text-sm text-slate-300">
                    Uppercase hex digits
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                URL Validation
              </label>
              {urlValidation && (
                <div className={`text-sm p-2 rounded border ${
                  urlValidation.isValid 
                    ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                  {urlValidation.message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {processingState.hasError && (
        <div className="error-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error processing URL</p>
            <p className="text-sm opacity-90">{processingState.errorMessage}</p>
          </div>
        </div>
      )}

      {processingState.isSuccess && (
        <div className="success-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>URL {conversionMode}d successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Input ({conversionMode === 'encode' ? 'Plain URL' : 'Encoded URL'})
            </h2>
            <div className="flex items-center space-x-2">
              <button className="btn-ghost text-sm" title="Upload file">
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={conversionMode === 'encode' 
              ? '// Paste your URL here...\nhttps://example.com/search?q=hello world&category=tools'
              : '// Paste your encoded URL here...\nhttps%3A//example.com/search%3Fq%3Dhello%20world'
            }
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
                  <span>{conversionMode === 'encode' ? 'Encoding...' : 'Decoding...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{conversionMode === 'encode' ? 'Encode' : 'Decode'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Output ({conversionMode === 'encode' ? 'Encoded URL' : 'Plain URL'})
            </h2>
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
              placeholder={`// ${conversionMode === 'encode' ? 'Encoded' : 'Decoded'} URL will appear here...`}
            />
            
            {processingState.isProcessing && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-3 text-white">
                  <div className="loading-spinner w-6 h-6" />
                  <span>{conversionMode === 'encode' ? 'Encoding' : 'Decoding'} your URL...</span>
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
            <h4 className="font-medium text-white mb-2">Encoding Types</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong>URL:</strong> Encodes special characters but preserves valid URL structure</li>
              <li>• <strong>Component:</strong> Encodes all special characters including / and ?</li>
              <li>• <strong>Form:</strong> Uses + for spaces, common in form submissions</li>
              <li>• <strong>HTML:</strong> Converts to HTML entities for display in web pages</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Common Use Cases</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Preparing URLs for HTTP requests</li>
              <li>• Encoding query parameters safely</li>
              <li>• Decoding URLs from server logs</li>
              <li>• Converting between different encoding standards</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 