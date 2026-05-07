
const Footer = () => {
  return (
    <footer className="bg-background pt-20 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 text-left mb-16">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-primary shadow-primary-glow"></span>
              <h3 className="text-2xl font-serif font-bold text-white tracking-tight italic">Plot</h3>
            </div>
            <p className="text-editor-text-muted font-sans leading-relaxed max-w-sm">
              A premium, glassmorphic storytelling workspace designed to help writers transform raw ideas into structured, emotionally rich narratives.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-sans font-bold mb-6 text-white uppercase tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Unified Overview</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Character Forge</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Chronicle Grid</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Manuscript Mode</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-sans font-bold mb-6 text-white uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Documentation</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Writer's Blog</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Community</a></li>
              <li><a href="#" className="text-editor-text-muted hover:text-primary transition-colors font-sans text-sm">Support</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-editor-text-muted font-sans text-sm">
            © 2026 Plot Studio. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-editor-text-muted hover:text-white transition-colors text-sm font-sans">Privacy Policy</a>
            <a href="#" className="text-editor-text-muted hover:text-white transition-colors text-sm font-sans">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;