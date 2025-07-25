# DevToolkit Design System


## Overview
This document outlines the design system and component patterns used throughout DevToolkit to ensure consistency across all tools and formatters.

## Code Formatter Layout Pattern

All code formatters should follow this consistent layout pattern established by the JavaScript and Python formatters:

### 1. Page Structure
```tsx
import { FormatterComponent } from '@/components/tools/FormatterComponent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Language Formatter - Format & Beautify Code Online | DevToolkit',
  description: 'Free online formatter description...',
  keywords: 'formatter keywords...',
}

export default function FormatterPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Language Formatter
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Description text...
          </p>
        </div>
        
        <FormatterComponent />
      </div>
    </div>
  )
}
```

### 2. Component Layout Structure

Each formatter component should follow this exact structure:

1. **Breadcrumb Navigation**
2. **Header with Icon & Title**
3. **Quick Action Buttons**
4. **Collapsible Settings Panel**
5. **Status Messages**
6. **Two-Column Layout (Input/Output)**
7. **Help Section**

### 3. Button Classes

Use these predefined button classes for consistency:

- **`btn-primary`** - Main action buttons (Format Code, Process, etc.)
- **`btn-secondary`** - Secondary actions (Minify, etc.)
- **`btn-ghost`** - Subtle actions (Load Sample, Settings, Clear All, Copy, Download, Upload)

### 4. Button Examples

```tsx
// Primary action
<button className="btn-primary flex items-center space-x-2">
  <Play className="w-4 h-4" />
  <span>Format Code</span>
</button>

// Secondary action  
<button className="btn-secondary flex items-center space-x-2">
  <Settings className="w-4 h-4" />
  <span>Minify Code</span>
</button>

// Ghost actions
<button className="btn-ghost flex items-center space-x-2">
  <Info className="w-4 h-4" />
  <span>Load Sample</span>
</button>

<button className="btn-ghost text-sm">
  <Copy className="w-4 h-4" />
</button>
```

### 5. Processing States

All formatters should implement these processing states:

```tsx
interface ProcessingState {
  isProcessing: boolean
  hasError: boolean
  errorMessage?: string
  isSuccess: boolean
}
```

### 6. Settings Panel

Settings should use this consistent structure:

```tsx
{showSettings && (
  <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8 animate-slide-in-up">
    <h3 className="text-lg font-semibold text-white mb-4">Formatting Options</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Settings content */}
    </div>
  </div>
)}
```

### 7. Input/Output Layout

```tsx
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Input Section */}
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">Input</h2>
      <div className="flex items-center space-x-2">
        <button className="btn-ghost text-sm" title="Upload file">
          <Upload className="w-4 h-4" />
        </button>
      </div>
    </div>
    
    <textarea
      className="form-textarea w-full h-96 font-mono text-sm"
      // ... other props
    />
    
    <div className="flex flex-wrap gap-3">
      {/* Action buttons */}
    </div>
  </div>

  {/* Output Section */}
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-white">Output</h2>
      <div className="flex items-center space-x-2">
        {/* Copy & Download buttons */}
      </div>
    </div>
    
    <div className="relative">
      <textarea
        readOnly
        className="form-textarea w-full h-96 font-mono text-sm resize-none"
        // ... other props
      />
      
      {/* Processing overlay */}
    </div>
    
    {/* Stats */}
  </div>
</div>
```

### 8. Status Messages

Use these consistent status message patterns:

```tsx
{/* Error State */}
{processingState.hasError && (
  <div className="error-state mb-6 flex items-center space-x-3 animate-slide-in-up">
    <AlertCircle className="w-5 h-5 flex-shrink-0" />
    <div>
      <p className="font-medium">Error processing code</p>
      <p className="text-sm opacity-90">{processingState.errorMessage}</p>
    </div>
  </div>
)}

{/* Success State */}
{processingState.isSuccess && (
  <div className="success-state mb-6 flex items-center space-x-3 animate-slide-in-up">
    <CheckCircle className="w-5 h-5 flex-shrink-0" />
    <span>Code processed successfully!</span>
  </div>
)}
```

### 9. Help Section

```tsx
<div className="mt-12 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
  <h3 className="text-lg font-semibold text-white mb-4">💡 Pro Tips</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
    <div>
      <h4 className="font-medium text-white mb-2">Section Title</h4>
      <ul className="space-y-1 text-slate-400">
        <li>• Feature description</li>
        <li>• Another feature</li>
      </ul>
    </div>
  </div>
</div>
```

### 10. Color Scheme

Each formatter should use a unique gradient for its icon but maintain consistent layout:

- **JavaScript**: `from-yellow-500 to-orange-500`
- **Python**: `from-blue-500 to-green-500`
- **TypeScript**: `from-blue-500 to-cyan-500`
- **Java**: `from-red-500 to-orange-500`
- **C++**: `from-gray-500 to-blue-500`
- **And so on...**

## General UI Consistency Rules

1. **Always use the same breadcrumb pattern**
2. **Icon + title layout in headers**
3. **Consistent button sizing and spacing**
4. **Same animation classes (animate-slide-in-up)**
5. **Consistent form styling (form-input, form-textarea)**
6. **Same color patterns for status states**
7. **Consistent typography scale**

## Future Formatter Implementation

When creating new formatters:

1. Copy the pattern from `JavaScriptFormatter` or `PythonFormatter`
2. Update the language-specific logic
3. Maintain all the same UI components and layout
4. Use appropriate color scheme for the language
5. Update metadata and descriptions appropriately
6. Test all button states and interactions

This ensures a consistent user experience across all DevToolkit formatters while maintaining the professional look and feel of the application. 