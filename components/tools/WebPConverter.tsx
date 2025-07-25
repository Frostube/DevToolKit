'use client'

import { useState, useRef, useCallback } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileImage, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

interface ConversionOptions {
  quality: number
  lossless: boolean
  removeMetadata: boolean
  preserveTransparency: boolean
  resizeWidth?: number
  resizeHeight?: number
  enableResize: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface ImageInfo {
  originalFormat: string
  originalSize: number
  webpSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
  hasTransparency: boolean
  metadata: boolean
}

interface ProcessedImage {
  id: string
  originalName: string
  originalImage: string
  webpImage: string
  info: ImageInfo
}

export function WebPConverter() {
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([])
  const [options, setOptions] = useState<ConversionOptions>({
    quality: 0.8,
    lossless: false,
    removeMetadata: true,
    preserveTransparency: true,
    enableResize: false,
    resizeWidth: 800,
    resizeHeight: 600
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

    // Check total file size (max 50MB total)
    const totalSize = fileArray.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > 50 * 1024 * 1024) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'Total file size should be less than 50MB'
      })
      return
    }

    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })

    try {
      const newProcessedImages: ProcessedImage[] = []

      for (const file of fileArray) {
        const processedImage = await processImageToWebP(file)
        if (processedImage) {
          newProcessedImages.push(processedImage)
        }
      }

      setProcessedImages(prev => [...prev, ...newProcessedImages])
      setProcessingState({
        isProcessing: false,
        hasError: false,
        isSuccess: true
      })

      setTimeout(() => {
        setProcessingState(prev => ({ ...prev, isSuccess: false }))
      }, 3000)

    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to process images'
      })
    }
  }, [options])

  const processImageToWebP = async (file: File): Promise<ProcessedImage | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        
        const img = new Image()
        img.onload = () => {
          const canvas = canvasRef.current
          if (!canvas) {
            resolve(null)
            return
          }

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            resolve(null)
            return
          }

          // Calculate dimensions
          let { width, height } = img
          if (options.enableResize && options.resizeWidth && options.resizeHeight) {
            const aspectRatio = img.width / img.height
            const targetAspectRatio = options.resizeWidth / options.resizeHeight
            
            if (aspectRatio > targetAspectRatio) {
              width = options.resizeWidth
              height = options.resizeWidth / aspectRatio
            } else {
              height = options.resizeHeight
              width = options.resizeHeight * aspectRatio
            }
          }

          canvas.width = width
          canvas.height = height

          // Apply image smoothing for better quality
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height)

          // Detect transparency
          const imageData = ctx.getImageData(0, 0, width, height)
          const hasTransparency = detectTransparency(imageData)

          // Convert to WebP
          const quality = options.lossless ? undefined : options.quality
          const webpDataURL = canvas.toDataURL('image/webp', quality)

          // Calculate compression info
          const originalSize = file.size
          const webpSize = Math.round((webpDataURL.length - 22) * 3 / 4)
          const compressionRatio = Math.round((1 - webpSize / originalSize) * 100)

          const originalFormat = file.type.split('/')[1] || 'unknown'

          const processedImage: ProcessedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            originalName: file.name,
            originalImage: result,
            webpImage: webpDataURL,
            info: {
              originalFormat: originalFormat.toUpperCase(),
              originalSize,
              webpSize,
              compressionRatio,
              dimensions: { width: Math.round(width), height: Math.round(height) },
              hasTransparency,
              metadata: !options.removeMetadata
            }
          }

          resolve(processedImage)
        }

        img.onerror = () => resolve(null)
        img.src = result
      }
      reader.readAsDataURL(file)
    })
  }

  const detectTransparency = (imageData: ImageData): boolean => {
    const data = imageData.data
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 255) {
        return true
      }
    }
    return false
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadImage = (processedImage: ProcessedImage) => {
    const link = document.createElement('a')
    const fileName = processedImage.originalName.replace(/\.[^/.]+$/, '.webp')
    link.download = fileName
    link.href = processedImage.webpImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAll = () => {
    processedImages.forEach((image, index) => {
      setTimeout(() => downloadImage(image), index * 100) // Stagger downloads
    })
  }

  const removeImage = (id: string) => {
    setProcessedImages(prev => prev.filter(img => img.id !== id))
  }

  const clearAll = () => {
    setProcessedImages([])
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
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getTotalStats = () => {
    const totalOriginal = processedImages.reduce((sum, img) => sum + img.info.originalSize, 0)
    const totalWebP = processedImages.reduce((sum, img) => sum + img.info.webpSize, 0)
    const averageCompression = processedImages.length > 0 
      ? Math.round(processedImages.reduce((sum, img) => sum + img.info.compressionRatio, 0) / processedImages.length)
      : 0

    return { totalOriginal, totalWebP, averageCompression }
  }

  const stats = getTotalStats()

  const reprocessWithNewSettings = async () => {
    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })
    try {
      const newProcessedImages: ProcessedImage[] = []
      for (const image of processedImages) {
        const processedImage = await processImageToWebP(image.originalImage as File) // Use originalImage as File
        if (processedImage) {
          newProcessedImages.push(processedImage)
        }
      }
      setProcessedImages(newProcessedImages)
      setProcessingState({
        isProcessing: false,
        hasError: false,
        isSuccess: true
      })
      setTimeout(() => {
        setProcessingState(prev => ({ ...prev, isSuccess: false }))
      }, 3000)
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to reprocess images'
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />

      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/image-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Image Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">WebP Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">WebP Converter</h1>
            <p className="text-slate-300">Convert images to WebP format for better web performance</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={triggerFileInput}
            className="btn-ghost flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`btn-ghost flex items-center space-x-2 ${showSettings ? 'bg-slate-700/50' : ''}`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          {processedImages.length > 1 && (
            <button 
              onClick={downloadAll}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download All</span>
            </button>
          )}
          <button 
            onClick={clearAll}
            className="btn-ghost flex items-center space-x-2 text-red-300 hover:text-red-200"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {processingState.hasError && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Error:</span>
            <span>{processingState.errorMessage}</span>
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">WebP Conversion Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quality ({Math.round(options.quality * 100)}%)
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={options.quality}
                onChange={(e) => setOptions({ ...options, quality: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                disabled={options.lossless}
              />
              <p className="text-xs text-slate-500 mt-1">
                {options.lossless ? 'Quality setting disabled in lossless mode' : 'Higher quality = larger file size'}
              </p>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="lossless"
                checked={options.lossless}
                onChange={(e) => setOptions({ ...options, lossless: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="lossless" className="ml-2 text-sm text-slate-300">
                Lossless compression
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remove_metadata"
                checked={options.removeMetadata}
                onChange={(e) => setOptions({ ...options, removeMetadata: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="remove_metadata" className="ml-2 text-sm text-slate-300">
                Remove metadata
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="preserve_transparency"
                checked={options.preserveTransparency}
                onChange={(e) => setOptions({ ...options, preserveTransparency: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="preserve_transparency" className="ml-2 text-sm text-slate-300">
                Preserve transparency
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_resize"
                checked={options.enableResize}
                onChange={(e) => setOptions({ ...options, enableResize: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="enable_resize" className="ml-2 text-sm text-slate-300">
                Resize images
              </label>
            </div>

            {options.enableResize && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Width (px)
                  </label>
                  <input
                    type="number"
                    value={options.resizeWidth}
                    onChange={(e) => setOptions({ ...options, resizeWidth: Number(e.target.value) })}
                    className="form-input w-full"
                    min="100"
                    max="4000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Max Height (px)
                  </label>
                  <input
                    type="number"
                    value={options.resizeHeight}
                    onChange={(e) => setOptions({ ...options, resizeHeight: Number(e.target.value) })}
                    className="form-input w-full"
                    min="100"
                    max="4000"
                  />
                </div>
              </>
            )}
          </div>
          {processedImages.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={reprocessWithNewSettings}
                className="btn-primary flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Reprocess</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Batch Stats */}
      {processedImages.length > 0 && (
        <div className="mb-8 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Batch Conversion Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">{processedImages.length}</p>
              <p className="text-sm text-slate-400">Images Converted</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">{formatFileSize(stats.totalOriginal)}</p>
              <p className="text-sm text-slate-400">Original Total Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{formatFileSize(stats.totalWebP)}</p>
              <p className="text-sm text-slate-400">WebP Total Size</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">{stats.averageCompression}%</p>
              <p className="text-sm text-slate-400">Average Compression</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {processedImages.length === 0 ? (
        // Upload Area
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-green-400 bg-green-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-green-500/20 p-4 rounded-full">
              <FileImage className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragging ? 'Drop your images here' : 'Upload images to convert to WebP'}
              </h3>
              <p className="text-slate-400 mb-4">
                Drag and drop multiple image files, or click to browse
              </p>
              <button
                onClick={triggerFileInput}
                className="btn-secondary"
              >
                Choose Images
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Supports: JPG, PNG, GIF, BMP • Max total size: 50MB • Batch processing available
            </p>
          </div>
        </div>
      ) : (
        // Results Grid
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedImages.map((processedImage) => (
              <div key={processedImage.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white truncate mr-2">{processedImage.originalName}</h4>
                  <button
                    onClick={() => removeImage(processedImage.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Original */}
                  <div className="text-center">
                    <img
                      src={processedImage.originalImage}
                      alt="Original"
                      className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2"
                    />
                    <p className="text-xs text-slate-400">Original ({processedImage.info.originalFormat})</p>
                    <p className="text-xs text-slate-500">{formatFileSize(processedImage.info.originalSize)}</p>
                  </div>

                  {/* WebP */}
                  <div className="text-center">
                    <img
                      src={processedImage.webpImage}
                      alt="WebP"
                      className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2"
                    />
                    <p className="text-xs text-green-400">WebP</p>
                    <p className="text-xs text-slate-500">{formatFileSize(processedImage.info.webpSize)}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400">Size reduction:</span>
                      <span className={`ml-1 font-medium ${processedImage.info.compressionRatio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {processedImage.info.compressionRatio > 0 ? '-' : '+'}{Math.abs(processedImage.info.compressionRatio)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">Dimensions:</span>
                      <span className="ml-1 text-white">{processedImage.info.dimensions.width}×{processedImage.info.dimensions.height}</span>
                    </div>
                    {processedImage.info.hasTransparency && (
                      <div className="col-span-2">
                        <span className="text-blue-400 text-xs">• Contains transparency</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadImage(processedImage)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WebP</span>
                </button>
              </div>
            ))}
          </div>

          {/* Processing Indicator */}
          {processingState.isProcessing && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-center space-x-3 text-white">
                <div className="loading-spinner w-6 h-6" />
                <span>Converting images to WebP...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Why WebP?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Performance Benefits</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• 25-35% smaller than JPEG</li>
              <li>• 26% smaller than PNG</li>
              <li>• Faster page load times</li>
              <li>• Better user experience</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Features</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Supports transparency (like PNG)</li>
              <li>• Animation support (like GIF)</li>
              <li>• Both lossy and lossless compression</li>
              <li>• Excellent browser support (94%+)</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Globe className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-medium">Pro Tip:</p>
              <p className="text-slate-300 text-sm">
                Use WebP for web images to improve Core Web Vitals and SEO rankings. 
                Modern browsers support WebP, and you can provide fallbacks for older browsers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 