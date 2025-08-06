'use client'

import { useState, useCallback } from 'react'
import { Copy, Hash, RotateCcw, FileText, Download } from 'lucide-react'
import Link from 'next/link'

interface HashResult {
  algorithm: string
  hash: string
  timestamp: Date
}

interface HashOptions {
  algorithm: 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512' | 'SHA-384' | 'SHA-224'
  encoding: 'hex' | 'base64'
  uppercase: boolean
}

const hashAlgorithms = [
  { value: 'MD5', name: 'MD5', description: '128-bit hash (not recommended for security)' },
  { value: 'SHA-1', name: 'SHA-1', description: '160-bit hash (not recommended for security)' },
  { value: 'SHA-224', name: 'SHA-224', description: '224-bit hash' },
  { value: 'SHA-256', name: 'SHA-256', description: '256-bit hash (recommended)' },
  { value: 'SHA-384', name: 'SHA-384', description: '384-bit hash' },
  { value: 'SHA-512', name: 'SHA-512', description: '512-bit hash (highest security)' }
]

const defaultOptions: HashOptions = {
  algorithm: 'SHA-256',
  encoding: 'hex',
  uppercase: false
}

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState<HashOptions>(defaultOptions)
  const [hashResults, setHashResults] = useState<HashResult[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const generateHash = useCallback(async (text: string, algorithm: string, encoding: 'hex' | 'base64'): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    let hashBuffer: ArrayBuffer
    
    switch (algorithm) {
      case 'MD5':
        // Note: MD5 is not available in Web Crypto API, so we'll use a polyfill or show a message
        return 'MD5 not available in browser (use SHA-256 instead)'
      case 'SHA-1':
        hashBuffer = await crypto.subtle.digest('SHA-1', data)
        break
      case 'SHA-224':
        hashBuffer = await crypto.subtle.digest('SHA-224', data)
        break
      case 'SHA-256':
        hashBuffer = await crypto.subtle.digest('SHA-256', data)
        break
      case 'SHA-384':
        hashBuffer = await crypto.subtle.digest('SHA-384', data)
        break
      case 'SHA-512':
        hashBuffer = await crypto.subtle.digest('SHA-512', data)
        break
      default:
        throw new Error(`Unsupported algorithm: ${algorithm}`)
    }
    
    if (encoding === 'hex') {
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    } else {
      return btoa(String.fromCharCode(...Array.from(new Uint8Array(hashBuffer))))
    }
  }, [])

  const generateHashes = useCallback(async () => {
    if (!input.trim()) return
    
    setIsProcessing(true)
    try {
      const results: HashResult[] = []
      
      // Only generate the selected algorithm
      const selectedAlgo = hashAlgorithms.find(a => a.value === options.algorithm)
      if (!selectedAlgo) return
      
      if (selectedAlgo.value === 'MD5') {
        results.push({
          algorithm: selectedAlgo.value,
          hash: 'MD5 not available in browser (use SHA-256 instead)',
          timestamp: new Date()
        })
      } else {
        const hash = await generateHash(input, selectedAlgo.value, options.encoding)
        let finalHash = hash
        
        if (options.uppercase && options.encoding === 'hex') {
          finalHash = hash.toUpperCase()
        }
        
        results.push({
          algorithm: selectedAlgo.value,
          hash: finalHash,
          timestamp: new Date()
        })
      }
      
      setHashResults(results)
    } catch (error) {
      console.error('Error generating hashes:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [input, options, generateHash])

  const generateAllHashes = useCallback(async () => {
    if (!input.trim()) return
    
    setIsProcessing(true)
    try {
      const results: HashResult[] = []
      
      for (const algo of hashAlgorithms) {
        if (algo.value === 'MD5') {
          results.push({
            algorithm: algo.value,
            hash: 'MD5 not available in browser (use SHA-256 instead)',
            timestamp: new Date()
          })
          continue
        }
        
        const hash = await generateHash(input, algo.value, options.encoding)
        let finalHash = hash
        
        if (options.uppercase && options.encoding === 'hex') {
          finalHash = hash.toUpperCase()
        }
        
        results.push({
          algorithm: algo.value,
          hash: finalHash,
          timestamp: new Date()
        })
      }
      
      setHashResults(results)
    } catch (error) {
      console.error('Error generating hashes:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [input, options, generateHash])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  const copyAll = useCallback(async () => {
    const allHashes = hashResults.map(r => `${r.algorithm}: ${r.hash}`).join('\n')
    try {
      await navigator.clipboard.writeText(allHashes)
      setCopied('all')
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [hashResults])

  const clearAll = useCallback(() => {
    setInput('')
    setHashResults([])
    setCopied(null)
  }, [])

  const updateOption = useCallback((key: keyof HashOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const downloadResults = useCallback(() => {
    if (hashResults.length === 0) return
    
    const content = `Hash Results\nGenerated: ${new Date().toISOString()}\nInput: ${input}\n\n${hashResults.map(r => `${r.algorithm}: ${r.hash}`).join('\n')}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hashes_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [hashResults, input])

  const loadSample = useCallback(() => {
    const sampleText = `Hello, World!
This is a sample text for hash generation.
It includes multiple lines and various characters: !@#$%^&*()_+-=[]{}|;:,.<>?
Numbers: 1234567890
Special characters: ñáéíóúüç
Emojis: 🚀✨🎉
Date: ${new Date().toISOString()}`

    setInput(sampleText)
    setHashResults([])
    setCopied(null)
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Hash Generator</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
            <Hash className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Hash Generator</h1>
            <p className="text-slate-300">Generate cryptographic hashes using various algorithms</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={generateHashes}
            disabled={!input.trim() || isProcessing}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Hash className="w-4 h-4" />
            <span>{isProcessing ? 'Generating...' : 'Generate Hash'}</span>
          </button>
          <button 
            onClick={generateAllHashes}
            disabled={!input.trim() || isProcessing}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Hash className="w-4 h-4" />
            <span>{isProcessing ? 'Generating...' : 'Generate All Hashes'}</span>
          </button>
          <button 
            onClick={loadSample}
            className="btn-ghost flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Load Sample</span>
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

      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Input Text</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          className="form-textarea w-full h-32 resize-none"
          maxLength={10000}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-400">
            {input.length}/10,000 characters
          </span>
          {input.trim() && (
            <span className="text-sm text-slate-400">
              {input.trim().length} characters to hash
            </span>
          )}
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Hash Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Algorithm (for single hash)
            </label>
            <select
              value={options.algorithm}
              onChange={(e) => updateOption('algorithm', e.target.value)}
              className="form-input w-full"
            >
              {hashAlgorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">
              {hashAlgorithms.find(a => a.value === options.algorithm)?.description}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Output Encoding
            </label>
            <select
              value={options.encoding}
              onChange={(e) => updateOption('encoding', e.target.value)}
              className="form-input w-full"
            >
              <option value="hex">Hexadecimal</option>
              <option value="base64">Base64</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="uppercase"
              checked={options.uppercase}
              onChange={(e) => updateOption('uppercase', e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="uppercase" className="ml-2 text-sm text-slate-300">
              Uppercase (hex only)
            </label>
          </div>
        </div>
      </div>

      {hashResults.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Generated Hashes ({hashResults.length})
            </h3>
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className="btn-secondary flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied === 'all' ? 'Copied!' : 'Copy All'}</span>
              </button>
              <button
                onClick={downloadResults}
                className="btn-ghost flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {hashResults.map((result) => (
              <div
                key={result.algorithm}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="bg-blue-500/20 w-3 h-3 rounded-full"></div>
                    <span className="text-sm font-medium text-blue-400">
                      {result.algorithm}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(result.hash)}
                    className="btn-ghost text-sm"
                    title="Copy hash"
                  >
                    {copied === result.hash ? (
                      <span className="text-green-400">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="font-mono text-sm bg-slate-100 text-slate-800 p-3 rounded border border-slate-300 break-all">
                  {result.hash}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                  <span>{result.hash.length} characters</span>
                  <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔐 Hash Security Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Algorithm Recommendations</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong>SHA-256:</strong> Recommended for most use cases</li>
              <li>• <strong>SHA-512:</strong> Highest security, larger output</li>
              <li>• <strong>MD5/SHA-1:</strong> Not recommended for security</li>
              <li>• <strong>SHA-224/384:</strong> Good alternatives</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Security Best Practices</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use SHA-256 or SHA-512 for security-critical applications</li>
              <li>• Combine with salt for password hashing</li>
              <li>• Verify hashes using multiple sources</li>
              <li>• Consider using HMAC for message authentication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 