'use client'

import { useState, useRef, useCallback } from 'react'
import { Download, Upload, Settings, RotateCcw, AlertCircle, FileImage, Globe, Zap, Play } from 'lucide-react'
import Link from 'next/link'

interface OptimizeOptions {
  quality: number
  maxWidth: number
  maxHeight: number
  autoFormat: boolean
  enableResize: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface OptimizedImage {
  id: string
  originalName: string
  originalImage: string
  optimizedImage: string
  originalFormat: string
  optimizedFormat: string
  originalSize: number
  optimizedSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
}

const formatPriority = ['webp', 'avif', 'jpeg', 'png']

function getBestFormat(): 'webp' | 'avif' | 'jpeg' | 'png' {
  // Check browser support for AVIF and WebP
  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas')
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) return 'avif'
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) return 'webp'
  }
  return 'jpeg'
}

export function WebImageOptimizer() {
  const [optimizedImages, setOptimizedImages] = useState<OptimizedImage[]>([])
  const [options, setOptions] = useState<OptimizeOptions>({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    autoFormat: true,
    enableResize: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasError: false,
    isSuccess: false
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileSelect = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'))
    if (fileArray.length === 0) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'Please select valid image files.'
      })
      return
    }
    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })
    try {
      const newOptimizedImages: OptimizedImage[] = []
      for (const file of fileArray) {
        const optimized = await optimizeImage(file)
        if (optimized) newOptimizedImages.push(optimized)
      }
      setOptimizedImages(prev => [...prev, ...newOptimizedImages])
      setProcessingState({ isProcessing: false, hasError: false, isSuccess: true })
      setTimeout(() => setProcessingState(prev => ({ ...prev, isSuccess: false })), 3000)
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to optimize images'
      })
    }
  }, [options])

  const optimizeImage = async (file: File): Promise<OptimizedImage | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const img = new window.Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) return resolve(null)
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(null)
          let { width, height } = img
          if (options.enableResize) {
            const scale = Math.min(options.maxWidth / width, options.maxHeight / height, 1)
            width = Math.round(width * scale)
            height = Math.round(height * scale)
          }
          canvas.width = width
          canvas.height = height
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)
          let format: 'webp' | 'avif' | 'jpeg' | 'png' = 'jpeg'
          if (options.autoFormat) {
            format = getBestFormat()
          } else {
            format = file.type.split('/')[1] as any || 'jpeg'
          }
          let mimeType = `image/${format}`
          let dataUrl = canvas.toDataURL(mimeType, options.quality)
          // fallback if browser doesn't support AVIF
          if (format === 'avif' && !dataUrl.startsWith('data:image/avif')) {
            format = 'webp'
            mimeType = 'image/webp'
            dataUrl = canvas.toDataURL(mimeType, options.quality)
          }
          const originalSize = file.size
          const optimizedSize = Math.round((dataUrl.length - 22) * 3 / 4)
          const compressionRatio = Math.round((1 - optimizedSize / originalSize) * 100)
          resolve({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            originalName: file.name,
            originalImage: result,
            optimizedImage: dataUrl,
            originalFormat: file.type.split('/')[1] || 'unknown',
            optimizedFormat: format,
            originalSize,
            optimizedSize,
            compressionRatio,
            dimensions: { width, height }
          })
        }
        img.onerror = () => resolve(null)
        img.src = result
      }
      reader.readAsDataURL(file)
    })
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadImage = (img: OptimizedImage) => {
    const link = document.createElement('a')
    const ext = img.optimizedFormat === 'jpeg' ? 'jpg' : img.optimizedFormat
    link.download = img.originalName.replace(/\.[^/.]+$/, `.${ext}`)
    link.href = img.optimizedImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAll = () => {
    optimizedImages.forEach((img, idx) => setTimeout(() => downloadImage(img), idx * 100))
  }

  const clearAll = () => {
    setOptimizedImages([])
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) handleFileSelect(files)
  }
  const triggerFileInput = () => fileInputRef.current?.click()

  // Stats
  const totalOriginal = optimizedImages.reduce((sum, img) => sum + img.originalSize, 0)
  const totalOptimized = optimizedImages.reduce((sum, img) => sum + img.optimizedSize, 0)
  const avgCompression = optimizedImages.length > 0 ? Math.round(optimizedImages.reduce((sum, img) => sum + img.compressionRatio, 0) / optimizedImages.length) : 0

  return (
    <div className="max-w-4xl mx-auto">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/image-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Image Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Web Image Optimizer</span>
      </nav>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Web Image Optimizer</h1>
            <p className="text-slate-300">Optimize images for web with automatic format selection and smart compression</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={triggerFileInput} className="btn-ghost flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`btn-ghost flex items-center space-x-2 ${showSettings ? 'bg-slate-700/50' : ''}`}>
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          {optimizedImages.length > 1 && (
            <button onClick={downloadAll} className="btn-primary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          )}
          <button onClick={clearAll} className="btn-ghost flex items-center space-x-2 text-red-300 hover:text-red-200">
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>
      {processingState.hasError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Error:</span>
            <span>{processingState.errorMessage}</span>
          </div>
        </div>
      )}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Optimization Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Quality ({Math.round(options.quality * 100)}%)</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={options.quality}
                onChange={e => setOptions({ ...options, quality: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_resize"
                checked={options.enableResize}
                onChange={e => setOptions({ ...options, enableResize: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="enable_resize" className="ml-2 text-sm text-slate-300">Resize images</label>
            </div>
            {options.enableResize && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Width (px)</label>
                  <input
                    type="number"
                    value={options.maxWidth}
                    onChange={e => setOptions({ ...options, maxWidth: Number(e.target.value) })}
                    className="form-input w-full"
                    min="100"
                    max="4000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Max Height (px)</label>
                  <input
                    type="number"
                    value={options.maxHeight}
                    onChange={e => setOptions({ ...options, maxHeight: Number(e.target.value) })}
                    className="form-input w-full"
                    min="100"
                    max="4000"
                  />
                </div>
              </>
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="auto_format"
                checked={options.autoFormat}
                onChange={e => setOptions({ ...options, autoFormat: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="auto_format" className="ml-2 text-sm text-slate-300">Auto-select best format</label>
            </div>
          </div>
          {optimizedImages.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={() => handleFileSelect(new DataTransfer().files)}
                className="btn-primary flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Reprocess</span>
              </button>
            </div>
          )}
        </div>
      )}
      {optimizedImages.length > 0 && (
        <div className="mb-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Batch Optimization Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{optimizedImages.length}</p>
              <p className="text-sm text-slate-400">Images Optimized</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{formatFileSize(totalOriginal)}</p>
              <p className="text-sm text-slate-400">Original Total Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{formatFileSize(totalOptimized)}</p>
              <p className="text-sm text-slate-400">Optimized Total Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{avgCompression}%</p>
              <p className="text-sm text-slate-400">Avg. Compression</p>
            </div>
          </div>
        </div>
      )}
      {optimizedImages.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-blue-500/20 p-4 rounded-full">
              <FileImage className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragging ? 'Drop your images here' : 'Upload images to optimize for web'}
              </h3>
              <p className="text-slate-400 mb-4">Drag and drop multiple image files, or click to browse</p>
              <button onClick={triggerFileInput} className="btn-secondary">Choose Images</button>
            </div>
            <p className="text-xs text-slate-500">Supports: JPG, PNG, GIF, BMP • Batch processing available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {optimizedImages.map(img => (
              <div key={img.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white truncate mr-2">{img.originalName}</h4>
                  <button onClick={() => setOptimizedImages(prev => prev.filter(i => i.id !== img.id))} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <img src={img.originalImage} alt="Original" className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2" />
                    <p className="text-xs text-slate-400">Original ({img.originalFormat})</p>
                    <p className="text-xs text-slate-500">{formatFileSize(img.originalSize)}</p>
                  </div>
                  <div className="text-center">
                    <img src={img.optimizedImage} alt="Optimized" className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2" />
                    <p className="text-xs text-green-400">{img.optimizedFormat.toUpperCase()}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(img.optimizedSize)}</p>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Size reduction:</span>
                      <span className={`ml-1 font-medium ${img.compressionRatio > 0 ? 'text-green-400' : 'text-red-400'}`}>{img.compressionRatio > 0 ? '-' : '+'}{Math.abs(img.compressionRatio)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="ml-1 text-white">{img.dimensions.width}×{img.dimensions.height}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => downloadImage(img)} className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            ))}
          </div>
          {processingState.isProcessing && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-3 text-white">
                <div className="loading-spinner w-6 h-6" />
                <span>Optimizing images...</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Web Image Optimization Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Why Optimize?</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Faster page loads and better user experience</li>
              <li>• Improved SEO and Core Web Vitals</li>
              <li>• Reduced bandwidth and hosting costs</li>
              <li>• Modern formats (WebP/AVIF) offer best compression</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Best Practices</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use <strong>WebP</strong> or <strong>AVIF</strong> for most images</li>
              <li>• Resize large images to fit display size</li>
              <li>• Use quality 70-90% for balance of size and clarity</li>
              <li>• Batch process images for consistency</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium">Pro Tip:</p>
              <p className="text-slate-300 text-sm">
                Use <strong>auto-select best format</strong> for maximum compatibility and performance. AVIF is best if supported, otherwise WebP is a great choice for the web.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 