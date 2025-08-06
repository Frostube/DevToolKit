'use client'

import { useState } from 'react'
import { Copy, Play, RotateCcw, Settings, Fingerprint } from 'lucide-react'
import Link from 'next/link'

function generateUUIDv4() {
  // RFC4122 version 4 compliant
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function UUIDGenerator() {
  const [uuids, setUUIDs] = useState<string[]>([])
  const [version, setVersion] = useState<'v4'>('v4')
  const [quantity, setQuantity] = useState(5)
  const [showSettings, setShowSettings] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = () => {
    let newUUIDs: string[] = []
    if (version === 'v4') {
      newUUIDs = Array.from({ length: quantity }, generateUUIDv4)
    }
    setUUIDs(newUUIDs)
    setCopied(false)
  }

  const copyAll = () => {
    if (uuids.length === 0) return
    navigator.clipboard.writeText(uuids.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setUUIDs([])
    setCopied(false)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-8">
        <Link href="/#tool-categories" className="breadcrumb-item hover:text-slate-200 transition-colors">Tools</Link>
        <span className="breadcrumb-separator">/</span>
        <Link href="/generators" className="breadcrumb-item hover:text-slate-200 transition-colors">Generators</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="text-white">UUID Generator</span>
      </nav>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-lg">
            <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">UUID Generator</h1>
            <p className="text-slate-300">Generate random UUIDs (v4) for databases and applications</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={generate} className="btn-primary flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Generate</span>
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className={`btn-ghost flex items-center space-x-2 ${showSettings ? 'bg-slate-700/50' : ''}`}> 
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button onClick={clearAll} className="btn-ghost flex items-center space-x-2 text-red-300 hover:text-red-200">
            <RotateCcw className="w-4 h-4" />
            <span>Clear All</span>
          </button>
          <button onClick={copyAll} disabled={uuids.length === 0} className="btn-secondary flex items-center space-x-2">
            <Copy className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy All'}</span>
          </button>
        </div>
      </div>
      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
          <h3 className="text-lg font-semibold text-white mb-4">Generator Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Version</label>
              <select value={version} onChange={e => setVersion(e.target.value as any)} className="form-input w-full">
                <option value="v4">UUID v4 (random)</option>
                {/* <option value="v1">UUID v1 (timestamp+MAC) - not supported in browser</option> */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Quantity</label>
              <input
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={e => setQuantity(Math.max(1, Math.min(100, Number(e.target.value))))}
                className="form-input w-full"
              />
            </div>
          </div>
        </div>
      )}
      {/* UUIDs Output */}
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Generated UUIDs</h3>
        {uuids.length === 0 ? (
          <div className="text-slate-400">No UUIDs generated yet.</div>
        ) : (
          <ul className="space-y-2">
            {uuids.map((uuid, idx) => (
              <li key={idx} className="bg-slate-900/40 rounded px-3 py-2 font-mono text-green-300 text-sm flex items-center justify-between">
                <span>{uuid}</span>
                <button
                  onClick={() => {navigator.clipboard.writeText(uuid); setCopied(true); setTimeout(() => setCopied(false), 2000)}}
                  className="ml-2 btn-ghost text-xs"
                  title="Copy UUID"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Help Section */}
      <div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💡 About UUIDs</h3>
        <div className="text-slate-300 text-sm space-y-2">
          <p>UUIDs (Universally Unique Identifiers) are 128-bit values used to uniquely identify information in computer systems. UUID v4 is based on random numbers and is suitable for most use cases.</p>
          <p>All UUIDs generated here are RFC4122 v4 compliant and can be used in databases, APIs, and applications.</p>
        </div>
      </div>
    </div>
  )
} 