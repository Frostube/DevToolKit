'use client'

import { useState, useCallback } from 'react'
import { Copy, Eye, EyeOff, Shield, Lock, Key, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface PasswordOptions {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSymbols: boolean
  excludeSimilar: boolean
  excludeAmbiguous: boolean
  customChars: string
}

interface GeneratedPassword {
  id: string
  password: string
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
  timestamp: Date
}

const passwordPresets = [
  { name: 'Simple', length: 8, uppercase: true, lowercase: true, numbers: true, symbols: false },
  { name: 'Standard', length: 12, uppercase: true, lowercase: true, numbers: true, symbols: true },
  { name: 'Strong', length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true },
  { name: 'Ultra Strong', length: 24, uppercase: true, lowercase: true, numbers: true, symbols: true },
  { name: 'PIN', length: 6, uppercase: false, lowercase: false, numbers: true, symbols: false },
  { name: 'Memorable', length: 20, uppercase: true, lowercase: true, numbers: true, symbols: false }
]

const defaultOptions: PasswordOptions = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: false,
  excludeAmbiguous: false,
  customChars: ''
}

export function PasswordGenerator() {
  const [options, setOptions] = useState<PasswordOptions>(defaultOptions)
  const [generatedPasswords, setGeneratedPasswords] = useState<GeneratedPassword[]>([])
  const [showPasswords, setShowPasswords] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(5)

  const generatePassword = useCallback((): string => {
    let charset = ''
    
    if (options.includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (options.includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (options.includeNumbers) charset += '0123456789'
    if (options.includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    if (options.customChars) charset += options.customChars

    if (options.excludeSimilar) {
      charset = charset.replace(/[il1Lo0O]/g, '')
    }

    if (options.excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\'"`~,;:.<>]/g, '')
    }

    if (charset.length === 0) {
      return 'Please select at least one character type'
    }

    let password = ''
    const array = new Uint8Array(options.length)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length]
    }

    return password
  }, [options])

  const calculateStrength = useCallback((password: string): { strength: GeneratedPassword['strength']; score: number } => {
    let score = 0

    score += Math.min(password.length * 4, 40)

    if (/[a-z]/.test(password)) score += 10
    if (/[A-Z]/.test(password)) score += 10
    if (/[0-9]/.test(password)) score += 10
    if (/[^A-Za-z0-9]/.test(password)) score += 15

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 5
    if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 5

    const repeatedChars = password.match(/(.)\1{2,}/g)
    if (repeatedChars) score -= repeatedChars.length * 5

    const sequential = password.match(/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|012)/gi)
    if (sequential) score -= sequential.length * 10

    score = Math.max(0, Math.min(100, score))

    let strength: GeneratedPassword['strength'] = 'weak'
    if (score >= 75) strength = 'very-strong'
    else if (score >= 50) strength = 'strong'
    else if (score >= 25) strength = 'medium'

    return { strength, score }
  }, [])

  const generatePasswords = useCallback(() => {
    const newPasswords: GeneratedPassword[] = []
    
    for (let i = 0; i < quantity; i++) {
      const password = generatePassword()
      const { strength, score } = calculateStrength(password)
      
      newPasswords.push({
        id: Date.now().toString() + i,
        password,
        strength,
        score,
        timestamp: new Date()
      })
    }

    setGeneratedPasswords(newPasswords)
  }, [generatePassword, calculateStrength, quantity])

  const copyToClipboard = useCallback(async (password: string) => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(password)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  const copyAll = useCallback(async () => {
    const allPasswords = generatedPasswords.map(p => p.password).join('\n')
    try {
      await navigator.clipboard.writeText(allPasswords)
      setCopied('all')
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [generatedPasswords])

  const clearAll = useCallback(() => {
    setGeneratedPasswords([])
    setCopied(null)
  }, [])

  const applyPreset = useCallback((preset: typeof passwordPresets[0]) => {
    setOptions({
      ...defaultOptions,
      length: preset.length,
      includeUppercase: preset.uppercase,
      includeLowercase: preset.lowercase,
      includeNumbers: preset.numbers,
      includeSymbols: preset.symbols
    })
  }, [])

  const updateOption = useCallback((key: keyof PasswordOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const getStrengthColor = (strength: GeneratedPassword['strength']) => {
    switch (strength) {
      case 'weak': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'strong': return 'text-green-400'
      case 'very-strong': return 'text-emerald-400'
      default: return 'text-gray-400'
    }
  }

  const getStrengthBgColor = (strength: GeneratedPassword['strength']) => {
    switch (strength) {
      case 'weak': return 'bg-red-500/20'
      case 'medium': return 'bg-yellow-500/20'
      case 'strong': return 'bg-green-500/20'
      case 'very-strong': return 'bg-emerald-500/20'
      default: return 'bg-gray-500/20'
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Password Generator</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Password Generator</h1>
            <p className="text-slate-300">Generate cryptographically secure passwords with customizable options</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={generatePasswords}
            className="btn-primary flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>Generate Passwords</span>
          </button>
          <button 
            onClick={() => setShowPasswords(!showPasswords)}
            className="btn-ghost flex items-center space-x-2"
          >
            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showPasswords ? 'Hide' : 'Show'} Passwords</span>
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

      <div className="mb-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {passwordPresets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="btn-ghost text-sm flex flex-col items-center p-3 rounded-lg border border-slate-600 hover:border-red-500 transition-colors"
            >
              <Lock className="w-4 h-4 mb-1" />
              <span className="font-medium">{preset.name}</span>
              <span className="text-xs text-slate-400">{preset.length} chars</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Password Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password Length: {options.length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={options.length}
              onChange={(e) => updateOption('length', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quantity: {quantity}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="uppercase"
                checked={options.includeUppercase}
                onChange={(e) => updateOption('includeUppercase', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="uppercase" className="ml-2 text-sm text-slate-300">
                Uppercase letters (A-Z)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lowercase"
                checked={options.includeLowercase}
                onChange={(e) => updateOption('includeLowercase', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="lowercase" className="ml-2 text-sm text-slate-300">
                Lowercase letters (a-z)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="numbers"
                checked={options.includeNumbers}
                onChange={(e) => updateOption('includeNumbers', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="numbers" className="ml-2 text-sm text-slate-300">
                Numbers (0-9)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="symbols"
                checked={options.includeSymbols}
                onChange={(e) => updateOption('includeSymbols', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="symbols" className="ml-2 text-sm text-slate-300">
                Symbols (!@#$%^&*)
              </label>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="exclude_similar"
                checked={options.excludeSimilar}
                onChange={(e) => updateOption('excludeSimilar', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="exclude_similar" className="ml-2 text-sm text-slate-300">
                Exclude similar characters (l, 1, I, O, 0)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="exclude_ambiguous"
                checked={options.excludeAmbiguous}
                onChange={(e) => updateOption('excludeAmbiguous', e.target.checked)}
                className="form-checkbox"
              />
              <label htmlFor="exclude_ambiguous" className="ml-2 text-sm text-slate-300">
                Exclude ambiguous characters (&#123; &#125; &#91; &#93; &#40; &#41; / \ &apos; &quot; ` ~ , ; : . &lt; &gt;)
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Custom Characters
            </label>
            <input
              type="text"
              value={options.customChars}
              onChange={(e) => updateOption('customChars', e.target.value)}
              placeholder="Add custom characters..."
              className="form-input w-full"
              maxLength={50}
            />
            <p className="text-xs text-slate-400 mt-1">
              Add any additional characters you want to include
            </p>
          </div>
        </div>
      </div>

      {generatedPasswords.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Generated Passwords ({generatedPasswords.length})
            </h3>
            <button
              onClick={copyAll}
              className="btn-secondary flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied === 'all' ? 'Copied!' : 'Copy All'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedPasswords.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getStrengthBgColor(item.strength)}`}></div>
                    <span className={`text-sm font-medium ${getStrengthColor(item.strength)}`}>
                      {item.strength.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.password)}
                    className="btn-ghost text-sm"
                    title="Copy password"
                  >
                    {copied === item.password ? (
                      <span className="text-green-400">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="font-mono text-lg bg-white text-black p-3 rounded border border-slate-600 break-all">
                    {showPasswords ? item.password : '•'.repeat(item.password.length)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{item.password.length} characters</span>
                    <span>Score: {item.score}/100</span>
                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.score >= 75 ? 'bg-emerald-500' :
                        item.score >= 50 ? 'bg-green-500' :
                        item.score >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🔒 Password Security Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Strong Password Guidelines</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use at least 12 characters</li>
              <li>• Include uppercase and lowercase letters</li>
              <li>• Add numbers and special characters</li>
              <li>• Avoid common patterns and words</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Security Best Practices</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use unique passwords for each account</li>
              <li>• Store passwords in a secure password manager</li>
              <li>• Enable two-factor authentication</li>
              <li>• Regularly update your passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 