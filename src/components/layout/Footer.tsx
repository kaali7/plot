
const Footer = () => {
  return (
    <footer className="bg-surface py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Plot</h3>
            <p className="text-gray-400">
              A web-based storytelling workspace designed to help writers transform raw ideas into structured, emotionally rich narratives.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-left">
              <li className="text-gray-300">Unified Story Overview</li>
              <li className="text-gray-300">Character Management</li>
              <li className="text-gray-300">Scene Builder</li>
              <li className="text-gray-300">Writing Mode</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-2 text-left">
              <li className="text-gray-300">Documentation</li>
              <li className="text-gray-300">Blog</li>
              <li className="text-gray-300">Community</li>
              <li className="text-gray-300">Support</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-surface/50">
          <p className="text-gray-500 text-center">
            © 2026 Plot. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;