'use client'

import { useState, useRef, useCallback } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileImage, Maximize, Archive } from 'lucide-react'
import Link from 'next/link'

interface CompressionOptions {
  quality: number
  format: 'jpeg' | 'png' | 'webp'
  maxWidth: number
  maxHeight: number
  maintainAspectRatio: boolean
  removeExif: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface ImageInfo {
  originalSize: number
  compressedSize: number
  compressionRatio: number
  originalDimensions: { width: number; height: number }
  compressedDimensions: { width: number; height: number }
  format: string
}

export function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [compressedImage, setCompressedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [options, setOptions] = useState<CompressionOptions>({
    quality: 0.8,
    format: 'jpeg',
    maxWidth: 1920,
    maxHeight: 1080,
    maintainAspectRatio: true,
    removeExif: true
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

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'Please select a valid image file.'
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setOriginalImage(result)
      processImage(result, file)
    }
    reader.readAsDataURL(file)
  }, [])

  const processImage = async (imageSrc: string, originalFile: File) => {
    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Calculate new dimensions
        let { width, height } = calculateDimensions(img.width, img.height)

        canvas.width = width
        canvas.height = height

        // Apply image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to compressed format
        const mimeType = `image/${options.format}`
        const compressedDataURL = canvas.toDataURL(mimeType, options.quality)
        
        setCompressedImage(compressedDataURL)

        // Calculate compression info
        const originalSize = originalFile.size
        const compressedSize = Math.round((compressedDataURL.length - 22) * 3 / 4) // Rough estimate
        const compressionRatio = Math.round((1 - compressedSize / originalSize) * 100)

        setImageInfo({
          originalSize,
          compressedSize,
          compressionRatio,
          originalDimensions: { width: img.width, height: img.height },
          compressedDimensions: { width, height },
          format: options.format
        })

        setProcessingState({
          isProcessing: false,
          hasError: false,
          isSuccess: true
        })

        setTimeout(() => {
          setProcessingState(prev => ({ ...prev, isSuccess: false }))
        }, 3000)
      }

      img.onerror = () => {
        setProcessingState({
          isProcessing: false,
          hasError: true,
          isSuccess: false,
          errorMessage: 'Failed to load image. Please try a different file.'
        })
      }

