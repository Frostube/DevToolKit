'use client'

import { useState, useRef, useCallback } from 'react'
import { Download, Upload, Settings, RotateCcw, AlertCircle, FileImage, Image as ImageIcon, Type, Move, Play } from 'lucide-react'
import Link from 'next/link'

interface WatermarkOptions {
  type: 'text' | 'image'
  text: string
  font: string
  fontSize: number
  color: string
  opacity: number
  image?: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
  offsetX: number
  offsetY: number
  scale: number
  tile: boolean;
  tileSpacing: number;
  tileAngle: number;
}

interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}

interface WatermarkedImage {
  id: string
  originalName: string
  originalImage: string
  watermarkedImage: string
  originalSize: number
  watermarkedSize: number
  dimensions: { width: number; height: number }
}

const defaultOptions: WatermarkOptions = {
  type: 'text',
  text: 'Sample Watermark',
  font: 'Arial',
  fontSize: 32,
  color: '#ffffff',
  opacity: 0.5,
  position: 'bottom-right',
  offsetX: 20,
  offsetY: 20,
  scale: 0.2,
  tile: false,
  tileSpacing: 100,
  tileAngle: 45,
}

export function ImageWatermark() {
  const [images, setImages] = useState<WatermarkedImage[]>([])
  const [options, setOptions] = useState<WatermarkOptions>(defaultOptions)
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    hasError: false,
    isSuccess: false
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const watermarkInputRef = useRef<HTMLInputElement>(null)
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
      const newImages: WatermarkedImage[] = []
      for (const file of fileArray) {
        const watermarked = await applyWatermark(file)
        if (watermarked) newImages.push(watermarked)
      }
      setImages(prev => [...prev, ...newImages])
      setProcessingState({ isProcessing: false, hasError: false, isSuccess: true })
      setTimeout(() => setProcessingState(prev => ({ ...prev, isSuccess: false })), 3000)
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to watermark images'
      })
    }
  }, [options, watermarkImage])

  const applyWatermark = async (file: File): Promise<WatermarkedImage | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const img = new window.Image()
        img.onload = async () => {
          const canvas = canvasRef.current
          if (!canvas) return resolve(null)
          const ctx = canvas.getContext('2d')
          if (!ctx) return resolve(null)
          canvas.width = img.width
          canvas.height = img.height
          ctx.drawImage(img, 0, 0, img.width, img.height)
          ctx.globalAlpha = options.opacity
          if (options.tile) {
            // Save context state
            ctx.save();
            // Move to center and rotate
            ctx.translate(img.width / 2, img.height / 2);
            ctx.rotate((options.tileAngle * Math.PI) / 180);
            ctx.translate(-img.width / 2, -img.height / 2);
            // Calculate bounds for tiling
            const stepX = (options.type === 'text' ? ctx.measureText(options.text).width : img.width * options.scale) + options.tileSpacing;
            const stepY = (options.type === 'text' ? options.fontSize : img.height * options.scale) + options.tileSpacing;
            for (let y = -img.height; y < img.height * 2; y += stepY) {
              for (let x = -img.width; x < img.width * 2; x += stepX) {
                if (options.type === 'image' && watermarkImage) {
                  const wmImg = new window.Image();
                  wmImg.onload = () => {
                    ctx.drawImage(wmImg, x, y, img.width * options.scale, img.height * options.scale);
                  };
                  wmImg.src = watermarkImage;
                } else if (options.type === 'text') {
                  ctx.font = `${options.fontSize}px ${options.font}`;
                  ctx.fillStyle = options.color;
                  ctx.textBaseline = 'bottom';
                  ctx.fillText(options.text, x, y + options.fontSize);
                }
              }
            }
            ctx.restore();
            finish()
            return;
          }
          let wmWidth = img.width * options.scale
          let wmHeight = wmWidth
          let posX = 0, posY = 0
          if (options.type === 'image' && watermarkImage) {
            const wmImg = new window.Image()
            wmImg.onload = () => {
              wmHeight = wmImg.height * (wmWidth / wmImg.width)
              ;({ posX, posY } = getPosition(img.width, img.height, wmWidth, wmHeight, options))
              ctx.drawImage(wmImg, posX, posY, wmWidth, wmHeight)
              finish()
            }
            wmImg.src = watermarkImage
          } else if (options.type === 'text') {
            ctx.font = `${options.fontSize}px ${options.font}`
            ctx.fillStyle = options.color
            ctx.textBaseline = 'bottom'
            const textMetrics = ctx.measureText(options.text)
            wmWidth = textMetrics.width
            wmHeight = options.fontSize
            ;({ posX, posY } = getPosition(img.width, img.height, wmWidth, wmHeight, options))
            ctx.fillText(options.text, posX, posY + wmHeight)
            finish()
          } else {
            finish()
          }
          function finish() {
            if (!ctx || !canvas) return;
            ctx.globalAlpha = 1
            const watermarkedDataUrl = canvas.toDataURL('image/png', 0.95)
            const originalSize = file.size
            const watermarkedSize = Math.round((watermarkedDataUrl.length - 22) * 3 / 4)
            resolve({
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              originalName: file.name,
              originalImage: result,
              watermarkedImage: watermarkedDataUrl,
              originalSize,
              watermarkedSize,
              dimensions: { width: img.width, height: img.height }
            })
          }
        }
        img.onerror = () => resolve(null)
        img.src = result
      }
      reader.readAsDataURL(file)
    })
  }

  function getPosition(imgW: number, imgH: number, wmW: number, wmH: number, opt: WatermarkOptions) {
    let posX = opt.offsetX, posY = opt.offsetY
    switch (opt.position) {
      case 'top-left':
        posX = opt.offsetX
        posY = opt.offsetY
        break
      case 'top-right':
        posX = imgW - wmW - opt.offsetX
        posY = opt.offsetY
        break
      case 'bottom-left':
        posX = opt.offsetX
        posY = imgH - wmH - opt.offsetY
        break
      case 'bottom-right':
        posX = imgW - wmW - opt.offsetX
        posY = imgH - wmH - opt.offsetY
        break
      case 'center':
        posX = (imgW - wmW) / 2
        posY = (imgH - wmH) / 2
        break
    }
    return { posX, posY }
  }

  const handleWatermarkImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setWatermarkImage(ev.target?.result as string)
    reader.readAsDataURL(file)
    setOptions(opt => ({ ...opt, type: 'image' }))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadImage = (img: WatermarkedImage) => {
    const link = document.createElement('a')
    link.download = img.originalName.replace(/\.[^/.]+$/, '.png')
    link.href = img.watermarkedImage
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAll = () => {
    images.forEach((img, idx) => setTimeout(() => downloadImage(img), idx * 100))
  }

  const clearAll = () => {
    setImages([])
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
  const triggerWatermarkInput = () => watermarkInputRef.current?.click()

  // Stats
  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0)
  const totalWatermarked = images.reduce((sum, img) => sum + img.watermarkedSize, 0)

  const recompressWithNewSettings = async () => {
    setProcessingState({ isProcessing: true, hasError: false, isSuccess: false })
    try {
      const newImages: WatermarkedImage[] = []
      for (const img of images) {
        // Re-apply watermark to the original image
        const file = await fetch(img.originalImage).then(res => res.blob()).then(blob => new File([blob], img.originalName, { type: blob.type }))
        const watermarked = await applyWatermark(file)
        if (watermarked) newImages.push(watermarked)
      }
      setImages(newImages)
      setProcessingState({ isProcessing: false, hasError: false, isSuccess: true })
      setTimeout(() => setProcessingState(prev => ({ ...prev, isSuccess: false })), 3000)
    } catch (error) {
      setProcessingState({
        isProcessing: false,
        hasError: true,
        isSuccess: false,
        errorMessage: error instanceof Error ? error.message : 'Failed to recompress images'
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={e => e.target.files && handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
      />
      <input
        ref={watermarkInputRef}
        type="file"
        accept="image/*"
        onChange={handleWatermarkImage}
        style={{ display: 'none' }}
      />
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/image-tools" className="breadcrumb-item hover:text-slate-200 transition-colors">Image Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Image Watermark</span>
      </nav>
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Image Watermark</h1>
            <p className="text-slate-300">Add text or logo watermarks to your images in batch</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={triggerFileInput} className="btn-ghost flex items-center space-x-2">
            <Upload className="w-4 h-4" />
            <span>Upload Images</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`btn-ghost flex items-center space-x-2 ${showSettings ? 'bg-slate-700/50' : ''}`}>
            <Settings className="w-4 h-4" />
            <span>Watermark Settings</span>
          </button>
          {images.length > 1 && (
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
          <h3 className="text-lg font-semibold text-white mb-4">Watermark Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
              <select
                value={options.type}
                onChange={e => setOptions({ ...options, type: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
              </select>
            </div>
            {options.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Text</label>
                  <input
                    type="text"
                    value={options.text}
                    onChange={e => setOptions({ ...options, text: e.target.value })}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Font</label>
                  <select
                    value={options.font}
                    onChange={e => setOptions({ ...options, font: e.target.value })}
                    className="form-input w-full"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Font Size</label>
                  <input
                    type="number"
                    value={options.fontSize}
                    min={10}
                    max={200}
                    onChange={e => setOptions({ ...options, fontSize: Number(e.target.value) })}
                    className="form-input w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                  <input
                    type="color"
                    value={options.color}
                    onChange={e => setOptions({ ...options, color: e.target.value })}
                    className="form-input w-full h-10"
                  />
                </div>
              </>
            )}
            {options.type === 'image' && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Logo Image</label>
                <button onClick={triggerWatermarkInput} className="btn-secondary flex items-center space-x-2">
                  <ImageIcon className="w-4 h-4" />
                  <span>Upload Logo</span>
                </button>
                {watermarkImage && (
                  <div className="mt-2"><img src={watermarkImage} alt="Watermark" className="h-16 object-contain rounded" /></div>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Opacity</label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={options.opacity}
                onChange={e => setOptions({ ...options, opacity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scale</label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.01"
                value={options.scale}
                onChange={e => setOptions({ ...options, scale: Number(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Position</label>
              <select
                value={options.position}
                onChange={e => setOptions({ ...options, position: e.target.value as any })}
                className="form-input w-full"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Offset X (px)</label>
              <input
                type="number"
                value={options.offsetX}
                min={0}
                max={500}
                onChange={e => setOptions({ ...options, offsetX: Number(e.target.value) })}
                className="form-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Offset Y (px)</label>
              <input
                type="number"
                value={options.offsetY}
                min={0}
                max={500}
                onChange={e => setOptions({ ...options, offsetY: Number(e.target.value) })}
                className="form-input w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="tile_watermark"
                checked={options.tile}
                onChange={e => setOptions({ ...options, tile: e.target.checked })}
                className="form-checkbox"
              />
              <label htmlFor="tile_watermark" className="ml-2 text-sm text-slate-300">Tile watermark (repeat across image)</label>
            </div>
            {options.tile && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tile Spacing (px)
                    <span className="text-xs text-slate-400 ml-2"></span>
                  </label>
                  <input
                    type="number"
                    value={options.tileSpacing}
                    min={10}
                    max={1000}
                    onChange={e => setOptions({ ...options, tileSpacing: Number(e.target.value) })}
                    className="form-input w-full"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Tile Angle (degrees)
                    <span className="text-xs text-slate-400 ml-2"></span>
                  </label>
                  <input
                    type="number"
                    value={options.tileAngle}
                    min={-90}
                    max={90}
                    onChange={e => setOptions({ ...options, tileAngle: Number(e.target.value) })}
                    className="form-input w-full"
                    placeholder="45"
                  />
                </div>
              </>
            )}
          </div>
          {images.length > 0 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
              <span className="text-sm text-slate-300">Apply new settings</span>
              <button
                onClick={recompressWithNewSettings}
                disabled={processingState.isProcessing}
                className="btn-secondary text-sm"
              >
                {processingState.isProcessing ? (
                  <span className="flex items-center"><span className="loading-spinner w-4 h-4 mr-2" />Recompressing...</span>
                ) : (
                  'Recompress'
                )}
              </button>
            </div>
          )}
        </div>
      )}
      {images.length === 0 ? (
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
            isDragging ? 'border-pink-400 bg-pink-500/10' : 'border-slate-600 hover:border-slate-500'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-pink-500/20 p-4 rounded-full">
              <FileImage className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragging ? 'Drop your images here' : 'Upload images to watermark'}
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
            {images.map(img => (
              <div key={img.id} className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-white truncate mr-2">{img.originalName}</h4>
                  <button onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))} className="text-red-400 hover:text-red-300 text-sm">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <img src={img.originalImage} alt="Original" className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2" />
                    <p className="text-xs text-slate-400">Original</p>
                    <p className="text-xs text-slate-500">{formatFileSize(img.originalSize)}</p>
                  </div>
                  <div className="text-center">
                    <img src={img.watermarkedImage} alt="Watermarked" className="w-full h-32 object-contain rounded-lg bg-slate-700/30 mb-2" />
                    <p className="text-xs text-pink-400">Watermarked</p>
                    <p className="text-xs text-slate-500">{formatFileSize(img.watermarkedSize)}</p>
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 mb-4">
                  <div className="grid grid-cols-2 gap-2 text-xs">
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
                <span>Applying watermark...</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 Watermarking Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">Why Add Watermarks?</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Protect your images from unauthorized use</li>
              <li>• Promote your brand or website</li>
              <li>• Add copyright or attribution info</li>
              <li>• Batch watermark for social media or web</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Best Practices</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Use semi-transparent watermarks for subtle branding</li>
              <li>• Place watermark in a corner or center for visibility</li>
              <li>• Use your logo or custom text</li>
              <li>• Adjust size and opacity for best results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 