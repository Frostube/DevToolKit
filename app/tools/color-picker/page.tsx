import { Metadata } from 'next'
import { ColorPicker } from '@/components/tools/ColorPicker'

export const metadata: Metadata = {
  title: 'Color Picker - DevToolkit',
  description: 'Professional color picker with format conversion, color harmony, and accessibility checking. Pick colors from your screen and convert between HEX, RGB, HSL, and HSV formats.',
  keywords: 'color picker, color converter, color harmony, contrast checker, accessibility, HEX, RGB, HSL, HSV, web design, UI design',
  openGraph: {
    title: 'Color Picker - DevToolkit',
    description: 'Professional color picker with format conversion, color harmony, and accessibility checking.',
    type: 'website',
  },
}

export default function ColorPickerPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ColorPicker />
      </div>
    </div>
  )
} 