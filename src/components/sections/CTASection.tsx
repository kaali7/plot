import { useNavigate } from 'react-router-dom';

interface CTASectionProps {
  id?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ id }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    navigate('/login');
  };

  return (
    <section id={id} className="py-32 relative overflow-hidden bg-surface-dark">
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-16 md:p-24 relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold mb-8 text-white tracking-tight">
            Ready to Transform Your <span className="text-primary font-serif italic pr-2">Storytelling</span> Process?
          </h2>
          <p className="text-xl md:text-2xl text-editor-text-muted mb-12 max-w-3xl mx-auto font-sans leading-relaxed">
            Join thousands of writers who have moved from messy drafts to polished, structured narratives with Plot.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-primary hover:bg-white text-white hover:text-black font-sans font-bold rounded-2xl transition-all duration-300 px-10 py-5 text-lg shadow-magenta-glow hover:scale-105"
            >
              Start Writing Free
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans font-bold rounded-2xl transition-all duration-300 px-10 py-5 text-lg backdrop-blur-sm hover:scale-105"
            >
              Log In to Workspace
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;