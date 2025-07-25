'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

interface ConversionOptions {
  indentSize: number
  quotingStyle: 'minimal' | 'preserve' | 'force'
  arrayFormat: 'block' | 'flow'
  preserveComments: boolean
  sortKeys: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function YamlJsonConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [conversionMode, setConversionMode] = useState<'yaml-to-json' | 'json-to-yaml'>('yaml-to-json')
  const [options, setOptions] = useState<ConversionOptions>({
    indentSize: 2,
    quotingStyle: 'minimal',
    arrayFormat: 'block',
    preserveComments: false,
    sortKeys: false
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
      let result = ''
      
      if (conversionMode === 'yaml-to-json') {
        result = convertYamlToJson(input)
      } else {
        result = convertJsonToYaml(input)
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
        errorMessage: error instanceof Error ? error.message : 'Failed to convert data'
      })
    }
  }

  const convertYamlToJson = (yamlString: string): string => {
    try {
      // Simple YAML parser implementation
      const parsed = parseYaml(yamlString)
      return JSON.stringify(parsed, null, options.indentSize)
    } catch (error) {
      throw new Error('Invalid YAML format. Please check your input.')
    }
  }

  const convertJsonToYaml = (jsonString: string): string => {
    try {
      const data = JSON.parse(jsonString)
      return stringifyYaml(data, 0)
    } catch (error) {
      throw new Error('Invalid JSON format. Please check your input.')
    }
  }

  const parseYaml = (yamlString: string): any => {
    const lines = yamlString.split('\n')
    const result: any = {}
    const stack: any[] = [result]
    let currentIndent = 0
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmed = line.trim()
      
      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) continue
      
      const indent = line.length - line.trimStart().length
      const colonIndex = trimmed.indexOf(':')
      
      if (colonIndex === -1) continue
      
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()
      
      // Handle indentation changes
      if (indent < currentIndent) {
        // Pop from stack
        const levels = Math.floor((currentIndent - indent) / options.indentSize)
        for (let j = 0; j < levels; j++) {
          stack.pop()
        }
      }
      
      currentIndent = indent
      const current = stack[stack.length - 1]
      
      if (value === '' || value === '{}' || value === '[]') {
        // Object or array
        if (trimmed.endsWith('[]')) {
          current[key] = []
        } else {
          current[key] = {}
          stack.push(current[key])
        }
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // Inline array
        const arrayContent = value.slice(1, -1)
        current[key] = arrayContent.split(',').map(item => parseYamlValue(item.trim()))
      } else if (value.startsWith('{') && value.endsWith('}')) {
        // Inline object
        current[key] = {}
        // Simple inline object parsing
        const objContent = value.slice(1, -1)
        const pairs = objContent.split(',')
        pairs.forEach(pair => {
          const [k, v] = pair.split(':')
          if (k && v) {
            current[key][k.trim()] = parseYamlValue(v.trim())
          }
        })
      } else if (value.startsWith('-')) {
        // Array item
        if (!Array.isArray(current[key])) {
          current[key] = []
        }
        const arrayValue = value.substring(1).trim()
        current[key].push(parseYamlValue(arrayValue))
      } else {
        // Regular value
        current[key] = parseYamlValue(value)
      }
    }
    
    return result
  }

  const parseYamlValue = (value: string): any => {
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false
    if (value === '~') return null
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      return value.slice(1, -1)
    }
    
    // Try to parse as number
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value)
    }
    
    return value
  }

  const stringifyYaml = (obj: any, indent: number = 0): string => {
    if (obj === null) return 'null'
    if (obj === undefined) return 'null'
    if (typeof obj === 'boolean') return obj.toString()
    if (typeof obj === 'number') return obj.toString()
    if (typeof obj === 'string') {
      const needsQuotes = /[:\[\]{}",']/.test(obj) || obj.includes('\n')
      if (options.quotingStyle === 'force' || needsQuotes) {
        return `"${obj.replace(/"/g, '\\"')}"`
      }
      return obj
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      
      if (options.arrayFormat === 'flow') {
        return `[${obj.map(item => stringifyYaml(item, 0)).join(', ')}]`
      }
      
      // Block format
      const indentStr = ' '.repeat(indent)
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          const itemYaml = stringifyYaml(item, indent + options.indentSize)
          return `${indentStr}- ${itemYaml.replace(/\n/g, `\n${indentStr}  `)}`
        }
        return `${indentStr}- ${stringifyYaml(item, 0)}`
      }).join('\n')
    }
    
    if (typeof obj === 'object') {
      if (Object.keys(obj).length === 0) return '{}'
      
      const indentStr = ' '.repeat(indent)
      const keys = options.sortKeys ? Object.keys(obj).sort() : Object.keys(obj)
      
      return keys.map(key => {
        const value = obj[key]
        const yamlValue = stringifyYaml(value, indent + options.indentSize)
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (Object.keys(value).length === 0) {
            return `${indentStr}${key}: {}`
          }
          return `${indentStr}${key}:\n${yamlValue}`
        } else if (Array.isArray(value) && value.length > 0 && options.arrayFormat === 'block') {
          return `${indentStr}${key}:\n${yamlValue}`
        } else {
          return `${indentStr}${key}: ${yamlValue}`
        }
      }).join('\n')
    }
    
    return String(obj)
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
    
    const extension = conversionMode === 'yaml-to-json' ? 'json' : 'yml'
    const mimeType = conversionMode === 'yaml-to-json' ? 'application/json' : 'text/yaml'
    
    const blob = new Blob([output], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `converted-data.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleData = () => {
    if (conversionMode === 'yaml-to-json') {
      const sample = `# Sample YAML configuration
name: "DevToolkit API"
version: 1.2.0
database:
  host: localhost
  port: 5432
  name: devtools_db
  credentials:
    username: admin
    password: secret123
features:
  - authentication
  - file_conversion
  - code_formatting
  - data_validation
settings:
  debug: true
  max_file_size: 10485760
  allowed_formats: [json, yaml, csv, xml]
endpoints:
  - path: /api/convert
    methods: [POST, PUT]
    rate_limit: 100
  - path: /api/format
    methods: [POST]
    rate_limit: 50`
      setInput(sample)
    } else {
      const sample = JSON.stringify({
        "name": "DevToolkit API",
        "version": "1.2.0",
        "database": {
          "host": "localhost",
          "port": 5432,
          "name": "devtools_db",
          "credentials": {
            "username": "admin",
            "password": "secret123"
          }
        },
        "features": [
          "authentication",
          "file_conversion",
          "code_formatting",
          "data_validation"
        ],
        "settings": {
          "debug": true,
          "max_file_size": 10485760,
          "allowed_formats": ["json", "yaml", "csv", "xml"]
        },
        "endpoints": [
          {
            "path": "/api/convert",
            "methods": ["POST", "PUT"],
            "rate_limit": 100
          },
          {
            "path": "/api/format",
            "methods": ["POST"],
            "rate_limit": 50
          }
        ]
      }, null, 2)
      setInput(sample)
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const switchMode = () => {
    setConversionMode(prev => prev === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json')
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
        <span className="text-white">YAML ↔ JSON Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">YAML ↔ JSON Converter</h1>
            <p className="text-slate-300">Convert between YAML and JSON formats seamlessly</p>
          </div>
        </div>

        {/* Mode Switch & Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={switchMode}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{conversionMode === 'yaml-to-json' ? 'Switch to JSON → YAML' : 'Switch to YAML → JSON'}</span>
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
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Indent Size
              </label>
              <select
                value={options.indentSize}
                onChange={(e) => setOptions({ ...options, indentSize: Number(e.target.value) })}
                className="form-input w-full"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quoting Style
              </label>
              <select
                value={options.quotingStyle}
                onChange={(e) => setOptions({ ...options, quotingStyle: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="minimal">Minimal</option>
                <option value="preserve">Preserve</option>
                <option value="force">Force quotes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Array Format
              </label>
              <select
                value={options.arrayFormat}
                onChange={(e) => setOptions({ ...options, arrayFormat: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="block">Block style</option>
                <option value="flow">Flow style</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="sortKeys"
                checked={options.sortKeys}
                onChange={(e) => setOptions({ ...options, sortKeys: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="sortKeys" className="text-sm text-slate-300">
                Sort keys alphabetically
              </label>
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
          <span>Data converted successfully!</span>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Input ({conversionMode === 'yaml-to-json' ? 'YAML' : 'JSON'})
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
            placeholder={conversionMode === 'yaml-to-json' 
              ? '# Paste your YAML data here...\nname: "Example"\nversion: 1.0\nfeatures:\n  - feature1\n  - feature2'
              : '// Paste your JSON data here...\n{\n  "name": "Example",\n  "version": 1.0,\n  "features": ["feature1", "feature2"]\n}'
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
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Convert</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Output ({conversionMode === 'yaml-to-json' ? 'JSON' : 'YAML'})
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
              placeholder={`// Converted ${conversionMode === 'yaml-to-json' ? 'JSON' : 'YAML'} data will appear here...`}
            />
            
            {processingState.isProcessing && (
              <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="flex items-center space-x-3 text-white">
                  <div className="loading-spinner w-6 h-6" />
                  <span>Converting your data...</span>
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
            <h4 className="font-medium text-white mb-2">YAML to JSON</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Preserves data types and structure</li>
              <li>• Handles nested objects and arrays</li>
              <li>• Comments are processed during conversion</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">JSON to YAML</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Human-readable format with proper indentation</li>
              <li>• Configurable quoting and array styles</li>
              <li>• Perfect for configuration files</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 