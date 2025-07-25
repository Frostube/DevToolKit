# DevToolKit 🛠️

A comprehensive collection of developer tools and utilities built with Next.js, TypeScript, and Tailwind CSS. Streamline your development workflow with powerful online tools for code formatting, image processing, data conversion, and more.

![DevToolKit](https://img.shields.io/badge/DevToolKit-Developer%20Tools-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14.0.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎨 **Code Formatters**
- **JavaScript Formatter** - Beautify and minify JavaScript code
- **TypeScript Formatter** - Format TypeScript with proper syntax highlighting
- **Python Formatter** - Clean and format Python code
- **CSS Formatter** - Beautify CSS with customizable indentation
- **HTML Formatter** - Format HTML with proper structure

### 🖼️ **Image Tools**
- **Image Compressor** - Reduce image file sizes while maintaining quality
- **Image Converter** - Convert between various image formats (PNG, JPG, WebP, etc.)
- **Image Resizer** - Resize images to specific dimensions
- **Image Cropper** - Crop images with precision
- **Image Watermark** - Add watermarks to images
- **WebP Converter** - Convert images to WebP format for better web performance
- **Image Optimizer** - Optimize images for web use

### 🔄 **Data Converters**
- **Base64 Converter** - Encode/decode Base64 strings and files
- **JSON to CSV Converter** - Convert JSON data to CSV format
- **YAML to JSON Converter** - Convert between YAML and JSON formats
- **URL Encoder/Decoder** - Encode and decode URLs

### 🛠️ **Developer Utilities**
- **UUID Generator** - Generate unique identifiers
- **Color Tools** - Color picker and palette generator

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Frostube/DevToolKit.git
   cd DevToolKit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
DevToolKit/
├── app/                    # Next.js app directory
│   ├── tools/             # Individual tool pages
│   │   ├── js-formatter/
│   │   ├── typescript-formatter/
│   │   ├── python-formatter/
│   │   ├── css-formatter/
│   │   ├── html-formatter/
│   │   ├── image-compressor/
│   │   ├── image-converter/
│   │   ├── image-resizer/
│   │   ├── image-cropper/
│   │   ├── image-watermark/
│   │   ├── base64/
│   │   ├── json-csv/
│   │   ├── yaml-json/
│   │   ├── url-encoder/
│   │   └── uuid-generator/
│   ├── color-tools/       # Color utilities
│   ├── converters/        # Data conversion tools
│   └── utilities/         # General utilities
├── components/            # Reusable React components
│   ├── tools/            # Tool-specific components
│   ├── Navigation.tsx    # Main navigation
│   ├── Hero.tsx          # Landing page hero
│   └── Footer.tsx        # Site footer
├── public/               # Static assets
└── backend-requirements.txt  # Python backend dependencies
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Libraries
- **js-beautify** - Code formatting
- **file-saver** - File download functionality
- **jszip** - ZIP file handling

## 🎨 Design System

DevToolKit follows a consistent design system with:

- **Dark theme** optimized for developer workflows
- **Responsive design** that works on all devices
- **Accessible components** following WCAG guidelines
- **Consistent spacing** and typography
- **Interactive feedback** with loading states and animations

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for detailed design guidelines.

## 🔧 Tool Categories

### Code Formatters
All formatters support:
- **Syntax highlighting** with language-specific themes
- **Customizable settings** (indentation, line wrapping)
- **Minification** options
- **Sample code** loading
- **Download** formatted code
- **Copy to clipboard** functionality

### Image Tools
All image tools feature:
- **Drag & drop** file upload
- **Preview** functionality
- **Batch processing** capabilities
- **Quality settings** adjustment
- **Download** processed images
- **Format conversion** options

### Data Converters
All converters include:
- **Real-time conversion** as you type
- **Validation** with error messages
- **Sample data** for testing
- **Export options** (download, copy)
- **Format detection** and auto-conversion

## 🌟 Key Features

- **⚡ Fast Performance** - Built with Next.js for optimal speed
- **📱 Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **🎨 Modern UI** - Clean, intuitive interface with smooth animations
- **🔒 Privacy First** - All processing happens client-side
- **📦 No Dependencies** - No external API calls required
- **🔄 Real-time Processing** - Instant results as you type
- **💾 Offline Capable** - Works without internet connection
- **🎯 Developer Focused** - Built by developers, for developers

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Add TypeScript types for all new components
- Include proper error handling
- Write responsive, accessible components
- Test on multiple browsers and devices

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Lucide** for the beautiful icons
- **Framer Motion** for smooth animations
- **js-beautify** for code formatting capabilities

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Frostube/DevToolKit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Frostube/DevToolKit/discussions)
- **Email**: frostube2000@gmail.com

---

**Made with ❤️ by Frostube**

[![GitHub stars](https://img.shields.io/github/stars/Frostube/DevToolKit?style=social)](https://github.com/Frostube/DevToolKit/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/Frostube/DevToolKit?style=social)](https://github.com/Frostube/DevToolKit/network)
[![GitHub issues](https://img.shields.io/github/issues/Frostube/DevToolKit)](https://github.com/Frostube/DevToolKit/issues)
[![GitHub license](https://img.shields.io/github/license/Frostube/DevToolKit)](https://github.com/Frostube/DevToolKit/blob/main/LICENSE) 