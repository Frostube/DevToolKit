'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

interface ConversionOptions {
  urlSafe: boolean
  removeLineBreaks: boolean
  chunkOutput: boolean
  chunkSize: number
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function Base64Converter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [conversionMode, setConversionMode] = useState<'encode' | 'decode'>('encode')
  const [options, setOptions] = useState<ConversionOptions>({
    urlSafe: false,
    removeLineBreaks: false,
    chunkOutput: false,
    chunkSize: 76
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
        result = encodeBase64(input)
      } else {
        result = decodeBase64(input)
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
        errorMessage: error instanceof Error ? error.message : 'Failed to process data'
      })
    }
  }

  const encodeBase64 = (text: string): string => {
    try {
      // Use TextEncoder for proper UTF-8 handling
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      
      // Convert to base64
      let base64 = btoa(String.fromCharCode.apply(null, Array.from(data)))
      
      // URL-safe encoding if enabled
      if (options.urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
      }
      
      // Remove line breaks if enabled
      if (options.removeLineBreaks) {
        base64 = base64.replace(/\r?\n/g, '')
      }
      
      // Chunk output if enabled
      if (options.chunkOutput && options.chunkSize > 0) {
        const chunks = []
        for (let i = 0; i < base64.length; i += options.chunkSize) {
          chunks.push(base64.slice(i, i + options.chunkSize))
        }
        base64 = chunks.join('\n')
      }
      
      return base64
    } catch (error) {
      throw new Error('Failed to encode text. Please check your input.')
    }
  }

  const decodeBase64 = (base64: string): string => {
    try {
      let cleanBase64 = base64.trim()
      
      // Handle URL-safe base64
      if (options.urlSafe || !cleanBase64.includes('+') && !cleanBase64.includes('/')) {
        cleanBase64 = cleanBase64.replace(/-/g, '+').replace(/_/g, '/')
        
        // Add padding if needed
        while (cleanBase64.length % 4) {
          cleanBase64 += '='
        }
      }
      
      // Remove line breaks and whitespace
      cleanBase64 = cleanBase64.replace(/\s/g, '')
      
      // Validate base64 format
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanBase64)) {
        throw new Error('Invalid Base64 format')
      }
      
      // Decode from base64
      const binaryString = atob(cleanBase64)
      const bytes = new Uint8Array(binaryString.length)
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      
      // Use TextDecoder for proper UTF-8 handling
      const decoder = new TextDecoder('utf-8')
      return decoder.decode(bytes)
    } catch (error) {
      throw new Error('Invalid Base64 string. Please check your input.')
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
    
    const extension = conversionMode === 'encode' ? 'b64' : 'txt'
    const mimeType = conversionMode === 'encode' ? 'text/plain' : 'text/plain'
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `base64-${conversionMode}d.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleData = () => {
    if (conversionMode === 'encode') {
      const sample = "Hello, World! 🌍\nThis is a sample text for Base64 encoding.\nSpecial characters: äöü, éñ, 中文, 🚀"
      setInput(sample)
    } else {
      const sample = "SGVsbG8sIFdvcmxkISDwn4yNClRoaXMgaXMgYSBzYW1wbGUgdGV4dCBmb3IgQmFzZTY0IGVuY29kaW5nLgpTcGVjaWFsIGNoYXJhY3RlcnM6IMOkw7bDnCwgw6nDsSwg5Lit5paHLCDwn5qA"
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/converters" className="breadcrumb-item hover:text-slate-200 transition-colors">Converters</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Base64 Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Base64 Converter</h1>
            <p className="text-slate-300">Encode and decode Base64 strings with URL-safe options and file support</p>
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
                Format Options
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="urlSafe"
                    checked={options.urlSafe}
                    onChange={(e) => setOptions({ ...options, urlSafe: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="urlSafe" className="text-sm text-slate-300">
                    URL-safe encoding
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="removeLineBreaks"
                    checked={options.removeLineBreaks}
                    onChange={(e) => setOptions({ ...options, removeLineBreaks: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="removeLineBreaks" className="text-sm text-slate-300">
                    Remove line breaks
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="chunkOutput"
                    checked={options.chunkOutput}
                    onChange={(e) => setOptions({ ...options, chunkOutput: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="chunkOutput" className="text-sm text-slate-300">
                    Chunk output
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Chunk Size
              </label>
              <input
                type="number"
                value={options.chunkSize}
                onChange={(e) => setOptions({ ...options, chunkSize: Number(e.target.value) })}
                className="form-input w-full"
                min="1"
                max="1000"
                disabled={!options.chunkOutput}
              />
              <p className="text-xs text-slate-400 mt-1">Characters per line</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {processingState.hasError && (
        <div className="error-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error processing data</p>
            <p className="text-sm opacity-90">{processingState.errorMessage}</p>
          </div>
        </div>
      )}

      {processingState.isSuccess && (
        <div className="success-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Data {conversionMode}d successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Input ({conversionMode === 'encode' ? 'Text' : 'Base64'})
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
              ? '// Paste your text here...\nHello, World!\nThis text will be encoded to Base64.'
              : '// Paste your Base64 string here...\nSGVsbG8sIFdvcmxkIQ=='
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
              Output ({conversionMode === 'encode' ? 'Base64' : 'Text'})
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
              placeholder={`// ${conversionMode === 'encode' ? 'Base64 encoded' : 'Decoded text'} data will appear here...`}
            />
            
            {processingState.isProcessing && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-3 text-white">
                  <div className="loading-spinner w-6 h-6" />
                  <span>{conversionMode === 'encode' ? 'Encoding' : 'Decoding'} your data...</span>
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
            <h4 className="font-medium text-white mb-2">Encoding</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Supports UTF-8 text with special characters</li>
              <li>• URL-safe encoding replaces +/= with -_</li>
              <li>• Chunk output for better readability</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Decoding</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Auto-detects URL-safe format</li>
              <li>• Handles missing padding automatically</li>
              <li>• Validates Base64 format before decoding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 