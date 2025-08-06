'use client'

import { useState, useCallback } from 'react'
import { Copy, FileText, RotateCcw, Download } from 'lucide-react'
import Link from 'next/link'

interface LoremOptions {
  type: 'paragraphs' | 'sentences' | 'words'
  count: number
  startWithLorem: boolean
  includeHTML: boolean
  includeMarkdown: boolean
}

const defaultOptions: LoremOptions = {
  type: 'paragraphs',
  count: 3,
  startWithLorem: true,
  includeHTML: false,
  includeMarkdown: false
}

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
  'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
  'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
  'laborum', 'sed', 'ut', 'perspiciatis', 'unde', 'omnis', 'iste', 'natus',
  'error', 'sit', 'voluptatem', 'accusantium', 'doloremque', 'laudantium',
  'totam', 'rem', 'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore',
  'veritatis', 'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt',
  'explicabo', 'nemo', 'enim', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'sit',
  'aspernatur', 'aut', 'odit', 'aut', 'fugit', 'sed', 'quia', 'consequuntur',
  'magni', 'dolores', 'eos', 'qui', 'ratione', 'voluptatem', 'sequi', 'nesciunt',
  'neque', 'porro', 'quisquam', 'est', 'qui', 'dolorem', 'ipsum', 'quia', 'dolor',
  'sit', 'amet', 'consectetur', 'adipisci', 'velit', 'sed', 'quia', 'non',
  'numquam', 'eius', 'modi', 'tempora', 'incidunt', 'ut', 'labore', 'et', 'dolore',
  'magnam', 'aliquam', 'quaerat', 'voluptatem', 'ut', 'enim', 'ad', 'minima',
  'veniam', 'quis', 'nostrum', 'exercitationem', 'ullam', 'corporis', 'suscipit',
  'laboriosam', 'nisi', 'ut', 'aliquid', 'ex', 'ea', 'commodi', 'consequatur',
  'quis', 'autem', 'vel', 'eum', 'iure', 'reprehenderit', 'qui', 'in', 'ea',
  'voluptate', 'velit', 'esse', 'quam', 'nihil', 'molestiae', 'consequatur',
  'vel', 'illum', 'qui', 'dolorem', 'eum', 'fugiat', 'quo', 'voluptas', 'nulla',
  'pariatur', 'at', 'vero', 'eos', 'et', 'accusamus', 'et', 'iusto', 'odio',
  'dignissimos', 'ducimus', 'qui', 'blanditiis', 'praesentium', 'voluptatum',
  'deleniti', 'atque', 'corrupti', 'quos', 'dolores', 'et', 'quas', 'molestias',
  'excepturi', 'sint', 'occaecati', 'cupiditate', 'non', 'provident', 'similique',
  'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollitia', 'animi',
  'id', 'est', 'laborum', 'et', 'dolorum', 'fuga', 'et', 'harum', 'quidem',
  'rerum', 'facilis', 'est', 'et', 'expedita', 'distinctio', 'nam', 'libero',
  'tempore', 'cum', 'soluta', 'nobis', 'est', 'eligendi', 'optio', 'cumque',
  'nihil', 'impedit', 'quo', 'minus', 'id', 'quod', 'maxime', 'placeat',
  'facere', 'possimus', 'omnis', 'voluptas', 'assumenda', 'est', 'omnis',
  'dolor', 'repellendus', 'temporibus', 'autem', 'quibusdam', 'et', 'aut',
  'officiis', 'debitis', 'aut', 'rerum', 'necessitatibus', 'saepe', 'eveniet',
  'ut', 'et', 'voluptates', 'repudiandae', 'sint', 'et', 'molestiae', 'non',
  'recusandae', 'itaque', 'earum', 'rerum', 'hic', 'tenetur', 'a', 'sapiente',
  'delectus', 'ut', 'aut', 'reiciendis', 'voluptatibus', 'maiores', 'alias',
  'consequatur', 'aut', 'perferendis', 'doloribus', 'asperiores', 'repellat'
]

