'use client'

import { useState, useRef, useCallback } from 'react'
import QRCode from 'qrcode'
import { 
  Download, 
  Copy, 
  RefreshCw, 
  QrCode, 
  Palette, 
  Settings,
  ChevronDown,
  ChevronUp,
  Home,
  Hash,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw
} from 'lucide-react'
import Link from 'next/link'

interface QRCodeOptions {
  width: number
  margin: number
  color: {
    dark: string
    light: string
  }
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
  logo?: {
    enabled: boolean
    file: File | null
    size: number
    cornerRadius: number
    margin: number
  }
  style: {
    roundedCorners: boolean
    cornerRadius: number
    gradient: boolean
    gradientColors: string[]
    pattern: 'dots' | 'squares' | 'rounded'
  }
}

interface GeneratedQR {
  id: string
  text: string
  dataUrl: string
  options: QRCodeOptions
  timestamp: Date
}

const defaultOptions: QRCodeOptions = {
  width: 256,
  margin: 4,
  color: {
    dark: '#000000',
    light: '#FFFFFF'
  },
  errorCorrectionLevel: 'M',
  logo: {
    enabled: false,
    file: null,
    size: 60,
    cornerRadius: 8,
    margin: 4
  },
  style: {
    roundedCorners: false,
    cornerRadius: 4,
    gradient: false,
    gradientColors: ['#000000', '#333333'],
    pattern: 'squares'
  }
}

const errorCorrectionLevels = [
  { value: 'L', label: 'Low (7%)', description: 'Recovers up to 7% of data' },
  { value: 'M', label: 'Medium (15%)', description: 'Recovers up to 15% of data' },
  { value: 'Q', label: 'Quartile (25%)', description: 'Recovers up to 25% of data' },
  { value: 'H', label: 'High (30%)', description: 'Recovers up to 30% of data' }
]

const patternOptions = [
  { value: 'dots', label: 'Dots', description: 'Circular pattern' },
  { value: 'squares', label: 'Squares', description: 'Classic square pattern' },
  { value: 'rounded', label: 'Rounded', description: 'Rounded squares' }
]

const presetGradients = [
  { name: 'Classic', colors: ['#000000', '#000000'] },
  { name: 'Blue', colors: ['#1e40af', '#3b82f6'] },
  { name: 'Purple', colors: ['#7c3aed', '#a855f7'] },
  { name: 'Green', colors: ['#059669', '#10b981'] },
  { name: 'Orange', colors: ['#ea580c', '#f97316'] },
  { name: 'Pink', colors: ['#be185d', '#ec4899'] }
]

