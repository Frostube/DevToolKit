import { Code, Zap, Key, Shield, Copy, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            API Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Automate your workflow with our REST API. Process files, format code, and convert data programmatically.
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Get Your API Key</h3>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Your API Key:</span>
                  <button className="text-blue-400 hover:text-blue-300 transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <code className="block bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 text-green-400 font-mono text-sm">
                  sk_test_1234567890abcdef
                </code>
                <p className="text-sm text-gray-400 mt-3">
                  Free tier: 1,000 requests/month. No credit card required.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Make Your First Request</h3>
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <pre className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">
{`curl -X POST https://api.devtoolkit.com/v1/format/js \\
  -H "Authorization: Bearer sk_test_..." \\
  -H "Content-Type: application/json" \\
  -d '{"code": "function hello(){console.log(\\"world\\");}"}'`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">API Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="bg-blue-500/20 p-3 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">
                Sub-100ms response times with global CDN. Same performance as our web tools.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="bg-green-500/20 p-3 rounded-lg w-fit mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Secure & Private</h3>
              <p className="text-gray-400 text-sm">
                HTTPS only, no data logging, automatic request encryption. Your code stays private.
              </p>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                <Key className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Easy Integration</h3>
              <p className="text-gray-400 text-sm">
                RESTful API with JSON. SDKs for Python, Node.js, and more coming soon.
              </p>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Available Endpoints</h2>
          <div className="space-y-6">
            {/* JavaScript Formatter */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-green-900 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-blue-400 font-mono">/v1/format/js</code>
                </div>
                <span className="text-green-400 text-sm">Available</span>
              </div>
              <p className="text-gray-400 mb-4">Format and beautify JavaScript code</p>
              <details className="text-sm">
                <summary className="text-white cursor-pointer hover:text-blue-400 transition-colors">
                  View example →
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-gray-400 mb-2">Request:</p>
                    <pre className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 overflow-x-auto">
                      <code className="text-gray-300">
{`{
  "code": "function hello(){console.log('world');}",
  "options": {
    "indent_size": 2,
    "preserve_newlines": true
  }
}`}
                      </code>
                    </pre>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-2">Response:</p>
                    <pre className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3 overflow-x-auto">
                      <code className="text-gray-300">
{`{
  "formatted_code": "function hello() {\\n  console.log('world');\\n}",
  "success": true
}`}
                      </code>
                    </pre>
                  </div>
                </div>
              </details>
            </div>

            {/* JSON to CSV */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-green-500 text-green-900 px-2 py-1 rounded text-xs font-bold">POST</span>
                  <code className="text-blue-400 font-mono">/v1/convert/json-to-csv</code>
                </div>
                <span className="text-yellow-400 text-sm">Coming Soon</span>
              </div>
              <p className="text-gray-400">Convert JSON data to CSV format with intelligent field mapping</p>
            </div>

            {/* More endpoints */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold text-white mb-3">More Endpoints Coming Soon</h3>
                <p className="text-gray-400 mb-6">
                  We're rapidly expanding our API coverage. All web tools will have corresponding API endpoints.
                </p>
                <Link href="/contact" className="btn-primary">
                  <span>Request an Endpoint</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Free</h3>
                <div className="text-3xl font-bold text-white mb-1">$0</div>
                <div className="text-sm text-gray-400">forever</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                  1,000 requests/month
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                  All available endpoints
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                  Community support
                </li>
              </ul>
              <button className="btn-secondary w-full">Get Started</button>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-6 relative">
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">
                Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                <div className="text-3xl font-bold text-white mb-1">$19</div>
                <div className="text-sm text-gray-400">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                  50,000 requests/month
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                  Priority support
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3"></div>
                  Advanced analytics
                </li>
              </ul>
              <button className="btn-primary w-full">Coming Soon</button>
            </div>

            {/* Enterprise */}
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-white mb-1">Custom</div>
                <div className="text-sm text-gray-400">pricing</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Unlimited requests
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  On-premise deployment
                </li>
                <li className="flex items-center text-gray-300">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3"></div>
                  Dedicated support
                </li>
              </ul>
              <Link href="/contact" className="btn-secondary w-full block text-center">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Need Help?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Our API is designed to be intuitive, but we're here if you need assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="mailto:api@devtoolkit.com" className="btn-primary">
              <span>Email Support</span>
            </Link>
            <Link href="https://github.com/devtoolkit/api-examples" className="btn-secondary">
              <span>Code Examples</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 