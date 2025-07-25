'use client'

import { useState, useRef, useCallback } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileImage, RefreshCw, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface ConversionOptions {
  outputFormat: 'jpeg' | 'png' | 'webp'
  quality: number
  backgroundColor: string
  removeTransparency: boolean
  maintainMetadata: boolean
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface ImageInfo {
  originalFormat: string
  outputFormat: string
  originalSize: number
  convertedSize: number
  compressionRatio: number
  dimensions: { width: number; height: number }
  hasTransparency: boolean
}

interface FormatInfo {
  name: string
  extension: string
  description: string
  supports: string[]
  bestFor: string[]
}

const formatDetails: Record<string, FormatInfo> = {
  jpeg: {
    name: 'JPEG',
    extension: 'jpg',
    description: 'Lossy compression, excellent for photos',
    supports: ['Quality control', '24-bit color'],
    bestFor: ['Photos', 'Web images', 'Small file sizes']
  },
  png: {
    name: 'PNG',
    extension: 'png', 
    description: 'Lossless compression with transparency support',
    supports: ['Transparency', 'Lossless', '32-bit color'],
    bestFor: ['Graphics', 'Logos', 'Images with transparency']
  },
  webp: {
    name: 'WebP',
    extension: 'webp',
    description: 'Modern format with superior compression',
    supports: ['Transparency', 'Quality control', 'Animation'],
    bestFor: ['Web optimization', 'Modern browsers', 'Best compression']
  }
}

export function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [options, setOptions] = useState<ConversionOptions>({
    outputFormat: 'webp',
    quality: 0.9,
    backgroundColor: '#ffffff',
    removeTransparency: false,
    maintainMetadata: false
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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: 'File size should be less than 10MB'
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

        canvas.width = img.width
        canvas.height = img.height

        // Set background for formats that don't support transparency
        if (options.outputFormat === 'jpeg' || options.removeTransparency) {
          ctx.fillStyle = options.backgroundColor
          ctx.fillRect(0, 0, img.width, img.height)
        }

        // Draw the image
        ctx.drawImage(img, 0, 0)

        // Detect transparency in original image
        const imageData = ctx.getImageData(0, 0, img.width, img.height)
        const hasTransparency = detectTransparency(imageData)

        // Convert to specified format
        const mimeType = `image/${options.outputFormat}`
        const quality = options.outputFormat === 'png' ? undefined : options.quality
        const convertedDataURL = canvas.toDataURL(mimeType, quality)
        
        setConvertedImage(convertedDataURL)

        // Calculate file sizes and compression
        const originalSize = originalFile.size
        const convertedSize = Math.round((convertedDataURL.length - 22) * 3 / 4)
        const compressionRatio = Math.round((1 - convertedSize / originalSize) * 100)

        // Determine original format
        const originalFormat = originalFile.type.split('/')[1] || 'unknown'

        setImageInfo({
          originalFormat: originalFormat.toUpperCase(),
          outputFormat: options.outputFormat.toUpperCase(),
          originalSize,
          convertedSize,
          compressionRatio,
          dimensions: { width: img.width, height: img.height },
          hasTransparency
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
        errorMessage: error instanceof Error ? error.message : 'Failed to convert image'
      })
    }
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

  const downloadConvertedImage = () => {
    if (!convertedImage || !imageInfo) return

    const link = document.createElement('a')
    link.download = `converted-image.${formatDetails[options.outputFormat].extension}`
    link.href = convertedImage
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
    setConvertedImage(null)
    setImageInfo(null)
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const reprocessWithNewSettings = () => {
    if (originalImage) {
      const img = new Image()
      img.onload = () => {
        fetch(originalImage)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], 'image', { type: blob.type })
            processImage(originalImage, file)
          })
      }
      img.src = originalImage
    }
  }

  const selectFormat = (format: 'jpeg' | 'png' | 'webp') => {
    setOptions(prev => ({ ...prev, outputFormat: format }))
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
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/image-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Image Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Image Converter</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Image Format Converter</h1>
            <p className="text-slate-300">Convert between JPEG, PNG, and WebP formats with quality control</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={triggerFileInput}
            className="btn-ghost flex items-center space-x-2"
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

      {/* Format Selection */}
      <div className="mb-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Choose Output Format</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(formatDetails).map(([format, info]) => (
            <button
              key={format}
              onClick={() => selectFormat(format as any)}
              className={`p-4 rounded-lg border transition-all ${
                options.outputFormat === format
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-600 hover:border-slate-500 text-slate-300'
              }`}
            >
              <div className="text-left">
                <h4 className="font-semibold mb-1">{info.name}</h4>
                <p className="text-sm text-slate-400 mb-2">{info.description}</p>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Best for:</p>
                  <p className="text-xs text-slate-500">{info.bestFor.join(', ')}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Conversion Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {options.outputFormat !== 'png' && (
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
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                className="form-input w-full h-10"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remove_transparency"
                checked={options.removeTransparency}
                onChange={(e) => setOptions({ ...options, removeTransparency: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="remove_transparency" className="ml-2 text-sm text-slate-300">
                Remove transparency
              </label>
            </div>
          </div>

          {originalImage && (
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

      {/* Main Content */}
      {!originalImage ? (
        // Upload Area
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500'
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
                {isDragging ? 'Drop your image here' : 'Upload an image to convert'}
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
              Supports: JPG, PNG, WebP, GIF, BMP • Max file size: 10MB
            </p>
          </div>
        </div>
      ) : (
        // Image Conversion View
        <div className="space-y-8">
          {/* Conversion Stats */}
          {imageInfo && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Conversion Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">{imageInfo.outputFormat}</p>
                  <p className="text-sm text-slate-400">Output Format</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">{imageInfo.originalFormat}</p>
                  <p className="text-sm text-slate-400">Original Format</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{formatFileSize(imageInfo.convertedSize)}</p>
                  <p className="text-sm text-slate-400">New Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{formatFileSize(imageInfo.originalSize)}</p>
                  <p className="text-sm text-slate-400">Original Size</p>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${imageInfo.compressionRatio > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {imageInfo.compressionRatio > 0 ? '-' : '+'}{Math.abs(imageInfo.compressionRatio)}%
                  </p>
                  <p className="text-sm text-slate-400">Size Change</p>
                </div>
              </div>
              {imageInfo.hasTransparency && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    <Info className="w-4 h-4 inline mr-2" />
                    This image contains transparency. Converting to JPEG will replace transparent areas with the background color.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Image Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-white">Original</h3>
                {imageInfo && (
                  <span className="text-sm bg-slate-700 text-slate-300 px-2 py-1 rounded">
                    {imageInfo.originalFormat}
                  </span>
                )}
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                />
                {imageInfo && (
                  <div className="mt-4 text-center text-sm text-slate-400">
                    {imageInfo.dimensions.width}×{imageInfo.dimensions.height} • {formatFileSize(imageInfo.originalSize)}
                  </div>
                )}
              </div>
            </div>

            {/* Converted Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-white">Converted</h3>
                  {imageInfo && (
                    <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded">
                      {imageInfo.outputFormat}
                    </span>
                  )}
                </div>
                <button
                  onClick={downloadConvertedImage}
                  disabled={!convertedImage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 relative">
                {convertedImage ? (
                  <>
                    <img
                      src={convertedImage}
                      alt="Converted"
                      className="w-full h-auto max-h-96 object-contain rounded-lg"
                    />
                    {imageInfo && (
                      <div className="mt-4 text-center text-sm text-slate-400">
                        {imageInfo.dimensions.width}×{imageInfo.dimensions.height} • {formatFileSize(imageInfo.convertedSize)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-slate-400">
                    {processingState.isProcessing ? (
                      <div className="flex items-center space-x-3">
                        <div className="loading-spinner w-6 h-6" />
                        <span>Converting image...</span>
                      </div>
                    ) : (
                      <span>Converted image will appear here</span>
                    )}
                  </div>
                )}
                
                {processingState.isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="loading-spinner w-6 h-6" />
                      <span>Processing your image...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Format Comparison */}
          {imageInfo && (
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <span className="text-lg font-medium text-slate-300">{imageInfo.originalFormat}</span>
                <ArrowRight className="w-5 h-5 text-blue-400" />
                <span className="text-lg font-medium text-blue-400">{imageInfo.outputFormat}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Format Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
          {Object.entries(formatDetails).map(([format, info]) => (
            <div key={format}>
              <h4 className="font-medium text-white mb-2">{info.name}</h4>
              <p className="text-slate-400 mb-2">{info.description}</p>
              <div className="space-y-2">
                <div>
                  <p className="font-medium text-slate-300">Supports:</p>
                  <ul className="text-slate-400 text-xs">
                    {info.supports.map((feature, i) => (
                      <li key={i}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-slate-300">Best for:</p>
                  <ul className="text-slate-400 text-xs">
                    {info.bestFor.map((useCase, i) => (
                      <li key={i}>• {useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 
