import { Shield, Eye, Database, Lock } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your privacy is our priority. This policy explains how we collect, use, and protect your data.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Last updated: December 24, 2023
          </p>
        </div>

        {/* Privacy Overview */}
        <div className="mb-12 bg-green-500/10 border border-green-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-400" />
            Privacy-First Approach
          </h2>
          <p className="text-gray-300 mb-6">
            DevToolkit is built with privacy as a core principle. Most of our tools process data entirely in your browser, 
            meaning your information never leaves your device.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <Lock className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Local Processing</h3>
              <p className="text-sm text-slate-400">Most tools run entirely in your browser</p>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <Eye className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">No Tracking</h3>
              <p className="text-sm text-slate-400">We don't use tracking cookies or analytics</p>
            </div>
            <div className="text-center p-4 bg-slate-800/30 rounded-lg">
              <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <h3 className="font-semibold text-white mb-1">Minimal Data</h3>
              <p className="text-sm text-slate-400">We collect only what's necessary</p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Information We Collect</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Information You Provide</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Contact Information:</strong> When you contact us through our forms or email</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>API Usage:</strong> When you use our API, we collect usage statistics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Feedback:</strong> Bug reports, feature requests, and other feedback</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Information We Don't Collect</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Tool Data:</strong> Files, code, or text you process with our browser-based tools</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Personal Browsing:</strong> We don't track your browsing behavior</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span><strong>Third-party Cookies:</strong> We don't use tracking or advertising cookies</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">How We Use Your Information</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To provide and improve our services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To respond to your inquiries and provide support</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To monitor API usage and prevent abuse</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>To comply with legal obligations</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Data Security</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Encryption:</strong> All data transmission uses HTTPS encryption</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Access Control:</strong> Limited access to personal data on a need-to-know basis</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Data Minimization:</strong> We collect and store only necessary information</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Regular Audits:</strong> Periodic security reviews and updates</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Third-Party Services</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                We use minimal third-party services and ensure they meet our privacy standards:
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Hosting:</strong> Our website is hosted on secure, privacy-compliant infrastructure</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Email:</strong> Contact form submissions are processed through secure email services</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>CDN:</strong> Static assets are served through privacy-focused content delivery networks</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Your Rights</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">You have the following rights regarding your personal data:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Access & Correction</h3>
                  <p className="text-sm text-slate-400">Request access to or correction of your personal data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Deletion</h3>
                  <p className="text-sm text-slate-400">Request deletion of your personal data</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Portability</h3>
                  <p className="text-sm text-slate-400">Request a copy of your data in a portable format</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Objection</h3>
                  <p className="text-sm text-slate-400">Object to processing of your personal data</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> privacy@devtoolkit.com</p>
                <p><strong>Subject Line:</strong> Privacy Policy Inquiry</p>
              </div>
            </div>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Changes to This Policy</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
                this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 