'use client'

import { useState, useCallback } from 'react'
import { Copy, Palette, RotateCcw, Download, RefreshCw, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

interface Color {
  hex: string
  rgb: string
  hsl: string
  name?: string
}

interface ColorPalette {
  id: string
  colors: Color[]
  type: 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'custom'
  timestamp: Date
}

interface ColorOptions {
  count: number
  includeNames: boolean
  format: 'hex' | 'rgb' | 'hsl' | 'all'
  paletteType: 'random' | 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'custom'
  baseColor: string
  saturation: number
  lightness: number
  generateGradient: boolean
  gradientSteps: number
}

const defaultOptions: ColorOptions = {
  count: 5,
  includeNames: true,
  format: 'hex',
  paletteType: 'random',
  baseColor: '#FF6B6B',
  saturation: 70,
  lightness: 50,
  generateGradient: false,
  gradientSteps: 5
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

export function ColorGenerator() {
  const [options, setOptions] = useState<ColorOptions>(defaultOptions)
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [customColors, setCustomColors] = useState<string[]>(['#FF6B6B', '#4ECDC4', '#45B7D1'])

  const hexToRgb = useCallback((hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16)
      const g = parseInt(result[2], 16)
      const b = parseInt(result[3], 16)
      return `rgb(${r}, ${g}, ${b})`
    }
    return 'rgb(0, 0, 0)'
  }, [])

  const hexToHsl = useCallback((hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    if (result) {
      const r = parseInt(result[1], 16) / 255
      const g = parseInt(result[2], 16) / 255
      const b = parseInt(result[3], 16) / 255

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

      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
    }
    return 'hsl(0, 0%, 0%)'
  }, [])

  const getClosestColorName = useCallback((hex: string): string | undefined => {
    if (!options.includeNames) return undefined
    
    // Find the closest color name by comparing hex values
    const hexUpper = hex.toUpperCase()
    if (colorNames[hexUpper]) {
      return colorNames[hexUpper]
    }
    
    // If no exact match, find the closest one
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
  }, [options.includeNames])

  const generateRandomColor = useCallback((): Color => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    return {
      hex: hex.toUpperCase(),
      rgb: hexToRgb(hex),
      hsl: hexToHsl(hex),
      name: getClosestColorName(hex)
    }
  }, [hexToRgb, hexToHsl, getClosestColorName])

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

  const generateMonochromaticPalette = useCallback((baseColor: Color): Color[] => {
    const colors: Color[] = [baseColor]
    const hsl = hexToHsl(baseColor.hex)
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
    
    if (match) {
      const h = parseInt(match[1])
      const s = options.saturation
      const l = options.lightness
      
      // Generate variations by adjusting lightness
      for (let i = 1; i < options.count; i++) {
        const newL = Math.max(10, Math.min(90, l + (i - 2) * 20))
        const newHsl = `hsl(${h}, ${s}%, ${newL}%)`
        const newHex = hslToHex(h, s, newL)
        colors.push({
          hex: newHex,
          rgb: hexToRgb(newHex),
          hsl: newHsl,
          name: getClosestColorName(newHex)
        })
      }
    }
    
    return colors.slice(0, options.count)
  }, [options.count, options.saturation, options.lightness, hexToRgb, hexToHsl, hslToHex, getClosestColorName])

  const addCustomColor = useCallback(() => {
    const newColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    setCustomColors(prev => [...prev, newColor])
  }, [])

  const removeCustomColor = useCallback((index: number) => {
    setCustomColors(prev => prev.filter((_, i) => i !== index))
  }, [])

  const updateCustomColor = useCallback((index: number, color: string) => {
    setCustomColors(prev => prev.map((c, i) => i === index ? color : c))
  }, [])

  const generateGradient = useCallback((startColor: string, endColor: string, steps: number): Color[] => {
    const colors: Color[] = []
    
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1)
      const hex = interpolateColor(startColor, endColor, ratio)
      colors.push({
        hex: hex.toUpperCase(),
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex),
        name: getClosestColorName(hex)
      })
    }
    
    return colors
  }, [hexToRgb, hexToHsl, getClosestColorName])

  const interpolateColor = useCallback((color1: string, color2: string, ratio: number): string => {
    const r1 = parseInt(color1.slice(1, 3), 16)
    const g1 = parseInt(color1.slice(3, 5), 16)
    const b1 = parseInt(color1.slice(5, 7), 16)
    
    const r2 = parseInt(color2.slice(1, 3), 16)
    const g2 = parseInt(color2.slice(3, 5), 16)
    const b2 = parseInt(color2.slice(5, 7), 16)
    
    const r = Math.round(r1 + (r2 - r1) * ratio)
    const g = Math.round(g1 + (g2 - g1) * ratio)
    const b = Math.round(b1 + (b2 - b1) * ratio)
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  }, [])

  const generatePalette = useCallback(() => {
    let colors: Color[] = []

    if (options.paletteType === 'custom') {
      colors = customColors.map(hex => ({
        hex: hex.toUpperCase(),
        rgb: hexToRgb(hex),
        hsl: hexToHsl(hex),
        name: getClosestColorName(hex)
      }))
    } else if (options.generateGradient && customColors.length >= 2) {
      colors = generateGradient(customColors[0], customColors[customColors.length - 1], options.gradientSteps)
    } else {
      const baseColor = options.paletteType !== 'random' ? {
        hex: options.baseColor.toUpperCase(),
        rgb: hexToRgb(options.baseColor),
        hsl: hexToHsl(options.baseColor),
        name: getClosestColorName(options.baseColor)
      } : generateRandomColor()

      switch (options.paletteType) {
        case 'random':
          colors = Array.from({ length: options.count }, () => generateRandomColor())
          break
        case 'monochromatic':
          colors = generateMonochromaticPalette(baseColor)
          break
        case 'analogous':
          const hsl = hexToHsl(baseColor.hex)
          const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
          if (match) {
            const h = parseInt(match[1])
            const s = options.saturation
            const l = options.lightness
            colors = [baseColor]
            for (let i = 1; i < options.count; i++) {
              const newH = (h + i * 30) % 360
              const newHex = hslToHex(newH, s, l)
              colors.push({
                hex: newHex,
                rgb: hexToRgb(newHex),
                hsl: `hsl(${newH}, ${s}%, ${l}%)`,
                name: getClosestColorName(newHex)
              })
            }
          }
          break
        case 'complementary':
          const hsl2 = hexToHsl(baseColor.hex)
          const match2 = hsl2.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
          if (match2) {
            const h = parseInt(match2[1])
            const s = options.saturation
            const l = options.lightness
            colors = [baseColor]
            for (let i = 1; i < options.count; i++) {
              const newH = (h + i * 180) % 360
              const newHex = hslToHex(newH, s, l)
              colors.push({
                hex: newHex,
                rgb: hexToRgb(newHex),
                hsl: `hsl(${newH}, ${s}%, ${l}%)`,
                name: getClosestColorName(newHex)
              })
            }
          }
          break
        case 'triadic':
          const hsl3 = hexToHsl(baseColor.hex)
          const match3 = hsl3.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
          if (match3) {
            const h = parseInt(match3[1])
            const s = options.saturation
            const l = options.lightness
            colors = [baseColor]
            for (let i = 1; i < options.count; i++) {
              const newH = (h + i * 120) % 360
              const newHex = hslToHex(newH, s, l)
              colors.push({
                hex: newHex,
                rgb: hexToRgb(newHex),
                hsl: `hsl(${newH}, ${s}%, ${l}%)`,
                name: getClosestColorName(newHex)
              })
            }
          }
          break
        case 'tetradic':
          const hsl4 = hexToHsl(baseColor.hex)
          const match4 = hsl4.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
          if (match4) {
            const h = parseInt(match4[1])
            const s = options.saturation
            const l = options.lightness
            colors = [baseColor]
            for (let i = 1; i < options.count; i++) {
              const newH = (h + i * 90) % 360
              const newHex = hslToHex(newH, s, l)
              colors.push({
                hex: newHex,
                rgb: hexToRgb(newHex),
                hsl: `hsl(${newH}, ${s}%, ${l}%)`,
                name: getClosestColorName(newHex)
              })
            }
          }
          break
      }
    }

    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      colors: colors.slice(0, options.count),
      type: options.paletteType,
      timestamp: new Date()
    }

    setPalettes(prev => [newPalette, ...prev.slice(0, 4)])
  }, [options, customColors, generateRandomColor, generateMonochromaticPalette, generateGradient, hexToRgb, hexToHsl, hslToHex, getClosestColorName])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [])

  const copyPalette = useCallback(async (palette: ColorPalette) => {
    const format = options.format
    let text = ''
    
    palette.colors.forEach(color => {
      switch (format) {
        case 'hex':
          text += color.hex + '\n'
          break
        case 'rgb':
          text += color.rgb + '\n'
          break
        case 'hsl':
          text += color.hsl + '\n'
          break
        case 'all':
          text += `${color.hex} ${color.rgb} ${color.hsl}\n`
          break
      }
    })
    
    await copyToClipboard(text.trim())
  }, [options.format, copyToClipboard])

  const clearAll = useCallback(() => {
    setPalettes([])
    setCopied(null)
  }, [])

  const updateOption = useCallback((key: keyof ColorOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const getFormatText = useCallback((color: Color) => {
    switch (options.format) {
      case 'hex':
        return color.hex
      case 'rgb':
        return color.rgb
      case 'hsl':
        return color.hsl
      case 'all':
        return `${color.hex} ${color.rgb} ${color.hsl}`
      default:
        return color.hex
    }
  }, [options.format])

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Color Generator</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Color Generator</h1>
            <p className="text-slate-300">Generate random colors, palettes, and gradients</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={generatePalette}
            className="btn-primary flex items-center space-x-2"
          >
            <Palette className="w-4 h-4" />
            <span>Generate Palette</span>
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
        <h3 className="text-lg font-semibold text-white mb-4">Generation Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Palette Type
            </label>
            <select
              value={options.paletteType}
              onChange={(e) => updateOption('paletteType', e.target.value)}
              className="form-input w-full"
            >
              <option value="random">Random</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
              <option value="custom">Custom Colors</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Color Count: {options.count}
            </label>
            <input
              type="range"
              min="2"
              max="12"
              value={options.count}
              onChange={(e) => updateOption('count', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>2</span>
              <span>12</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Output Format
            </label>
            <select
              value={options.format}
              onChange={(e) => updateOption('format', e.target.value)}
              className="form-input w-full"
            >
              <option value="hex">Hexadecimal</option>
              <option value="rgb">RGB</option>
              <option value="hsl">HSL</option>
              <option value="all">All Formats</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="includeNames"
              checked={options.includeNames}
              onChange={(e) => updateOption('includeNames', e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="includeNames" className="ml-2 text-sm text-slate-300">
              Include color names
            </label>
          </div>
        </div>

        {/* Base Color Picker */}
        {options.paletteType !== 'random' && options.paletteType !== 'custom' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Base Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={options.baseColor}
                onChange={(e) => updateOption('baseColor', e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer hover:border-slate-400 transition-colors"
              />
              <input
                type="text"
                value={options.baseColor}
                onChange={(e) => updateOption('baseColor', e.target.value)}
                className="form-input flex-1 font-mono"
                placeholder="#FF6B6B"
              />
            </div>
          </div>
        )}

        {/* HSL Controls */}
        {options.paletteType !== 'random' && options.paletteType !== 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Saturation: {options.saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={options.saturation}
                onChange={(e) => updateOption('saturation', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Lightness: {options.lightness}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={options.lightness}
                onChange={(e) => updateOption('lightness', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Custom Colors Section */}
        {options.paletteType === 'custom' && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-slate-300">
                Custom Colors
              </label>
              <button
                onClick={addCustomColor}
                className="btn-ghost text-sm flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add Color</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {customColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-slate-700/30 rounded-lg min-w-0">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateCustomColor(index, e.target.value)}
                    className="w-10 h-10 rounded-lg border-2 border-slate-600 cursor-pointer hover:border-slate-400 transition-colors flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateCustomColor(index, e.target.value)}
                    className="form-input w-20 text-xs font-mono flex-shrink-0"
                  />
                  <button
                    onClick={() => removeCustomColor(index)}
                    className="btn-ghost text-red-400 hover:text-red-300 p-1 flex-shrink-0"
                    disabled={customColors.length <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gradient Options */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              id="generateGradient"
              checked={options.generateGradient}
              onChange={(e) => updateOption('generateGradient', e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="generateGradient" className="text-sm text-slate-300">
              Generate gradient between custom colors
            </label>
          </div>
          {options.generateGradient && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Gradient Steps: {options.gradientSteps}
              </label>
              <input
                type="range"
                min="3"
                max="20"
                value={options.gradientSteps}
                onChange={(e) => updateOption('gradientSteps', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {palettes.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Generated Palettes ({palettes.length})
            </h3>
          </div>

          <div className="space-y-6">
            {palettes.map((palette) => (
              <div
                key={palette.id}
                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-pink-500/20 w-3 h-3 rounded-full"></div>
                    <span className="text-sm font-medium text-pink-400 capitalize">
                      {palette.type} Palette
                    </span>
                  </div>
                  <button
                    onClick={() => copyPalette(palette)}
                    className="btn-ghost text-sm"
                    title="Copy palette"
                  >
                    {copied === palette.id ? (
                      <span className="text-green-400">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {palette.colors.map((color, index) => (
                    <div
                      key={index}
                      className="group relative"
                    >
                      <div
                        className={`w-full h-20 rounded-lg border border-slate-600 cursor-pointer transition-all duration-200 hover:scale-105 relative ${
                          copied === getFormatText(color) ? 'ring-2 ring-green-400 ring-opacity-75' : ''
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyToClipboard(getFormatText(color))}
                        title={`Click to copy ${getFormatText(color)}`}
                      >
                        {copied === getFormatText(color) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                            <span className="text-white text-sm font-medium">Copied!</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-xs font-mono text-slate-300 group-hover:text-white transition-colors">
                          {getFormatText(color)}
                        </div>
                        {color.name && (
                          <div className="text-xs text-slate-400 mt-1">
                            {color.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-xs text-slate-400">
                  Generated {new Date(palette.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">🎨 Color Theory Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Palette Types</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong>Random:</strong> Completely random colors</li>
              <li>• <strong>Monochromatic:</strong> Same hue, different lightness</li>
              <li>• <strong>Analogous:</strong> Colors next to each other on the color wheel</li>
              <li>• <strong>Complementary:</strong> Colors opposite on the color wheel</li>
              <li>• <strong>Triadic:</strong> Three colors equally spaced on the wheel</li>
              <li>• <strong>Tetradic:</strong> Four colors forming a rectangle</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Color Formats</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong>HEX:</strong> #FF0000 (web standard)</li>
              <li>• <strong>RGB:</strong> rgb(255, 0, 0) (red, green, blue)</li>
              <li>• <strong>HSL:</strong> hsl(0, 100%, 50%) (hue, saturation, lightness)</li>
              <li>• <strong>All:</strong> All three formats together</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 