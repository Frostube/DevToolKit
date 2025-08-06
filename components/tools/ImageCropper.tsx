'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Copy, Download, Upload, Settings, Play, RotateCcw, CheckCircle, AlertCircle, Info, FileImage, Scissors, Square, Move } from 'lucide-react'
import Link from 'next/link'

interface CropOptions {
  aspectRatio: number | null // null for free crop
  outputFormat: 'jpeg' | 'png' | 'webp'
  quality: number
  backgroundColor: string
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageInfo {
  originalDimensions: { width: number; height: number }
  croppedDimensions: { width: number; height: number }
  originalSize: number
  croppedSize: number
  cropArea: CropArea
}

interface AspectRatioPreset {
  name: string
  ratio: number | null
  icon: string
}

const aspectRatioPresets: AspectRatioPreset[] = [
  { name: 'Free', ratio: null, icon: '🔄' },
  { name: '1:1', ratio: 1, icon: '⬜' },
  { name: '4:3', ratio: 4/3, icon: '📺' },
  { name: '16:9', ratio: 16/9, icon: '🎬' },
  { name: '3:2', ratio: 3/2, icon: '📷' },
  { name: '9:16', ratio: 9/16, icon: '📱' },
]

export function ImageCropper() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null)
  const [options, setOptions] = useState<CropOptions>({
    aspectRatio: null,
    outputFormat: 'png',
    quality: 0.9,
    backgroundColor: '#ffffff'
  })
  const [cropArea, setCropArea] = useState<CropArea>({ x: 50, y: 50, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showSettings, setShowSettings] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasError: false,
    isSuccess: false
  })
  const [isImageDragging, setIsImageDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const cropperRef = useRef<HTMLDivElement>(null)

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
      setCroppedImage(null)
      setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
      
      // Initialize crop area
      setTimeout(() => {
        if (imageRef.current) {
          const img = imageRef.current
          const rect = img.getBoundingClientRect()
          const centerX = rect.width / 2 - 100
          const centerY = rect.height / 2 - 100
          setCropArea({ x: centerX, y: centerY, width: 200, height: 200 })
        }
      }, 100)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleCrop = async () => {
    if (!originalImage || !imageRef.current) return

    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })

    try {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const imageElement = imageRef.current!
        const rect = imageElement.getBoundingClientRect()
        
        // Calculate scale between displayed image and actual image
        const scaleX = img.width / rect.width
        const scaleY = img.height / rect.height

        // Convert crop area to actual image coordinates
        const actualCropArea = {
          x: cropArea.x * scaleX,
          y: cropArea.y * scaleY,
          width: cropArea.width * scaleX,
          height: cropArea.height * scaleY
        }

        canvas.width = actualCropArea.width
        canvas.height = actualCropArea.height

        // Set background for formats that don't support transparency
        if (options.outputFormat === 'jpeg') {
          ctx.fillStyle = options.backgroundColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        // Draw the cropped portion
        ctx.drawImage(
          img,
          actualCropArea.x, actualCropArea.y, actualCropArea.width, actualCropArea.height,
          0, 0, canvas.width, canvas.height
        )

        // Convert to specified format
        const mimeType = `image/${options.outputFormat}`
        const quality = options.outputFormat === 'png' ? undefined : options.quality
        const croppedDataURL = canvas.toDataURL(mimeType, quality)
        
        setCroppedImage(croppedDataURL)

        // Calculate file sizes
        const originalSize = Math.round((originalImage.length - 22) * 3 / 4)
        const croppedSize = Math.round((croppedDataURL.length - 22) * 3 / 4)

        setImageInfo({
          originalDimensions: { width: img.width, height: img.height },
          croppedDimensions: { width: Math.round(actualCropArea.width), height: Math.round(actualCropArea.height) },
          originalSize,
          croppedSize,
          cropArea: actualCropArea
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

      img.src = originalImage
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to crop image'
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent, action: 'move' | 'resize') => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    
    if (action === 'move') {
      setIsDragging(true)
    } else {
      setIsResizing(true)
    }
  }

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return
    if (!cropperRef.current || !imageRef.current) return

    const cropperRect = cropperRef.current.getBoundingClientRect()
    const imageRect = imageRef.current.getBoundingClientRect()

    if (isDragging) {
      let newX = e.clientX - cropperRect.left - dragStart.x
      let newY = e.clientY - cropperRect.top - dragStart.y

      // Constrain to image bounds
      newX = Math.max(0, Math.min(newX, imageRect.width - cropArea.width))
      newY = Math.max(0, Math.min(newY, imageRect.height - cropArea.height))

      setCropArea(prev => ({ ...prev, x: newX, y: newY }))
    }

    if (isResizing) {
      let newWidth = e.clientX - cropperRect.left - cropArea.x
      let newHeight = e.clientY - cropperRect.top - cropArea.y

      // Apply aspect ratio constraint
      if (options.aspectRatio) {
        newHeight = newWidth / options.aspectRatio
      }

      // Constrain to image bounds
      newWidth = Math.max(50, Math.min(newWidth, imageRect.width - cropArea.x))
      newHeight = Math.max(50, Math.min(newHeight, imageRect.height - cropArea.y))

      setCropArea(prev => ({ ...prev, width: newWidth, height: newHeight }))
    }
  }, [isDragging, isResizing, dragStart, cropArea, options.aspectRatio])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp])

  const applyAspectRatio = (ratio: number | null) => {
    setOptions(prev => ({ ...prev, aspectRatio: ratio }))
    
    if (ratio && cropArea.width > 0) {
      const newHeight = cropArea.width / ratio
      setCropArea(prev => ({ ...prev, height: newHeight }))
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadCroppedImage = () => {
    if (!croppedImage || !imageInfo) return

    const link = document.createElement('a')
    link.download = `cropped-image-${imageInfo.croppedDimensions.width}x${imageInfo.croppedDimensions.height}.${options.outputFormat}`
    link.href = croppedImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsImageDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsImageDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsImageDragging(false)
    
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
    setCroppedImage(null)
    setImageInfo(null)
    setCropArea({ x: 50, y: 50, width: 200, height: 200 })
    setProcessingState({ isProcessing: false, hasError: false, isSuccess: false })
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
        <span className="text-white">Image Cropper</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Image Cropper</h1>
            <p className="text-slate-300">Crop images with precision using our interactive cropping tool</p>
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
      {originalImage && (
        <div className="mb-8 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Aspect Ratios</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {aspectRatioPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyAspectRatio(preset.ratio)}
                className={`btn-ghost text-sm flex flex-col items-center p-3 rounded-lg border transition-colors ${
                  options.aspectRatio === preset.ratio
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400'
                    : 'border-slate-600 hover:border-slate-500'
                }`}
              >
                <span className="text-lg mb-1">{preset.icon}</span>
                <span className="font-medium">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Crop Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Output Format
              </label>
              <select
                value={options.outputFormat}
                onChange={(e) => setOptions({ ...options, outputFormat: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="png">PNG (with transparency)</option>
                <option value="jpeg">JPEG</option>
                <option value="webp">WebP</option>
              </select>
            </div>

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

            {options.outputFormat === 'jpeg' && (
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
            )}
          </div>
          {originalImage && (
            <div className="mt-6 pt-6 border-t border-slate-700">
              <button
                onClick={handleCrop}
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
            isImageDragging 
              ? 'border-purple-400 bg-purple-500/10' 
              : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-purple-500/20 p-4 rounded-full">
              <FileImage className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isImageDragging ? 'Drop your image here' : 'Upload an image to crop'}
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
        // Cropping Interface
        <div className="space-y-8">
          {/* Crop Stats */}
          {imageInfo && (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Crop Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {imageInfo.croppedDimensions.width}×{imageInfo.croppedDimensions.height}
                  </p>
                  <p className="text-sm text-slate-400">Cropped Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {imageInfo.originalDimensions.width}×{imageInfo.originalDimensions.height}
                  </p>
                  <p className="text-sm text-slate-400">Original Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-400">{formatFileSize(imageInfo.croppedSize)}</p>
                  <p className="text-sm text-slate-400">New File Size</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-400">{formatFileSize(imageInfo.originalSize)}</p>
                  <p className="text-sm text-slate-400">Original File Size</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cropping Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Original Image</h3>
                <button
                  onClick={handleCrop}
                  disabled={processingState.isProcessing}
                  className="btn-primary flex items-center space-x-2"
                >
                  {processingState.isProcessing ? (
                    <>
                      <div className="loading-spinner w-4 h-4" />
                      <span>Cropping...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" />
                      <span>Crop Image</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 relative">
                <div ref={cropperRef} className="relative inline-block">
                  <img
                    ref={imageRef}
                    src={originalImage}
                    alt="Original"
                    className="max-w-full max-h-96 object-contain rounded-lg"
                    draggable={false}
                  />
                  
                  {/* Crop Overlay */}
                  <div
                    className="absolute border-2 border-purple-400 bg-purple-400/10 cursor-move"
                    style={{
                      left: cropArea.x,
                      top: cropArea.y,
                      width: cropArea.width,
                      height: cropArea.height,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, 'move')}
                  >
                    {/* Move handle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Move className="w-6 h-6 text-purple-400" />
                    </div>
                    
                    {/* Resize handle */}
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-purple-400 cursor-nw-resize"
                      onMouseDown={(e) => handleMouseDown(e, 'resize')}
                    />
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-400 text-center">
                Drag the crop area to move • Drag the bottom-right corner to resize
              </p>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Cropped Preview</h3>
                {croppedImage && (
                  <button
                    onClick={downloadCroppedImage}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                )}
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 relative min-h-96 flex items-center justify-center">
                {croppedImage ? (
                  <div className="text-center">
                    <img
                      src={croppedImage}
                      alt="Cropped"
                      className="max-w-full max-h-80 object-contain rounded-lg"
                    />
                    {imageInfo && (
                      <div className="mt-4 text-sm text-slate-400">
                        {imageInfo.croppedDimensions.width}×{imageInfo.croppedDimensions.height} • {formatFileSize(imageInfo.croppedSize)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Scissors className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Cropped image will appear here</p>
                    <p className="text-sm mt-2">Click "Crop Image" to generate preview</p>
                  </div>
                )}
                
                {processingState.isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="loading-spinner w-6 h-6" />
                      <span>Cropping your image...</span>
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
        <h3 className="text-lg font-semibold text-white mb-4">💡 Cropping Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">How to Crop</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Drag the purple box to move the crop area</li>
              <li>• Drag the corner handle to resize</li>
              <li>• Use aspect ratio presets for common sizes</li>
              <li>• Click "Crop Image" to generate the result</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Output Formats</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• <strong>PNG:</strong> Best for images with transparency</li>
              <li>• <strong>JPEG:</strong> Smaller files, good for photos</li>
              <li>• <strong>WebP:</strong> Modern format with great compression</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 