      img.src = imageSrc
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to process image'
      })
    }
  }

  const calculateDimensions = (originalWidth: number, originalHeight: number) => {
    if (!options.maintainAspectRatio) {
      return {
        width: Math.min(originalWidth, options.maxWidth),
        height: Math.min(originalHeight, options.maxHeight)
      }
    }

    const aspectRatio = originalWidth / originalHeight
    let width = originalWidth
    let height = originalHeight

    if (width > options.maxWidth) {
      width = options.maxWidth
      height = width / aspectRatio
    }

    if (height > options.maxHeight) {
      height = options.maxHeight
      width = height * aspectRatio
    }

    return { width: Math.round(width), height: Math.round(height) }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadCompressedImage = () => {
    if (!compressedImage || !imageInfo) return

    const link = document.createElement('a')
    link.download = `compressed-image.${imageInfo.format}`
    link.href = compressedImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearAll = () => {
    setOriginalImage(null)
    setCompressedImage(null)
    setImageInfo(null)
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const recompressWithNewSettings = () => {
    if (originalImage) {
      // Re-process with current settings
      const img = new Image()
      img.onload = () => processImage(originalImage, new File([], 'image'))
      img.src = originalImage
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
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        style={{ display: 'none' }}
      />

      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/image-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Image Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Image Compressor</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
            <Archive className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Image Compressor</h1>
            <p className="text-slate-300">Compress images to reduce file size while maintaining quality</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={triggerFileInput}
            className="btn-primary flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
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
          <h3 className="text-lg font-semibold text-white mb-4">Compression Options</h3>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Output Format
              </label>
              <select
                value={options.format}
                onChange={(e) => setOptions({ ...options, format: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Max Width (px)
              </label>
              <input
                type="number"
                value={options.maxWidth}
                onChange={(e) => setOptions({ ...options, maxWidth: Number(e.target.value) })}
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
                value={options.maxHeight}
                onChange={(e) => setOptions({ ...options, maxHeight: Number(e.target.value) })}
                className="form-input w-full"
                min="100"
                max="4000"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="maintainAspectRatio"
                checked={options.maintainAspectRatio}
                onChange={(e) => setOptions({ ...options, maintainAspectRatio: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="maintainAspectRatio" className="text-sm text-slate-300">
                Maintain aspect ratio
              </label>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300">Apply new settings</span>
              <button
                onClick={recompressWithNewSettings}
                disabled={!originalImage}
                className="btn-secondary text-sm"
              >
                Recompress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {processingState.hasError && (
        <div className="error-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error processing image</p>
            <p className="text-sm opacity-90">{processingState.errorMessage}</p>
          </div>
        </div>
      )}

      {processingState.isSuccess && (
        <div className="success-state mb-6 flex items-center space-x-3 animate-slide-in-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>Image compressed successfully!</span>
        </div>
      )}

      {/* Main Content */}
      {!originalImage ? (
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
                {isDragging ? 'Drop your image here' : 'Upload an image to compress'}
              </h3>
              <p className="text-slate-400 mb-4">
                Drag and drop an image file, or click to browse
              </p>
              <button
                onClick={triggerFileInput}
                className="btn-secondary"
              >
                Choose Image
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Supports: JPG, PNG, WebP • Max file size: 10MB
            </p>
          </div>
        </div>
      ) : (
        // Image Comparison View
        <div className="space-y-8">
          {/* Compression Stats */}
          {imageInfo && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Compression Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">{imageInfo.compressionRatio}%</p>
                  <p className="text-sm text-slate-400">Size Reduction</p>
                </div>
                <div>
                  <p className="text-lg text-white">{formatFileSize(imageInfo.originalSize)}</p>
                  <p className="text-sm text-slate-400">Original Size</p>
                </div>
                <div>
                  <p className="text-lg text-white">{formatFileSize(imageInfo.compressedSize)}</p>
                  <p className="text-sm text-slate-400">Compressed Size</p>
                </div>
                <div>
                  <p className="text-lg text-white">{imageInfo.compressedDimensions.width}×{imageInfo.compressedDimensions.height}</p>
                  <p className="text-sm text-slate-400">Dimensions</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Original</h2>
                {imageInfo && (
                  <span className="text-sm text-slate-400">
                    {imageInfo.originalDimensions.width}×{imageInfo.originalDimensions.height}
                  </span>
                )}
              </div>
              <div className="relative bg-slate-800 rounded-lg overflow-hidden">
                <img
                  src={originalImage}
                  alt="Original image"
                  className="w-full h-auto max-h-96 object-contain"
                />
              </div>
            </div>

            {/* Compressed Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Compressed</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={downloadCompressedImage}
                    disabled={!compressedImage}
                    className="btn-ghost text-sm"
                    title="Download compressed image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative bg-slate-800 rounded-lg overflow-hidden">
                {processingState.isProcessing ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="loading-spinner w-6 h-6" />
                      <span>Compressing image...</span>
                    </div>
                  </div>
                ) : compressedImage ? (
                  <img
                    src={compressedImage}
                    alt="Compressed image"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96 text-slate-400">
                    Processing...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Optimal Settings</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use 80-90% quality for best balance</li>
              <li>• Choose WebP for modern browsers</li>
              <li>• JPEG works best for photos</li>
              <li>• PNG for images with transparency</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Best Practices</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Resize large images before compression</li>
              <li>• Use appropriate dimensions for your use case</li>
              <li>• Test different quality settings</li>
              <li>• Consider your target file size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 