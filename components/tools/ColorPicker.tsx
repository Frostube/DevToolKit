'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Copy, Pipette, Palette, Contrast, Check, X } from 'lucide-react'
import Link from 'next/link'

interface Color {
  hex: string
  rgb: { r: number; g: number; b: number }
  hsl: { h: number; s: number; l: number }
  hsv: { h: number; s: number; v: number }
  name?: string
}

interface ColorHarmony {
  type: string
  colors: Color[]
}

interface ContrastResult {
  ratio: number
  rating: 'AAA' | 'AA' | 'Fail'
  description: string
}

const colorNames: { [key: string]: string } = {
  '#FF0000': 'Red',
  '#FF4500': 'Orange Red',
  '#FFA500': 'Orange',
  '#FFD700': 'Gold',
  '#FFFF00': 'Yellow',
  '#9ACD32': 'Yellow Green',
  '#00FF00': 'Lime',
  '#00FA9A': 'Medium Spring Green',
  '#00FFFF': 'Cyan',
  '#00BFFF': 'Deep Sky Blue',
  '#0000FF': 'Blue',
  '#8A2BE2': 'Blue Violet',
  '#FF00FF': 'Magenta',
  '#FF1493': 'Deep Pink',
  '#FF69B4': 'Hot Pink',
  '#FFC0CB': 'Pink',
  '#F5F5DC': 'Beige',
  '#F5DEB3': 'Wheat',
  '#DEB887': 'Burly Wood',
  '#D2691E': 'Chocolate',
  '#8B4513': 'Saddle Brown',
  '#A0522D': 'Sienna',
  '#CD853F': 'Peru',
  '#DAA520': 'Golden Rod',
  '#BDB76B': 'Dark Khaki',
  '#F0E68C': 'Khaki',
  '#EEE8AA': 'Pale Golden Rod',
  '#98FB98': 'Pale Green',
  '#90EE90': 'Light Green',
  '#32CD32': 'Lime Green',
  '#228B22': 'Forest Green',
  '#006400': 'Dark Green',
  '#008B8B': 'Dark Cyan',
  '#20B2AA': 'Light Sea Green',
  '#48D1CC': 'Medium Turquoise',
  '#40E0D0': 'Turquoise',
  '#7FFFD4': 'Aquamarine',
  '#66CDAA': 'Medium Aquamarine',
  '#4682B4': 'Steel Blue',
  '#5F9EA0': 'Cadet Blue',
  '#B0C4DE': 'Light Steel Blue',
  '#B0E0E6': 'Powder Blue',
  '#ADD8E6': 'Light Blue',
  '#87CEEB': 'Sky Blue',
  '#87CEFA': 'Light Sky Blue',
  '#4169E1': 'Royal Blue',
  '#191970': 'Midnight Blue',
  '#483D8B': 'Dark Slate Blue',
  '#6A5ACD': 'Slate Blue',
  '#9370DB': 'Medium Purple',
  '#9400D3': 'Dark Violet',
  '#9932CC': 'Dark Orchid',
  '#BA55D3': 'Medium Orchid',
  '#DA70D6': 'Orchid',
  '#EE82EE': 'Violet',
  '#DDA0DD': 'Plum',
  '#E6E6FA': 'Lavender',
  '#F8F8FF': 'Ghost White',
  '#FFFFFF': 'White',
  '#F5F5F5': 'White Smoke',
  '#DCDCDC': 'Gainsboro',
  '#D3D3D3': 'Light Gray',
  '#C0C0C0': 'Silver',
  '#A9A9A9': 'Dark Gray',
  '#808080': 'Gray',
  '#696969': 'Dim Gray',
  '#2F4F4F': 'Dark Slate Gray',
  '#000000': 'Black'
}

