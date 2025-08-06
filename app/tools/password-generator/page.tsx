import { Metadata } from 'next'
import { PasswordGenerator } from '@/components/tools/PasswordGenerator'

export const metadata: Metadata = {
  title: 'Password Generator - Seva Tools',
  description: 'Generate cryptographically secure passwords with customizable options. Create strong, unique passwords for all your accounts.',
  keywords: 'password generator, secure passwords, random passwords, password strength, cryptography',
  openGraph: {
    title: 'Password Generator - Seva Tools',
    description: 'Generate cryptographically secure passwords with customizable options.',
    type: 'website',
  },
}

export default function PasswordGeneratorPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Password Generator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Generate cryptographically secure passwords with customizable options. 
            All processing happens in your browser - your data never leaves your device.
          </p>
        </div>
        
        <PasswordGenerator />
      </div>
    </div>
  )
} 