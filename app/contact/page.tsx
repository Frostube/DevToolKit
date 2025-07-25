import { Mail, MessageSquare, Github, Twitter, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-xl">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions, suggestions, or just want to say hi? We'd love to hear from you. 
            Choose the best way to reach out below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input w-full"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input w-full"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="form-input w-full"
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="general">General Question</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="api">API Support</option>
                  <option value="business">Business Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="form-textarea w-full"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                <Mail className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Other Ways to Reach Us</h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500/20 p-3 rounded-lg mr-4">
                      <Mail className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Email Us</h3>
                      <p className="text-slate-400 text-sm">For general inquiries and support</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-slate-400 text-sm">General: </span>
                      <Link href="mailto:hello@devtoolkit.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        hello@devtoolkit.com
                      </Link>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">API Support: </span>
                      <Link href="mailto:api@devtoolkit.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        api@devtoolkit.com
                      </Link>
                    </div>
                    <div>
                      <span className="text-slate-400 text-sm">Business: </span>
                      <Link href="mailto:business@devtoolkit.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                        business@devtoolkit.com
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-500/20 p-3 rounded-lg mr-4">
                      <MessageSquare className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Social Media</h3>
                      <p className="text-slate-400 text-sm">Follow us for updates and tips</p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link 
                      href="https://github.com/devtoolkit" 
                      className="text-gray-400 hover:text-white transition-colors p-2 bg-slate-700/50 rounded-lg"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </Link>
                    <Link 
                      href="https://twitter.com/devtoolkit" 
                      className="text-gray-400 hover:text-white transition-colors p-2 bg-slate-700/50 rounded-lg"
                      aria-label="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500/20 p-3 rounded-lg mr-4">
                      <Clock className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Response Time</h3>
                      <p className="text-slate-400 text-sm">We typically respond within</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">General inquiries:</span>
                      <span className="text-green-400">24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bug reports:</span>
                      <span className="text-green-400">12 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">API support:</span>
                      <span className="text-green-400">6 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Business inquiries:</span>
                      <span className="text-green-400">48 hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-2">Can I request a new tool?</h3>
              <p className="text-slate-400 text-sm">
                Absolutely! We love hearing from our users. Send us your tool ideas and we'll consider them for our roadmap.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Is DevToolkit open source?</h3>
              <p className="text-slate-400 text-sm">
                Yes! DevToolkit is open source and available on GitHub. Contributions are welcome.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Do you offer enterprise support?</h3>
              <p className="text-slate-400 text-sm">
                Yes, we offer dedicated enterprise support. Contact our business team for more information.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">How secure are the tools?</h3>
              <p className="text-slate-400 text-sm">
                All processing happens in your browser. Your data never leaves your device, ensuring maximum privacy and security.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 