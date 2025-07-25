'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

interface ConversionOptions {
  delimiter: ',' | ';' | '\t' | '|'
  includeHeaders: boolean
  flattenObjects: boolean
  arrayHandling: 'join' | 'separate' | 'index'
  quoteAll: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function JsonCsvConverter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [conversionMode, setConversionMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv')
  const [options, setOptions] = useState<ConversionOptions>({
    delimiter: ',',
    includeHeaders: true,
    flattenObjects: false,
    arrayHandling: 'join',
    quoteAll: false
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
      
      if (conversionMode === 'json-to-csv') {
        result = convertJsonToCsv(input)
      } else {
        result = convertCsvToJson(input)
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

  const convertJsonToCsv = (jsonString: string): string => {
    try {
      const data = JSON.parse(jsonString)
      
      // Handle single object by wrapping in array
      const arrayData = Array.isArray(data) ? data : [data]
      
      if (arrayData.length === 0) {
        return ''
      }
      
      // Flatten objects if option is enabled
      const processedData = options.flattenObjects 
        ? arrayData.map(item => flattenObject(item))
        : arrayData
      
      // Get all unique keys
      const allKeys = new Set<string>()
      processedData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(key => allKeys.add(key))
        }
      })
      
      const headers = Array.from(allKeys)
      const csvRows: string[] = []
      
      // Add headers if enabled
      if (options.includeHeaders) {
        csvRows.push(headers.map(header => formatCsvValue(header)).join(options.delimiter))
      }
      
      // Add data rows
      processedData.forEach(item => {
        const row = headers.map(header => {
          const value = item?.[header]
          return formatCsvValue(value)
        })
        csvRows.push(row.join(options.delimiter))
      })
      
      return csvRows.join('\n')
    } catch (error) {
      throw new Error('Invalid JSON format. Please check your input.')
    }
  }

  const convertCsvToJson = (csvString: string): string => {
    try {
      const lines = csvString.trim().split('\n')
      if (lines.length === 0) {
        return '[]'
      }
      
      // Parse CSV with custom delimiter
      const parsedLines = lines.map(line => parseCsvLine(line))
      
      let headers: string[]
      let dataLines: string[][]
      
      if (options.includeHeaders && parsedLines.length > 0) {
        headers = parsedLines[0]
        dataLines = parsedLines.slice(1)
      } else {
        // Generate generic headers if none provided
        const maxColumns = Math.max(...parsedLines.map(line => line.length))
        headers = Array.from({ length: maxColumns }, (_, i) => `column_${i + 1}`)
        dataLines = parsedLines
      }
      
      // Convert to JSON objects
      const jsonData = dataLines.map(line => {
        const obj: Record<string, any> = {}
        headers.forEach((header, index) => {
          const value = line[index] || ''
          obj[header] = parseValue(value)
        })
        return obj
      })
      
      return JSON.stringify(jsonData, null, 2)
    } catch (error) {
      throw new Error('Invalid CSV format. Please check your input.')
    }
  }

  const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
    const flattened: Record<string, any> = {}
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const newKey = prefix ? `${prefix}.${key}` : key
        
        if (obj[key] === null || obj[key] === undefined) {
          flattened[newKey] = ''
        } else if (Array.isArray(obj[key])) {
          if (options.arrayHandling === 'join') {
            flattened[newKey] = obj[key].join('; ')
          } else if (options.arrayHandling === 'index') {
            obj[key].forEach((item: any, index: number) => {
              flattened[`${newKey}[${index}]`] = item
            })
          } else {
            flattened[newKey] = JSON.stringify(obj[key])
          }
        } else if (typeof obj[key] === 'object') {
          Object.assign(flattened, flattenObject(obj[key], newKey))
        } else {
          flattened[newKey] = obj[key]
        }
      }
    }
    
    return flattened
  }

  const formatCsvValue = (value: any): string => {
    if (value === null || value === undefined) {
      return ''
    }
    
    const stringValue = String(value)
    const needsQuoting = options.quoteAll || 
                        stringValue.includes(options.delimiter) || 
                        stringValue.includes('"') || 
                        stringValue.includes('\n')
    
    if (needsQuoting) {
      return `"${stringValue.replace(/"/g, '""')}"`
    }
    
    return stringValue
  }

  const parseCsvLine = (line: string): string[] => {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"'
          i++ // Skip next quote
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === options.delimiter && !inQuotes) {
        result.push(current)
        current = ''
      } else {
        current += char
      }
    }
    
    result.push(current)
    return result
  }

  const parseValue = (value: string): any => {
    if (value === '') return ''
    
    // Try to parse as number
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value)
    }
    
    // Try to parse as boolean
    if (value.toLowerCase() === 'true') return true
    if (value.toLowerCase() === 'false') return false
    
    return value
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
    
    const extension = conversionMode === 'json-to-csv' ? 'csv' : 'json'
    const mimeType = conversionMode === 'json-to-csv' ? 'text/csv' : 'application/json'
    
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
    if (conversionMode === 'json-to-csv') {
      const sample = JSON.stringify([
        { id: 1, name: "John Doe", email: "john@example.com", age: 30, city: "New York" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", age: 25, city: "Los Angeles" },
        { id: 3, name: "Bob Johnson", email: "bob@example.com", age: 35, city: "Chicago" }
      ], null, 2)
      setInput(sample)
    } else {
      const sample = `id,name,email,age,city
1,John Doe,john@example.com,30,New York
2,Jane Smith,jane@example.com,25,Los Angeles
3,Bob Johnson,bob@example.com,35,Chicago`
      setInput(sample)
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const switchMode = () => {
    setConversionMode(prev => prev === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv')
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
        <span className="text-white">JSON ↔ CSV Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
            <ArrowLeftRight className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">JSON ↔ CSV Converter</h1>
            <p className="text-slate-300">Convert between JSON and CSV formats with intelligent field mapping</p>
          </div>
        </div>

        {/* Mode Switch & Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={switchMode}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>{conversionMode === 'json-to-csv' ? 'Switch to CSV → JSON' : 'Switch to JSON → CSV'}</span>
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
                Delimiter
              </label>
              <select
                value={options.delimiter}
                onChange={(e) => setOptions({ ...options, delimiter: e.target.value as any })}
                className="form-input w-full"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value="\t">Tab</option>
                <option value="|">Pipe (|)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Array Handling
              </label>
              <select
                value={options.arrayHandling}
                onChange={(e) => setOptions({ ...options, arrayHandling: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="join">Join with semicolon</option>
                <option value="separate">Separate columns</option>
                <option value="index">Index notation</option>
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
                    id="includeHeaders"
                    checked={options.includeHeaders}
                    onChange={(e) => setOptions({ ...options, includeHeaders: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="includeHeaders" className="text-sm text-slate-300">
                    Include headers
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="flattenObjects"
                    checked={options.flattenObjects}
                    onChange={(e) => setOptions({ ...options, flattenObjects: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="flattenObjects" className="text-sm text-slate-300">
                    Flatten nested objects
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="quoteAll"
                    checked={options.quoteAll}
                    onChange={(e) => setOptions({ ...options, quoteAll: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="quoteAll" className="text-sm text-slate-300">
                    Quote all values
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
              Input ({conversionMode === 'json-to-csv' ? 'JSON' : 'CSV'})
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
            placeholder={conversionMode === 'json-to-csv' 
              ? '// Paste your JSON data here...\n[\n  {"name": "John", "age": 30},\n  {"name": "Jane", "age": 25}\n]'
              : '// Paste your CSV data here...\nname,age\nJohn,30\nJane,25'
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
              Output ({conversionMode === 'json-to-csv' ? 'CSV' : 'JSON'})
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
              placeholder={`// Converted ${conversionMode === 'json-to-csv' ? 'CSV' : 'JSON'} data will appear here...`}
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
            <h4 className="font-medium text-white mb-2">JSON to CSV</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Handles nested objects with flattening option</li>
              <li>• Smart array handling with multiple strategies</li>
              <li>• Automatic field detection and mapping</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">CSV to JSON</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Intelligent type inference</li>
              <li>• Custom delimiter support</li>
              <li>• Header detection and validation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 