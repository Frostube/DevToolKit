import { FileText, AlertTriangle, Shield, Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using DevToolkit. By using our service, you agree to these terms.
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Last updated: December 24, 2023
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-12 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-white mb-2">Important Notice</h2>
              <p className="text-gray-300">
                By accessing and using DevToolkit, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                These Terms of Service ("Terms") govern your use of DevToolkit ("Service") operated by DevToolkit ("us", "we", or "our").
              </p>
              <p className="text-gray-300">
                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
                These Terms apply to all visitors, users and others who access or use the Service.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">2. Description of Service</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                DevToolkit provides a collection of online developer tools including but not limited to:
              </p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Code formatters and beautifiers</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>File format converters</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Image processing tools</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Data generators and utilities</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>API services for automation</span>
                </li>
              </ul>
              <p className="text-gray-300">
                Most tools process data locally in your browser for privacy and security.
              </p>
            </div>
          </section>

          {/* User Accounts and API */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">3. User Accounts and API Usage</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">3.1 API Access</h3>
              <p className="text-gray-300 mb-4">
                Some features require API access. You are responsible for maintaining the confidentiality of your API keys and for all activities that occur under your account.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-3">3.2 Usage Limits</h3>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Free tier: 1,000 API requests per month</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Rate limits apply to prevent abuse</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Exceeding limits may result in temporary suspension</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">4. Acceptable Use Policy</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">You agree not to use the Service to:</p>
              <ul className="space-y-2 text-gray-300 mb-4">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Violate any applicable laws or regulations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Transmit malicious code, viruses, or harmful content</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Attempt to gain unauthorized access to our systems</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Reverse engineer or attempt to extract source code</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use the service to process illegal or harmful content</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Abuse or overload our systems beyond reasonable use</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">5. Privacy and Data Handling</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-start mb-4">
                <Shield className="w-5 h-5 text-green-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-white mb-2">Local Processing</h3>
                  <p className="text-gray-300">
                    Most of our tools process your data locally in your browser. This means your files, code, and data never leave your device.
                  </p>
                </div>
              </div>
              <p className="text-gray-300 mb-3">
                For tools that require server processing (primarily API endpoints), we:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Process data only as necessary to provide the service</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Do not store or log the content you process</span>
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Use encryption for all data transmission</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">6. Disclaimers and Limitations</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">6.1 Service Availability</h3>
              <p className="text-gray-300 mb-4">
                We strive to maintain high availability but cannot guarantee uninterrupted service. The service is provided "as is" without warranties of any kind.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-3">6.2 Data Accuracy</h3>
              <p className="text-gray-300 mb-4">
                While we strive for accuracy, we do not guarantee that our tools will produce error-free results. Always verify important outputs.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-3">6.3 Limitation of Liability</h3>
              <p className="text-gray-300">
                In no event shall DevToolkit be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">7. Intellectual Property</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-3">7.1 Our Content</h3>
              <p className="text-gray-300 mb-4">
                The Service and its original content, features, and functionality are owned by DevToolkit and are protected by copyright, trademark, and other laws.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-3">7.2 Your Content</h3>
              <p className="text-gray-300 mb-4">
                You retain all rights to any content you process through our tools. We do not claim ownership of your data.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-3">7.3 Open Source</h3>
              <p className="text-gray-300">
                DevToolkit is open source software. You may contribute to or use our code according to the terms of our open source license.
              </p>
            </div>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">8. Termination</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your access immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
              <p className="text-gray-300">
                Upon termination, your right to use the Service will cease immediately. All provisions of the Terms shall survive termination.
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">9. Governing Law</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which DevToolkit operates, 
                without regard to its conflict of law provisions. Any disputes shall be resolved through appropriate legal channels.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">10. Changes to Terms</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
              <p className="text-gray-300">
                What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">11. Contact Information</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-300">
                <p><strong>Email:</strong> legal@devtoolkit.com</p>
                <p><strong>Subject Line:</strong> Terms of Service Inquiry</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 