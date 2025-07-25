export function SEOContent() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Choose DevToolkit?
          </h2>
          <div className="prose prose-lg text-gray-300 max-w-none">
            <p className="mb-6">
              DevToolkit is the ultimate online toolkit for developers, offering a comprehensive suite of 
              <strong className="text-white"> free online tools</strong> designed to streamline your development workflow. 
              Our platform provides everything from <strong className="text-white">JavaScript formatters</strong> and 
              <strong className="text-white"> CSS beautifiers</strong> to advanced 
              <strong className="text-white"> file converters</strong> and <strong className="text-white">image optimization tools</strong>.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Code Formatting & Beautification</h3>
                <p>
                  Transform messy code into beautifully formatted, readable code with our advanced formatters. 
                  Support for JavaScript, CSS, HTML, JSON, XML, and more. Our 
                  <strong className="text-white"> online code formatter</strong> tools use industry-standard 
                  formatting rules to ensure your code follows best practices.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">File Conversion Made Easy</h3>
                <p>
                  Convert between different file formats instantly with our 
                  <strong className="text-white"> online file converters</strong>. From JSON to CSV, 
                  YAML to JSON, XML transformations, and more. All conversions happen securely in your 
                  browser - no file uploads required.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Image Processing Tools</h3>
                <p>
                  Optimize, resize, and convert images with our powerful 
                  <strong className="text-white"> image tools</strong>. Compress images without quality loss, 
                  convert between formats (JPG, PNG, WebP), and resize images for web optimization.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Developer Utilities</h3>
                <p>
                  Generate UUIDs, create secure passwords, encode/decode Base64, test regular expressions, 
                  and much more. Our <strong className="text-white">developer utilities</strong> cover all 
                  the common tasks you need in your daily development work.
                </p>
              </div>
            </div>
            
            <p className="mt-8 text-center">
              All tools are <strong className="text-white">completely free</strong>, work offline in your browser, 
              and respect your privacy. No registration required, no file uploads to our servers - everything 
              processes locally for maximum security and speed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 