export function ColorPicker() {
  const [currentColor, setCurrentColor] = useState<Color>({
    hex: '#FF6B6B',
    rgb: { r: 255, g: 107, b: 107 },
    hsl: { h: 0, s: 100, l: 71 },
    hsv: { h: 0, s: 58, v: 100 },
    name: 'Red'
  })
  const [copied, setCopied] = useState<string | null>(null)
  const [harmonyColors, setHarmonyColors] = useState<ColorHarmony[]>([])
  const [contrastColor, setContrastColor] = useState<Color>({
    hex: '#FFFFFF',
    rgb: { r: 255, g: 255, b: 255 },
    hsl: { h: 0, s: 0, l: 100 },
    hsv: { h: 0, s: 0, v: 100 },
    name: 'White'
  })
  const [contrastResult, setContrastResult] = useState<ContrastResult | null>(null)
  const [activeTab, setActiveTab] = useState<'picker' | 'harmony' | 'contrast'>('picker')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPicking, setIsPicking] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<Color[]>([])
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    }
    return { r: 0, g: 0, b: 0 }
  }, [])

  const rgbToHsl = useCallback((r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }, [])

  const rgbToHsv = useCallback((r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max
    const v = max

    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    }
  }, [])

  const getClosestColorName = useCallback((hex: string): string | undefined => {
    const hexUpper = hex.toUpperCase()
    if (colorNames[hexUpper]) {
      return colorNames[hexUpper]
    }
    
    let closestName: string | undefined
    let minDistance = Infinity
    
    Object.keys(colorNames).forEach(namedHex => {
      const distance = Math.abs(parseInt(hexUpper.slice(1), 16) - parseInt(namedHex.slice(1), 16))
      if (distance < minDistance) {
        minDistance = distance
        closestName = colorNames[namedHex]
      }
    })
    
    return closestName
  }, [])

  const updateColor = useCallback((hex: string) => {
    const rgb = hexToRgb(hex)
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
    const name = getClosestColorName(hex)

    const newColor: Color = {
      hex: hex.toUpperCase(),
      rgb,
      hsl,
      hsv,
      name
    }

    setCurrentColor(newColor)
  }, [hexToRgb, rgbToHsl, rgbToHsv, getClosestColorName])

  const generateHarmony = useCallback((color: Color) => {
    const harmonies: ColorHarmony[] = []
    const { h, s, l } = color.hsl

    // Complementary
    const compH = (h + 180) % 360
    const compColor: Color = {
      hex: hslToHex(compH, s, l),
      rgb: hslToRgb(compH, s, l),
      hsl: { h: compH, s, l },
      hsv: rgbToHsv(hslToRgb(compH, s, l).r, hslToRgb(compH, s, l).g, hslToRgb(compH, s, l).b),
      name: getClosestColorName(hslToHex(compH, s, l))
    }
    harmonies.push({
      type: 'Complementary',
      colors: [color, compColor]
    })

    // Analogous
    const analogous: Color[] = [color]
    for (let i = 1; i <= 2; i++) {
      const newH = (h + i * 30) % 360
      const newColor: Color = {
        hex: hslToHex(newH, s, l),
        rgb: hslToRgb(newH, s, l),
        hsl: { h: newH, s, l },
        hsv: rgbToHsv(hslToRgb(newH, s, l).r, hslToRgb(newH, s, l).g, hslToRgb(newH, s, l).b),
        name: getClosestColorName(hslToHex(newH, s, l))
      }
      analogous.push(newColor)
    }
    harmonies.push({
      type: 'Analogous',
      colors: analogous
    })

    // Triadic
    const triadic: Color[] = [color]
    for (let i = 1; i <= 2; i++) {
      const newH = (h + i * 120) % 360
      const newColor: Color = {
        hex: hslToHex(newH, s, l),
        rgb: hslToRgb(newH, s, l),
        hsl: { h: newH, s, l },
        hsv: rgbToHsv(hslToRgb(newH, s, l).r, hslToRgb(newH, s, l).g, hslToRgb(newH, s, l).b),
        name: getClosestColorName(hslToHex(newH, s, l))
      }
      triadic.push(newColor)
    }
    harmonies.push({
      type: 'Triadic',
      colors: triadic
    })

    // Monochromatic
    const monochromatic: Color[] = [color]
    for (let i = 1; i <= 3; i++) {
      const newL = Math.max(10, Math.min(90, l + (i - 2) * 20))
      const newColor: Color = {
        hex: hslToHex(h, s, newL),
        rgb: hslToRgb(h, s, newL),
        hsl: { h, s, l: newL },
        hsv: rgbToHsv(hslToRgb(h, s, newL).r, hslToRgb(h, s, newL).g, hslToRgb(h, s, newL).b),
        name: getClosestColorName(hslToHex(h, s, newL))
      }
      monochromatic.push(newColor)
    }
    harmonies.push({
      type: 'Monochromatic',
      colors: monochromatic
    })

    setHarmonyColors(harmonies)
  }, [getClosestColorName])

  const hslToHex = useCallback((h: number, s: number, l: number): string => {
    s /= 100
    l /= 100
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
    let r = 0, g = 0, b = 0

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }

    const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0')
    const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0')
    const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0')

    return `#${rHex}${gHex}${bHex}`.toUpperCase()
  }, [])

  const hslToRgb = useCallback((h: number, s: number, l: number) => {
    s /= 100
    l /= 100
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2
    let r = 0, g = 0, b = 0

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    }
  }, [])

  const calculateContrast = useCallback((color1: Color, color2: Color): ContrastResult => {
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const l1 = getLuminance(color1.rgb.r, color1.rgb.g, color1.rgb.b)
    const l2 = getLuminance(color2.rgb.r, color2.rgb.g, color2.rgb.b)

    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    const ratio = (lighter + 0.05) / (darker + 0.05)

    let rating: 'AAA' | 'AA' | 'Fail'
    let description: string

    if (ratio >= 7) {
      rating = 'AAA'
      description = 'Excellent contrast - meets AAA standards'
    } else if (ratio >= 4.5) {
      rating = 'AA'
      description = 'Good contrast - meets AA standards'
    } else {
      rating = 'Fail'
      description = 'Poor contrast - does not meet accessibility standards'
    }

    return { ratio, rating, description }
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  const startColorPicking = useCallback(() => {
    if ('EyeDropper' in window) {
      setIsPicking(true)
      const eyeDropper = new (window as any).EyeDropper()
      eyeDropper.open()
        .then((result: any) => {
          updateColor(result.sRGBHex)
          setIsPicking(false)
        })
        .catch(() => {
          setIsPicking(false)
        })
    } else {
      alert('EyeDropper API is not supported in this browser')
    }
  }, [updateColor])

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        extractColorsFromImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [handleFileSelect])

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const extractColorsFromImage = useCallback((imageSrc: string) => {
    setIsExtracting(true)
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const colors: { [key: string]: number } = {}

      // Sample pixels and count color frequencies
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]

        // Skip transparent pixels
        if (a < 128) continue

        // Skip very dark colors (likely shadows/noise)
        const brightness = (r + g + b) / 3
        if (brightness < 30) continue

        // Skip very light colors (likely highlights/noise)
        if (brightness > 240) continue

        // Quantize colors to reduce noise
        const quantizedR = Math.round(r / 16) * 16
        const quantizedG = Math.round(g / 16) * 16
        const quantizedB = Math.round(b / 16) * 16
        
        const hex = `#${quantizedR.toString(16).padStart(2, '0')}${quantizedG.toString(16).padStart(2, '0')}${quantizedB.toString(16).padStart(2, '0')}`
        colors[hex] = (colors[hex] || 0) + 1
      }

      // Group similar colors and calculate color scores
      const colorGroups: { [key: string]: { count: number; colors: string[]; score: number } } = {}
      
      Object.entries(colors).forEach(([hex, count]) => {
        const rgb = hexToRgb(hex)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        
        // Calculate color score based on saturation, lightness, and frequency
        const saturation = hsl.s
        const lightness = hsl.l
        const frequency = count
        
        // Higher score for more saturated, medium lightness, and frequent colors
        const score = (saturation / 100) * Math.min(lightness, 100 - lightness) / 50 * Math.log(frequency + 1)
        
        // Group colors that are visually similar
        const groupKey = `${Math.round(hsl.h / 30)}-${Math.round(saturation / 20)}-${Math.round(lightness / 20)}`
        
        if (!colorGroups[groupKey]) {
          colorGroups[groupKey] = { count: 0, colors: [], score: 0 }
        }
        
        colorGroups[groupKey].count += count
        colorGroups[groupKey].colors.push(hex)
        colorGroups[groupKey].score = Math.max(colorGroups[groupKey].score, score)
      })

      // Get top colors from each group, prioritizing by score
      const sortedGroups = Object.entries(colorGroups)
        .sort(([,a], [,b]) => b.score - a.score)
        .slice(0, 8)

      const extractedColors = sortedGroups.map(([groupKey, group]) => {
        // Get the most frequent color from this group
        const bestColor = group.colors.reduce((best, current) => {
          return colors[current] > colors[best] ? current : best
        }, group.colors[0])
        
        const rgb = hexToRgb(bestColor)
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
        const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
        const name = getClosestColorName(bestColor)
        
        return {
          hex: bestColor.toUpperCase(),
          rgb,
          hsl,
          hsv,
          name
        }
      })

      setExtractedColors(extractedColors)
      setIsExtracting(false)
    }
    img.src = imageSrc
  }, [hexToRgb, rgbToHsl, rgbToHsv, getClosestColorName])

  useEffect(() => {
    generateHarmony(currentColor)
  }, [currentColor, generateHarmony])

  useEffect(() => {
    if (contrastColor) {
      setContrastResult(calculateContrast(currentColor, contrastColor))
    }
  }, [currentColor, contrastColor, calculateContrast])

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/color-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Color Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Color Picker</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-lg">
            <Pipette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Color Picker</h1>
            <p className="text-slate-300">Pick, convert, and analyze colors with professional tools</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('picker')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'picker'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Color Picker
        </button>
        <button
          onClick={() => setActiveTab('harmony')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'harmony'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Color Harmony
        </button>
        <button
          onClick={() => setActiveTab('contrast')}
          className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contrast'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          Contrast Checker
        </button>
      </div>

      {/* Color Picker Tab */}
      {activeTab === 'picker' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Current Color Picker */}
          <div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">Current Color</h3>
              <div className="mb-6">
                <div
                  className="w-full h-32 rounded-lg border border-slate-600 mb-4"
                  style={{ backgroundColor: currentColor.hex }}
                />
                <div className="flex items-center space-x-3 mb-4">
                  <input
                    type="color"
                    value={currentColor.hex}
                    onChange={(e) => updateColor(e.target.value)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer hover:border-slate-400 transition-colors"
                  />
                  <button
                    onClick={startColorPicking}
                    disabled={isPicking}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Pipette className="w-4 h-4" />
                    <span>{isPicking ? 'Picking...' : 'Pick from Screen'}</span>
                  </button>
                </div>
                {currentColor.name && (
                  <div className="text-sm text-slate-300 mb-4">
                    <span className="font-medium">Color Name:</span> {currentColor.name}
                  </div>
                )}
              </div>
              {/* Color Formats */}
              <div className="space-y-3">
                <h4 className="font-medium text-white">Color Formats</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">HEX</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white">{currentColor.hex}</span>
                      <button
                        onClick={() => copyToClipboard(currentColor.hex)}
                        className="btn-ghost p-1"
                      >
                        {copied === currentColor.hex ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">RGB</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white">
                        rgb({currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b})
                      </span>
                      <button
                        onClick={() => copyToClipboard(`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`)}
                        className="btn-ghost p-1"
                      >
                        {copied === `rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">HSL</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white">
                        hsl({currentColor.hsl.h}, {currentColor.hsl.s}%, {currentColor.hsl.l}%)
                      </span>
                      <button
                        onClick={() => copyToClipboard(`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`)}
                        className="btn-ghost p-1"
                      >
                        {copied === `hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">HSV</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-white">
                        hsv({currentColor.hsv.h}, {currentColor.hsv.s}%, {currentColor.hsv.v}%)
                      </span>
                      <button
                        onClick={() => copyToClipboard(`hsv(${currentColor.hsv.h}, ${currentColor.hsv.s}%, ${currentColor.hsv.v}%)`)}
                        className="btn-ghost p-1"
                      >
                        {copied === `hsv(${currentColor.hsv.h}, ${currentColor.hsv.s}%, ${currentColor.hsv.v}%)` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Collapsible Color Values */}
            <CollapsibleColorValues
              currentColor={currentColor}
              hslToHex={hslToHex}
              updateColor={updateColor}
            />
          </div>
          {/* Right: Image Upload Section */}
          <div>
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Extract Colors from Image</h3>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded"
                      className="max-w-full h-32 object-contain mx-auto rounded-lg"
                    />
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={triggerFileInput}
                        className="btn-secondary text-sm"
                      >
                        Choose Another Image
                      </button>
                      <button
                        onClick={() => {
                          setUploadedImage(null)
                          setExtractedColors([])
                        }}
                        className="btn-ghost text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-slate-400">
                      <Pipette className="w-12 h-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Drop an image here</p>
                      <p className="text-sm">or click to browse</p>
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="btn-secondary"
                    >
                      Choose Image
                    </button>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
                className="hidden"
              />
              {isExtracting && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center space-x-2 text-slate-300">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-400"></div>
                    <span>Extracting colors...</span>
                  </div>
                </div>
              )}
              {extractedColors.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-white mb-3">Extracted Colors</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {extractedColors.map((color, index) => (
                      <div
                        key={index}
                        className="text-center cursor-pointer group"
                        onClick={() => updateColor(color.hex)}
                      >
                        <div
                          className="w-full h-16 rounded-lg border border-slate-600 transition-all duration-200 hover:scale-105 mb-2"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">
                          {color.hex}
                        </div>
                        {color.name && (
                          <div className="text-xs text-slate-400">{color.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Color Harmony Tab */}
      {activeTab === 'harmony' && (
        <div className="space-y-6">
          {harmonyColors.map((harmony, index) => (
            <div key={index} className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{harmony.type} Harmony</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {harmony.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg border border-slate-600 cursor-pointer transition-all duration-200 hover:scale-105 mb-2"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => updateColor(color.hex)}
                      title={`Click to select ${color.hex}`}
                    />
                    <div className="text-xs font-mono text-slate-300">{color.hex}</div>
                    {color.name && (
                      <div className="text-xs text-slate-400">{color.name}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contrast Checker Tab */}
      {activeTab === 'contrast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Color Selection */}
          <div className="space-y-6">
            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Foreground Color</h3>
              <div
                className="w-full h-20 rounded-lg border border-slate-600 mb-4"
                style={{ backgroundColor: currentColor.hex }}
              />
              <input
                type="color"
                value={currentColor.hex}
                onChange={(e) => updateColor(e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-slate-600 cursor-pointer hover:border-slate-400 transition-colors"
              />
            </div>

            <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Background Color</h3>
              <div
                className="w-full h-20 rounded-lg border border-slate-600 mb-4"
                style={{ backgroundColor: contrastColor.hex }}
              />
              <input
                type="color"
                value={contrastColor.hex}
                onChange={(e) => {
                  const rgb = hexToRgb(e.target.value)
                  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
                  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)
                  const name = getClosestColorName(e.target.value)
                  setContrastColor({
                    hex: e.target.value.toUpperCase(),
                    rgb,
                    hsl,
                    hsv,
                    name
                  })
                }}
                className="w-full h-12 rounded-lg border-2 border-slate-600 cursor-pointer hover:border-slate-400 transition-colors"
              />
            </div>
          </div>

          {/* Contrast Results */}
          <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contrast Analysis</h3>
            
            {contrastResult && (
              <div className="space-y-4">
                {/* Preview */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: contrastColor.hex }}>
                  <div
                    className="text-lg font-semibold"
                    style={{ color: currentColor.hex }}
                  >
                    Sample Text
                  </div>
                  <div
                    className="text-sm"
                    style={{ color: currentColor.hex }}
                  >
                    This is how your text will appear
                  </div>
                </div>

                {/* Results */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">Contrast Ratio</span>
                    <span className="font-mono text-white">{contrastResult.ratio.toFixed(2)}:1</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">WCAG Rating</span>
                    <span className={`font-medium ${
                      contrastResult.rating === 'AAA' ? 'text-green-400' :
                      contrastResult.rating === 'AA' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {contrastResult.rating}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-700/30 rounded-lg">
                    <span className="text-sm text-slate-300">{contrastResult.description}</span>
                  </div>
                </div>

                {/* WCAG Guidelines */}
                <div className="mt-6">
                  <h4 className="font-medium text-white mb-3">WCAG Guidelines</h4>
                  <div className="space-y-2 text-sm text-slate-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>AAA: 7:1 or higher (excellent)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>AA: 4.5:1 or higher (good)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Fail: Below 4.5:1 (poor)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 

function CollapsibleColorValues({ currentColor, hslToHex, updateColor }: {
  currentColor: any,
  hslToHex: (h: number, s: number, l: number) => string,
  updateColor: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        className="w-full flex items-center justify-between px-4 py-2 bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 hover:bg-slate-700/60 transition-colors mb-2"
        onClick={() => setOpen((v: boolean) => !v)}
        aria-expanded={open}
      >
        <span className="font-medium">Color Values</span>
        <span className="ml-2">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="space-y-4 p-4 bg-slate-800/60 border border-slate-700/50 rounded-xl">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Red: {currentColor.rgb.r}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={currentColor.rgb.r}
              onChange={(e) => {
                const newRgb = { ...currentColor.rgb, r: parseInt(e.target.value) }
                const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Green: {currentColor.rgb.g}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={currentColor.rgb.g}
              onChange={(e) => {
                const newRgb = { ...currentColor.rgb, g: parseInt(e.target.value) }
                const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Blue: {currentColor.rgb.b}
            </label>
            <input
              type="range"
              min="0"
              max="255"
              value={currentColor.rgb.b}
              onChange={(e) => {
                const newRgb = { ...currentColor.rgb, b: parseInt(e.target.value) }
                const newHex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Hue: {currentColor.hsl.h}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={currentColor.hsl.h}
              onChange={(e) => {
                const newHsl = { ...currentColor.hsl, h: parseInt(e.target.value) }
                const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Saturation: {currentColor.hsl.s}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={currentColor.hsl.s}
              onChange={(e) => {
                const newHsl = { ...currentColor.hsl, s: parseInt(e.target.value) }
                const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Lightness: {currentColor.hsl.l}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={currentColor.hsl.l}
              onChange={(e) => {
                const newHsl = { ...currentColor.hsl, l: parseInt(e.target.value) }
                const newHex = hslToHex(newHsl.h, newHsl.s, newHsl.l)
                updateColor(newHex)
              }}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
} 