export function LoremIpsumGenerator() {
  const [options, setOptions] = useState<LoremOptions>(defaultOptions)
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)

  const generateSentence = useCallback((): string => {
    const sentenceLength = Math.floor(Math.random() * 15) + 8 // 8-22 words
    const words = []
    
    for (let i = 0; i < sentenceLength; i++) {
      const word = loremWords[Math.floor(Math.random() * loremWords.length)]
      words.push(i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word)
    }
    
    return words.join(' ') + '.'
  }, [])

  const generateParagraph = useCallback((): string => {
    const sentenceCount = Math.floor(Math.random() * 4) + 3 // 3-6 sentences
    const sentences = []
    
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    
    return sentences.join(' ')
  }, [generateSentence])

  const generateLoremIpsum = useCallback(() => {
    let result = ''
    
    if (options.type === 'words') {
      const words = []
      for (let i = 0; i < options.count; i++) {
        const word = loremWords[Math.floor(Math.random() * loremWords.length)]
        words.push(i === 0 && options.startWithLorem ? 'Lorem' : word)
      }
      result = words.join(' ')
    } else if (options.type === 'sentences') {
      const sentences = []
      for (let i = 0; i < options.count; i++) {
        const sentence = generateSentence()
        if (i === 0 && options.startWithLorem) {
          sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
        } else {
          sentences.push(sentence)
        }
      }
      result = sentences.join(' ')
    } else { // paragraphs
      const paragraphs = []
      for (let i = 0; i < options.count; i++) {
        const paragraph = generateParagraph()
        if (i === 0 && options.startWithLorem) {
          paragraphs.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.')
        } else {
          paragraphs.push(paragraph)
        }
      }
      result = paragraphs.join('\n\n')
    }

    // Apply formatting
    if (options.includeHTML) {
      if (options.type === 'paragraphs') {
        result = result.split('\n\n').map(p => `<p>${p}</p>`).join('\n')
      } else {
        result = `<p>${result}</p>`
      }
    } else if (options.includeMarkdown) {
      if (options.type === 'paragraphs') {
        result = result.split('\n\n').map(p => p).join('\n\n')
      }
    }

    setGeneratedText(result)
  }, [options, generateSentence, generateParagraph])

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [generatedText])

  const clearAll = useCallback(() => {
    setGeneratedText('')
    setCopied(false)
  }, [])

  const downloadText = useCallback(() => {
    if (!generatedText) return
    
    const extension = options.includeHTML ? 'html' : options.includeMarkdown ? 'md' : 'txt'
    const blob = new Blob([generatedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lorem-ipsum.${extension}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [generatedText, options])

  const updateOption = useCallback((key: keyof LoremOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">Lorem Ipsum Generator</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Lorem Ipsum Generator</h1>
            <p className="text-slate-300">Generate placeholder text for design and development</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={generateLoremIpsum}
            className="btn-primary flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Lorem Ipsum</span>
          </button>
          <button 
            onClick={copyToClipboard}
            disabled={!generatedText}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <button 
            onClick={downloadText}
            disabled={!generatedText}
            className="btn-ghost flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
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

      <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Generation Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type
            </label>
            <select
              value={options.type}
              onChange={(e) => updateOption('type', e.target.value)}
              className="form-input w-full"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Count: {options.count}
            </label>
            <input
              type="range"
              min="1"
              max={options.type === 'paragraphs' ? '20' : options.type === 'sentences' ? '50' : '100'}
              value={options.count}
              onChange={(e) => updateOption('count', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1</span>
              <span>{options.type === 'paragraphs' ? '20' : options.type === 'sentences' ? '50' : '100'}</span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="startWithLorem"
              checked={options.startWithLorem}
              onChange={(e) => updateOption('startWithLorem', e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="startWithLorem" className="ml-2 text-sm text-slate-300">
              Start with "Lorem ipsum"
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeHTML"
                checked={options.includeHTML}
                onChange={(e) => {
                  updateOption('includeHTML', e.target.checked)
                  if (e.target.checked) updateOption('includeMarkdown', false)
                }}
                className="form-checkbox"
              />
              <label htmlFor="includeHTML" className="ml-2 text-sm text-slate-300">
                Include HTML tags
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeMarkdown"
                checked={options.includeMarkdown}
                onChange={(e) => {
                  updateOption('includeMarkdown', e.target.checked)
                  if (e.target.checked) updateOption('includeHTML', false)
                }}
                className="form-checkbox"
              />
              <label htmlFor="includeMarkdown" className="ml-2 text-sm text-slate-300">
                Markdown format
              </label>
            </div>
          </div>
        </div>
      </div>

      {generatedText && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Generated Text
            </h3>
            <div className="text-sm text-slate-400">
              {generatedText.split(/\s+/).length} words
            </div>
          </div>

          <div className="bg-slate-100 text-slate-800 p-6 rounded-xl border border-slate-300">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {generatedText}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📝 About Lorem Ipsum</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div>
            <h4 className="font-medium text-white mb-2">What is Lorem Ipsum?</h4>
            <p className="text-slate-400 mb-3">
              Lorem Ipsum is dummy text used in laying out print, graphic or web designs. 
              It helps designers focus on layout without being distracted by meaningful content.
            </p>
            <p className="text-slate-400">
              The text is derived from sections 1.10.32 and 1.10.33 of Cicero's "De finibus bonorum et malorum" 
              (The Extremes of Good and Evil), written in 45 BC.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white mb-2">Common Uses</h4>
            <ul className="space-y-1 text-slate-400">
              <li>• Website mockups and wireframes</li>
              <li>• Print layout design</li>
              <li>• Typography testing</li>
              <li>• Content placeholder</li>
              <li>• Design presentations</li>
              <li>• Template development</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 