export function QRCodeGenerator() {
  const [text, setText] = useState('https://devtoolkit.com')
  const [options, setOptions] = useState<QRCodeOptions>(defaultOptions)
  const [generatedQR, setGeneratedQR] = useState<GeneratedQR | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateQR = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter some text or URL')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Generate base QR code
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      canvas.width = options.width
      canvas.height = options.width

      // Create QR code data URL
      const qrDataUrl = await QRCode.toDataURL(text, {
        width: options.width,
        margin: options.margin,
        color: {
          dark: options.color.dark,
          light: options.color.light
        },
        errorCorrectionLevel: options.errorCorrectionLevel
      })

      // Load QR code image
      const qrImage = new Image()
      await new Promise((resolve, reject) => {
        qrImage.onload = resolve
        qrImage.onerror = reject
        qrImage.src = qrDataUrl
      })

      // Draw QR code
      ctx.drawImage(qrImage, 0, 0)

      // Apply gradient if enabled
      if (options.style.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, options.width, options.width)
        options.style.gradientColors.forEach((color, index) => {
          gradient.addColorStop(index / (options.style.gradientColors.length - 1), color)
        })
        
        // Create a mask from the QR code
        const imageData = ctx.getImageData(0, 0, options.width, options.width)
        const data = imageData.data
        
        // Apply gradient to dark pixels only
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] < 128) { // Dark pixel
            const x = (i / 4) % options.width
            const y = Math.floor((i / 4) / options.width)
            const gradientColor = getGradientColorAt(x, y, options.width, options.style.gradientColors)
            data[i] = gradientColor.r
            data[i + 1] = gradientColor.g
            data[i + 2] = gradientColor.b
          }
        }
        
        ctx.putImageData(imageData, 0, 0)
      }

      // Add logo if enabled
      if (options.logo?.enabled && logoPreview) {
        const logoImage = new Image()
        await new Promise((resolve, reject) => {
          logoImage.onload = resolve
          logoImage.onerror = reject
          logoImage.src = logoPreview
        })

        const logoSize = options.logo.size
        const logoX = (options.width - logoSize) / 2
        const logoY = (options.width - logoSize) / 2

        // Add white background behind logo first
        ctx.save()
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        // Use a polyfill for roundRect if not available
        if (ctx.roundRect) {
          ctx.roundRect(
            logoX - options.logo.margin, 
            logoY - options.logo.margin, 
            logoSize + (options.logo.margin * 2), 
            logoSize + (options.logo.margin * 2), 
            options.logo.cornerRadius + options.logo.margin
          )
        } else {
          // Fallback for browsers without roundRect
          const radius = options.logo.cornerRadius + options.logo.margin
          const x = logoX - options.logo.margin
          const y = logoY - options.logo.margin
          const width = logoSize + (options.logo.margin * 2)
          const height = logoSize + (options.logo.margin * 2)
          
          ctx.moveTo(x + radius, y)
          ctx.lineTo(x + width - radius, y)
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
          ctx.lineTo(x + width, y + height - radius)
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
          ctx.lineTo(x + radius, y + height)
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
          ctx.lineTo(x, y + radius)
          ctx.quadraticCurveTo(x, y, x + radius, y)
        }
        ctx.fill()
        ctx.restore()

        // Create rounded rectangle mask for logo
        ctx.save()
        ctx.beginPath()
        // Use a polyfill for roundRect if not available
        if (ctx.roundRect) {
          ctx.roundRect(logoX, logoY, logoSize, logoSize, options.logo.cornerRadius)
        } else {
          // Fallback for browsers without roundRect
          const radius = options.logo.cornerRadius
          ctx.moveTo(logoX + radius, logoY)
          ctx.lineTo(logoX + logoSize - radius, logoY)
          ctx.quadraticCurveTo(logoX + logoSize, logoY, logoX + logoSize, logoY + radius)
          ctx.lineTo(logoX + logoSize, logoY + logoSize - radius)
          ctx.quadraticCurveTo(logoX + logoSize, logoY + logoSize, logoX + logoSize - radius, logoY + logoSize)
          ctx.lineTo(logoX + radius, logoY + logoSize)
          ctx.quadraticCurveTo(logoX, logoY + logoSize, logoX, logoY + logoSize - radius)
          ctx.lineTo(logoX, logoY + radius)
          ctx.quadraticCurveTo(logoX, logoY, logoX + radius, logoY)
        }
        ctx.clip()

        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize)
        ctx.restore()
      }

      const newQR: GeneratedQR = {
        id: Date.now().toString(),
        text: text.trim(),
        dataUrl: canvas.toDataURL('image/png'),
        options: { ...options },
        timestamp: new Date()
      }

      setGeneratedQR(newQR)
    } catch (err) {
      setError('Failed to generate QR code. Please check your input.')
      console.error('QR generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [text, options, logoPreview])

  const getGradientColorAt = (x: number, y: number, width: number, colors: string[]): { r: number, g: number, b: number } => {
    const progress = (x + y) / (width * 2)
    const colorIndex = progress * (colors.length - 1)
    const index1 = Math.floor(colorIndex)
    const index2 = Math.min(index1 + 1, colors.length - 1)
    const factor = colorIndex - index1

    const color1 = hexToRgb(colors[index1])
    const color2 = hexToRgb(colors[index2])

    return {
      r: Math.round(color1.r + (color2.r - color1.r) * factor),
      g: Math.round(color1.g + (color2.g - color1.g) * factor),
      b: Math.round(color1.b + (color2.b - color1.b) * factor)
    }
  }

  const hexToRgb = (hex: string): { r: number, g: number, b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Logo file size must be less than 2MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
        setOptions(prev => ({
          ...prev,
          logo: {
            ...prev.logo!,
            file,
            enabled: true
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const removeLogo = useCallback(() => {
    setLogoPreview(null)
    setOptions(prev => ({
      ...prev,
      logo: {
        ...prev.logo!,
        file: null,
        enabled: false
      }
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const downloadQR = useCallback(() => {
    if (!generatedQR) return

    const link = document.createElement('a')
    link.download = `qr-code-${Date.now()}.png`
    link.href = generatedQR.dataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [generatedQR])

  const copyToClipboard = useCallback(async () => {
    if (!generatedQR) return

    try {
      await navigator.clipboard.writeText(generatedQR.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }, [generatedQR])

  const updateOption = useCallback((key: keyof QRCodeOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const updateColor = useCallback((type: 'dark' | 'light', value: string) => {
    setOptions(prev => ({
      ...prev,
      color: {
        ...prev.color,
        [type]: value
      }
    }))
  }, [])

  const updateStyleOption = useCallback((key: keyof QRCodeOptions['style'], value: any) => {
    setOptions(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [key]: value
      }
    }))
  }, [])

  const updateLogoOption = useCallback((key: keyof NonNullable<QRCodeOptions['logo']>, value: any) => {
    setOptions(prev => ({
      ...prev,
      logo: {
        ...prev.logo!,
        [key]: value
      }
    }))
  }, [])

  const applyGradientPreset = useCallback((colors: string[]) => {
    setOptions(prev => ({
      ...prev,
      style: {
        ...prev.style,
        gradientColors: colors,
        gradient: true
      }
    }))
  }, [])

  const clearAll = useCallback(() => {
    setText('https://devtoolkit.com')
    setOptions(defaultOptions)
    setGeneratedQR(null)
    setError(null)
    setCopied(false)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">QR Code Generator</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="qr-text" className="block text-sm font-medium text-gray-300 mb-2">
              Text or URL
            </label>
            <textarea
              id="qr-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text, URL, or any data to encode in QR code..."
              className="w-full h-32 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Settings Toggle */}
          <div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white hover:bg-slate-700 transition-colors"
            >
              <div className="flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>Advanced Settings</span>
              </div>
              {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSettings && (
              <div className="mt-4 p-6 bg-slate-800 border border-slate-600 rounded-lg space-y-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">Basic Settings</h4>
                  
                  {/* Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Size (pixels)
                    </label>
                    <input
                      type="range"
                      min="128"
                      max="512"
                      step="32"
                      value={options.width}
                      onChange={(e) => updateOption('width', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>128px</span>
                      <span>{options.width}px</span>
                      <span>512px</span>
                    </div>
                  </div>

                  {/* Margin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Margin
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="8"
                      step="1"
                      value={options.margin}
                      onChange={(e) => updateOption('margin', parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0</span>
                      <span>{options.margin}</span>
                      <span>8</span>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Error Correction Level
                    </label>
                    <select
                      value={options.errorCorrectionLevel}
                      onChange={(e) => updateOption('errorCorrectionLevel', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
                    >
                      {errorCorrectionLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Color Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">Color Settings</h4>
                  
                  {/* Gradient Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-300">Enable Gradient</label>
                    <button
                      onClick={() => updateStyleOption('gradient', !options.style.gradient)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        options.style.gradient ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        options.style.gradient ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {options.style.gradient ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-300">Gradient Presets</label>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-green-400">Active</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {presetGradients.map((preset, index) => {
                          const isSelected = JSON.stringify(preset.colors) === JSON.stringify(options.style.gradientColors)
                          return (
                            <button
                              key={index}
                              onClick={() => applyGradientPreset(preset.colors)}
                              className={`p-2 rounded border transition-all duration-200 ${
                                isSelected 
                                  ? 'border-green-400 bg-green-400/10 ring-2 ring-green-400/30' 
                                  : 'border-slate-600 hover:border-slate-500'
                              }`}
                            >
                              <div 
                                className="h-8 rounded"
                                style={{
                                  background: `linear-gradient(45deg, ${preset.colors[0]}, ${preset.colors[1]})`
                                }}
                              />
                              <div className="flex items-center justify-between mt-1">
                                <span className={`text-xs ${isSelected ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
                                  {preset.name}
                                </span>
                                {isSelected && (
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                )}
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Dark Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={options.color.dark}
                            onChange={(e) => updateColor('dark', e.target.value)}
                            className="w-10 h-10 rounded border border-slate-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={options.color.dark}
                            onChange={(e) => updateColor('dark', e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Light Color
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="color"
                            value={options.color.light}
                            onChange={(e) => updateColor('light', e.target.value)}
                            className="w-10 h-10 rounded border border-slate-600 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={options.color.light}
                            onChange={(e) => updateColor('light', e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white text-sm"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Logo Settings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-white">Logo Settings</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-gray-300">Add Logo</label>
                      <button
                        onClick={() => updateLogoOption('enabled', !options.logo?.enabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          options.logo?.enabled ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          options.logo?.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>

                    {options.logo?.enabled && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Upload Logo (PNG/JPG, max 2MB)
                          </label>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white hover:bg-slate-600 transition-colors"
                          >
                            <ImageIcon className="w-4 h-4 mr-2 inline" />
                            Choose Logo
                          </button>
                        </div>

                        {logoPreview && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Logo Preview</span>
                              <button
                                onClick={removeLogo}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="bg-white p-2 rounded">
                              <img src={logoPreview} alt="Logo preview" className="w-16 h-16 object-contain mx-auto" />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Logo Size: {options.logo.size}px
                              </label>
                              <input
                                type="range"
                                min="20"
                                max="100"
                                step="5"
                                value={options.logo.size}
                                onChange={(e) => updateLogoOption('size', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">
                                Corner Radius: {options.logo.cornerRadius}px
                              </label>
                              <input
                                type="range"
                                min="0"
                                max="20"
                                step="2"
                                value={options.logo.cornerRadius}
                                onChange={(e) => updateLogoOption('cornerRadius', parseInt(e.target.value))}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={generateQR}
              disabled={isGenerating || !text.trim()}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate QR Code
                </>
              )}
            </button>
            <button
              onClick={clearAll}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              Clear All
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Generated QR Code</h3>
            
            {generatedQR ? (
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg flex justify-center shadow-lg">
                  <img
                    src={generatedQR.dataUrl}
                    alt="Generated QR Code"
                    className="max-w-full h-auto"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Original Text:</span>
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="p-3 bg-slate-800 border border-slate-600 rounded text-sm text-gray-300 break-all">
                    {generatedQR.text}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Size:</span>
                      <span className="text-white ml-2">{generatedQR.options.width}px</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Error Correction:</span>
                      <span className="text-white ml-2">{generatedQR.options.errorCorrectionLevel}</span>
                    </div>
                    {generatedQR.options.logo?.enabled && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Logo:</span>
                        <span className="text-white ml-2">Enabled ({generatedQR.options.logo.size}px)</span>
                      </div>
                    )}
                    {generatedQR.options.style.gradient && (
                      <div className="col-span-2">
                        <span className="text-gray-400">Gradient:</span>
                        <span className="text-white ml-2">Enabled</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={downloadQR}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-600 rounded-lg p-8 text-center">
                <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Enter text above and click "Generate QR Code" to create your QR code</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 