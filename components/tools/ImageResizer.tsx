'use client'

import { useState, useRef, useCallback } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileImage, Maximize, Square } from 'lucide-react'
import Link from 'next/link'

interface ResizeOptions {
  width: number
  height: number
  maintainAspectRatio: boolean
  resizeMode: 'contain' | 'cover' | 'fill' | 'scale-down'
  quality: number
  format: 'jpeg' | 'png' | 'webp'
  backgroundColor: string
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface ImageInfo {
  originalDimensions: { width: number; height: number }
  resizedDimensions: { width: number; height: number }
  originalSize: number
  resizedSize: number
  aspectRatio: number
}

interface AspectRatioPreset {
  name: string
  ratio: number
  width: number
  height: number
}

const aspectRatioPresets: AspectRatioPreset[] = [
  { name: '16:9 (HD)', ratio: 16/9, width: 1920, height: 1080 },
  { name: '4:3 (Standard)', ratio: 4/3, width: 1600, height: 1200 },
  { name: '1:1 (Square)', ratio: 1, width: 1080, height: 1080 },
  { name: '3:2 (Photo)', ratio: 3/2, width: 1500, height: 1000 },
  { name: '21:9 (Ultrawide)', ratio: 21/9, width: 2560, height: 1080 },
  { name: '9:16 (Portrait)', ratio: 9/16, width: 1080, height: 1920 },
]

export function ImageResizer() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [options, setOptions] = useState<ResizeOptions>({
    width: 1920,
    height: 1080,
    maintainAspectRatio: true,
    resizeMode: 'contain',
    quality: 0.9,
    format: 'jpeg',
    backgroundColor: '#ffffff'
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

        // Calculate new dimensions based on resize mode
        const { width, height, drawWidth, drawHeight, offsetX, offsetY } = calculateResizeDimensions(
          img.width, 
          img.height, 
          options.width, 
          options.height, 
          options.resizeMode,
          options.maintainAspectRatio
        )

        canvas.width = width
        canvas.height = height

        // Set background color
        ctx.fillStyle = options.backgroundColor
        ctx.fillRect(0, 0, width, height)

        // Apply image smoothing for better quality
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'

        // Draw the resized image
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight)

        // Convert to specified format
        const mimeType = `image/${options.format}`
        const resizedDataURL = canvas.toDataURL(mimeType, options.quality)
        
        setResizedImage(resizedDataURL)

        // Calculate size info
        const originalSize = originalFile.size
        const resizedSize = Math.round((resizedDataURL.length - 22) * 3 / 4) // Rough estimate

        setImageInfo({
          originalDimensions: { width: img.width, height: img.height },
          resizedDimensions: { width, height },
          originalSize,
          resizedSize,
          aspectRatio: img.width / img.height
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

  const calculateResizeDimensions = (
    originalWidth: number,
    originalHeight: number,
    targetWidth: number,
    targetHeight: number,
    mode: string,
    maintainAspectRatio: boolean
  ): { width: number; height: number; drawWidth: number; drawHeight: number; offsetX: number; offsetY: number } => {
    if (!maintainAspectRatio && mode === 'fill') {
      return {
        width: targetWidth,
        height: targetHeight,
        drawWidth: targetWidth,
        drawHeight: targetHeight,
        offsetX: 0,
        offsetY: 0
      }
    }

    const originalAspectRatio = originalWidth / originalHeight
    const targetAspectRatio = targetWidth / targetHeight

    let width = targetWidth
    let height = targetHeight
    let drawWidth = targetWidth
    let drawHeight = targetHeight
    let offsetX = 0
    let offsetY = 0

    switch (mode) {
      case 'contain':
        if (originalAspectRatio > targetAspectRatio) {
          drawHeight = targetWidth / originalAspectRatio
          offsetY = (targetHeight - drawHeight) / 2
        } else {
          drawWidth = targetHeight * originalAspectRatio
          offsetX = (targetWidth - drawWidth) / 2
        }
        break

      case 'cover':
        if (originalAspectRatio > targetAspectRatio) {
          drawWidth = targetHeight * originalAspectRatio
          offsetX = (targetWidth - drawWidth) / 2
        } else {
          drawHeight = targetWidth / originalAspectRatio
          offsetY = (targetHeight - drawHeight) / 2
        }
        break

      case 'scale-down':
        if (originalWidth <= targetWidth && originalHeight <= targetHeight) {
          width = originalWidth
          height = originalHeight
          drawWidth = originalWidth
          drawHeight = originalHeight
          offsetX = (targetWidth - originalWidth) / 2
          offsetY = (targetHeight - originalHeight) / 2
        } else {
          return calculateResizeDimensions(
            originalWidth, originalHeight, targetWidth, targetHeight, 'contain', true
          )
        }
        break
    }

    return { width, height, drawWidth, drawHeight, offsetX, offsetY }
  }

  const applyPreset = (preset: AspectRatioPreset) => {
    if (imageInfo && options.maintainAspectRatio) {
      const scale = Math.min(preset.width / imageInfo.originalDimensions.width, preset.height / imageInfo.originalDimensions.height)
      const newWidth = Math.round(imageInfo.originalDimensions.width * scale)
      const newHeight = Math.round(imageInfo.originalDimensions.height * scale)
      
      setOptions(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }))
    } else {
      setOptions(prev => ({
        ...prev,
        width: preset.width,
        height: preset.height
      }))
    }
  }

  const handleDimensionChange = (dimension: 'width' | 'height', value: number) => {
    if (options.maintainAspectRatio && imageInfo) {
      const aspectRatio = imageInfo.aspectRatio
      if (dimension === 'width') {
        setOptions(prev => ({
          ...prev,
          width: value,
          height: Math.round(value / aspectRatio)
        }))
      } else {
        setOptions(prev => ({
          ...prev,
          width: Math.round(value * aspectRatio),
          height: value
        }))
      }
    } else {
      setOptions(prev => ({
        ...prev,
        [dimension]: value
      }))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadResizedImage = () => {
    if (!resizedImage || !imageInfo) return

    const link = document.createElement('a')
    link.download = `resized-image-${imageInfo.resizedDimensions.width}x${imageInfo.resizedDimensions.height}.${options.format}`
    link.href = resizedImage
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
    setResizedImage(null)
    setImageInfo(null)
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
  }

  const reprocessWithNewSettings = () => {
    if (originalImage) {
      // Find the original file from the data URL (this is a limitation)
      // In a real app, you'd store the original file reference
      const img = new Image()
      img.onload = () => {
        // Create a mock file for reprocessing
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

  return (
    <div className="max-w-4xl mx-auto">
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
        <span className="text-white">Image Resizer</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
            <Maximize className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Image Resizer</h1>
            <p className="text-slate-300">Resize images with intelligent scaling and aspect ratio preservation</p>
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

      {/* Aspect Ratio Presets */}
      {imageInfo && (
        <div className="mb-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Presets</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {aspectRatioPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="btn-ghost text-sm flex flex-col items-center p-3 rounded-lg border border-slate-600 hover:border-green-500 transition-colors"
              >
                <Square className="w-4 h-4 mb-1" />
                <span className="font-medium">{preset.name}</span>
                <span className="text-xs text-slate-400">{preset.width}×{preset.height}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Resize Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={options.width}
                onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                className="form-input w-full"
                min="1"
                max="8000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={options.height}
                onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                className="form-input w-full"
                min="1"
                max="8000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Resize Mode
              </label>
              <select
                value={options.resizeMode}
                onChange={(e) => setOptions({ ...options, resizeMode: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="contain">Contain (fit within)</option>
                <option value="cover">Cover (fill area)</option>
                <option value="fill">Fill (stretch)</option>
                <option value="scale-down">Scale Down Only</option>
              </select>
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
                id="maintain_aspect_ratio"
                checked={options.maintainAspectRatio}
                onChange={(e) => setOptions({ ...options, maintainAspectRatio: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="maintain_aspect_ratio" className="ml-2 text-sm text-slate-300">
                Maintain aspect ratio
              </label>
            </div>
          </div>

          {imageInfo && (
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
                {isDragging ? 'Drop your image here' : 'Upload an image to resize'}
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
              Supports: JPG, PNG, WebP, GIF • Max file size: 10MB
            </p>
          </div>
        </div>
      ) : (
        // Image Comparison View
        <div className="space-y-8">
          {/* Resize Stats */}
          {imageInfo && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resize Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {imageInfo.resizedDimensions.width}×{imageInfo.resizedDimensions.height}
                  </p>
                  <p className="text-sm text-slate-400">New Dimensions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {imageInfo.originalDimensions.width}×{imageInfo.originalDimensions.height}
                  </p>
                  <p className="text-sm text-slate-400">Original Dimensions</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{formatFileSize(imageInfo.resizedSize)}</p>
                  <p className="text-sm text-slate-400">New Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{formatFileSize(imageInfo.originalSize)}</p>
                  <p className="text-sm text-slate-400">Original Size</p>
                </div>
              </div>
            </div>
          )}

          {/* Image Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Original</h3>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-auto max-h-96 object-contain rounded-lg"
                />
                {imageInfo && (
                  <div className="mt-4 text-center text-sm text-slate-400">
                    {imageInfo.originalDimensions.width}×{imageInfo.originalDimensions.height} • {formatFileSize(imageInfo.originalSize)}
                  </div>
                )}
              </div>
            </div>

            {/* Resized Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Resized</h3>
                <button
                  onClick={downloadResizedImage}
                  disabled={!resizedImage}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 relative">
                {resizedImage ? (
                  <>
                    <img
                      src={resizedImage}
                      alt="Resized"
                      className="w-full h-auto max-h-96 object-contain rounded-lg"
                    />
                    {imageInfo && (
                      <div className="mt-4 text-center text-sm text-slate-400">
                        {imageInfo.resizedDimensions.width}×{imageInfo.resizedDimensions.height} • {formatFileSize(imageInfo.resizedSize)}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-96 flex items-center justify-center text-slate-400">
                    {processingState.isProcessing ? (
                      <div className="flex items-center space-x-3">
                        <div className="loading-spinner w-6 h-6" />
                        <span>Resizing image...</span>
                      </div>
                    ) : (
                      <span>Resized image will appear here</span>
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
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Resize Modes Explained</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Contain</h4>
            <p className="text-slate-400 mb-2">Scales the image to fit within the specified dimensions while maintaining aspect ratio.</p>
            <ul className="space-y-1 text-slate-400">
              <li>• Preserves entire image</li>
              <li>• May add padding/background</li>
              <li>• Best for thumbnails</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Cover</h4>
            <p className="text-slate-400 mb-2">Scales the image to fill the entire area while maintaining aspect ratio.</p>
            <ul className="space-y-1 text-slate-400">
              <li>• Fills entire canvas</li>
              <li>• May crop parts of image</li>
              <li>• Best for backgrounds</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Fill</h4>
            <p className="text-slate-400 mb-2">Stretches the image to exactly match the specified dimensions.</p>
            <ul className="space-y-1 text-slate-400">
              <li>• May distort image</li>
              <li>• Exact dimensions</li>
              <li>• Use with caution</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Scale Down</h4>
            <p className="text-slate-400 mb-2">Only resizes if the image is larger than specified dimensions.</p>
            <ul className="space-y-1 text-slate-400">
              <li>• Never upscales</li>
              <li>• Preserves quality</li>
              <li>• Best for optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 