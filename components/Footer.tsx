'use client'

import Link from 'next/link'
import { Github, Twitter, Mail, Heart, Code, Zap } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Tools',
      links: [
        { href: '/formatters', label: 'Code Formatters' },
        { href: '/converters', label: 'File Converters' },
        { href: '/generators', label: 'Generators' },
        { href: '/image-tools', label: 'Image Tools' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '/api-docs', label: 'API Documentation' },
        { href: '/tutorials', label: 'Tutorials' },
        { href: '/blog', label: 'Blog' },
        { href: '/changelog', label: 'Changelog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' }
      ]
    }
  ]

  const socialLinks = [
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'mailto:hello@devtoolkit.com', icon: Mail, label: 'Email' }
  ]

  return (
    <footer className="bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">DevToolkit</span>
                <span className="text-sm text-slate-400">Swiss Army Knife for Developers</span>
              </div>
            </Link>
            
            <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
              The fastest, most comprehensive developer toolkit. Process files in-browser, 
              automate with our API, and boost your productivity.
            </p>

            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800/50 focus-ring"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-5 h-5" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors text-sm focus-ring rounded"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-slate-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <span>© {currentYear} DevToolkit. All rights reserved.</span>
              <div className="hidden md:flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="w-4 h-4 text-red-400 fill-current" />
                <span>for developers</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-slate-400">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Lightning fast</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-400">
                <Code className="w-4 h-4 text-blue-400" />
                <span>Open source</span>
              </div>
            </div>
          </div>

          {/* Mobile-only made with love */}
          <div className="md:hidden flex items-center justify-center space-x-1 text-sm text-slate-400 mt-4">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-400 fill-current" />
            <span>for developers</span>
          </div>
        </div>
      </div>
    </footer>
  )
} 