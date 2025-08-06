import { QRCodeGenerator } from '@/components/tools/QRCodeGenerator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'QR Code Generator - Create Custom QR Codes Online | DevToolkit',
  description: 'Free online QR code generator with custom colors, sizes, and error correction. Generate QR codes for URLs, text, and any data. Download as PNG.',
  keywords: 'qr code generator, qr code, qr code maker, custom qr code, qr code download, qr code creator',
}

export default function QRGeneratorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            QR Code Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate custom QR codes with adjustable colors, sizes, and error correction. 
            All processing happens in your browser - your data never leaves your device.
          </p>
        </div>
        
        <QRCodeGenerator />
      </div>
    </div>
  )
} 