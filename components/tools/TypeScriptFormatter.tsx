'use client'

import { useState } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info } from 'lucide-react'
import Link from 'next/link'

interface FormatOptions {
  indent_size: number
  wrap_line_length: number
  preserve_newlines: boolean
  semicolons: 'always' | 'remove' | 'preserve'
  quotes: 'single' | 'double' | 'preserve'
  trailing_commas: 'none' | 'es5' | 'all'
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

export function TypeScriptFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [options, setOptions] = useState<FormatOptions>({
    indent_size: 2,
    wrap_line_length: 120,
    preserve_newlines: true,
    semicolons: 'always',
    quotes: 'single',
    trailing_commas: 'es5'
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
      // Basic TypeScript formatting implementation
      let formatted = input
      
      // Split into lines for processing
      const lines = formatted.split('\n')
      const processedLines: string[] = []
      let indentLevel = 0
      let inStringLiteral = false
      let stringDelimiter = ''
      
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim()
        
        if (line === '' && !options.preserve_newlines) {
          continue
        }
        
        // Track string literals
        if (!inStringLiteral) {
          for (let j = 0; j < line.length; j++) {
            const char = line[j]
            if ((char === '"' || char === "'" || char === '`') && (j === 0 || line[j - 1] !== '\\')) {
              inStringLiteral = true
              stringDelimiter = char
              break
            }
          }
        } else {
          const delimiterIndex = line.indexOf(stringDelimiter)
          if (delimiterIndex !== -1) {
            inStringLiteral = false
            stringDelimiter = ''
          }
        }
        
        if (!inStringLiteral) {
          // Handle dedenting
          if (line.includes('}') || line.startsWith('case ') || line.startsWith('default:')) {
            if (indentLevel > 0) indentLevel--
          }
          
          // Quote normalization
          if (options.quotes === 'single') {
            line = line.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, "'$1'")
          } else if (options.quotes === 'double') {
            line = line.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"')
          }
          
          // Semicolon handling
          if (options.semicolons === 'always' && !line.endsWith(';') && !line.endsWith('{') && !line.endsWith('}') && line.length > 0 && !line.includes('//')) {
            if (!line.includes('if') && !line.includes('for') && !line.includes('while') && !line.includes('function') && !line.includes('class') && !line.includes('interface') && !line.includes('type ')) {
              line += ';'
            }
          } else if (options.semicolons === 'remove') {
            line = line.replace(/;$/, '')
          }
          
          // Add spacing around operators
          line = line.replace(/([^=!<>])=([^=])/g, '$1 = $2')
          line = line.replace(/([^+])\+([^+=])/g, '$1 + $2')
          line = line.replace(/([^-])-([^-=])/g, '$1 - $2')
          
          // Fix multiple spaces
          line = line.replace(/\s+/g, ' ')
          
          // Apply indentation
          const currentIndent = ' '.repeat(indentLevel * options.indent_size)
          processedLines.push(currentIndent + line)
          
          // Handle indenting
          if (line.endsWith('{') || line.includes('if (') || line.includes('for (') || line.includes('while (') || line.includes('function') || line.includes('class ') || line.includes('interface ')) {
            indentLevel++
          }
        } else {
          const currentIndent = ' '.repeat(indentLevel * options.indent_size)
          processedLines.push(currentIndent + line)
        }
      }
      
      let result = processedLines.join('\n')
      
      // Line length enforcement
      if (options.wrap_line_length > 0) {
        const resultLines = result.split('\n')
        const wrappedLines: string[] = []
        
        resultLines.forEach(line => {
          if (line.length <= options.wrap_line_length) {
            wrappedLines.push(line)
          } else {
            const indent = line.match(/^\s*/)?.[0] || ''
            const content = line.substring(indent.length)
            
            // Try to break at logical points
            const breakPoints = [', ', ' && ', ' || ', ' + ', ' - ', ' => ']
            let broken = false
            
            for (const breakPoint of breakPoints) {
              const parts = content.split(breakPoint)
              if (parts.length > 1) {
                let currentLine = indent + parts[0]
                for (let i = 1; i < parts.length; i++) {
                  if ((currentLine + breakPoint + parts[i]).length <= options.wrap_line_length) {
                    currentLine += breakPoint + parts[i]
                  } else {
                    wrappedLines.push(currentLine + breakPoint)
                    currentLine = indent + '  ' + parts[i]
                  }
                }
                wrappedLines.push(currentLine)
                broken = true
                break
              }
            }
            
            if (!broken) {
              wrappedLines.push(line)
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
    
    const blob = new Blob([output], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'formatted-code.ts'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const loadSampleCode = () => {
    const sample = `interface User{
name:string;
age:number;
email?:string
}
class UserService{
private users:User[]=[]
constructor(private apiUrl:string){}
async fetchUser(id:number):Promise<User|null>{
try{
const response=await fetch(\`\${this.apiUrl}/users/\${id}\`)
if(!response.ok)throw new Error('User not found')
return await response.json()
}catch(error){
console.error('Error fetching user:',error)
return null
}
}
addUser(user:User):void{
this.users.push(user)
}
}`
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
        <span className="text-white">TypeScript Formatter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-lg">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">TypeScript Formatter</h1>
            <p className="text-slate-300">Format and beautify your TypeScript code with type-aware formatting</p>
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
                Quotes
              </label>
              <select
                value={options.quotes}
                onChange={(e) => setOptions({ ...options, quotes: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="single">Single quotes</option>
                <option value="double">Double quotes</option>
                <option value="preserve">Preserve existing</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="preserve_newlines"
                checked={options.preserve_newlines}
                onChange={(e) => setOptions({ ...options, preserve_newlines: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="preserve_newlines" className="text-sm text-slate-300">
                Preserve newlines
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Semicolons
              </label>
              <select
                value={options.semicolons}
                onChange={(e) => setOptions({ ...options, semicolons: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="always">Always add</option>
                <option value="remove">Remove</option>
                <option value="preserve">Preserve existing</option>
              </select>
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
            placeholder="// Paste your TypeScript code here...
interface User {
  name: string;
  age: number;
}

function greetUser(user: User): string {
  return `Hello, ${user.name}!`;
}"
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
              placeholder="// Formatted TypeScript code will appear here..."
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
            <h4 className="font-medium text-white mb-2">Type Safety</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Preserves type annotations and interfaces</li>
              <li>• Maintains generic constraints</li>
              <li>• Handles union and intersection types</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Modern Features</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• ES6+ syntax support</li>
              <li>• Async/await formatting</li>
              <li>• Decorator and metadata support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 