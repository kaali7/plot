import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  const handleLearnMore = () => {
    // For now, navigate to dashboard to show what Plot offers
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 pt-32 pb-24 overflow-hidden bg-surface-dark">
      {/* Soft Glowing Ambient Background */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-12 md:p-24 text-center space-y-10 relative overflow-hidden group">
          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none"></div>
          
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 rounded-full bg-primary shadow-primary-glow animate-pulse"></span>
            <span className="text-xs font-sans font-bold text-primary uppercase tracking-widest">Plot Studio 2.0</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-bold tracking-tight text-white leading-tight">
            Transform Ideas Into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50 font-serif italic">Structured Stories</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-editor-text-muted font-sans font-medium max-w-3xl mx-auto leading-relaxed">
            A sleek, glassmorphic workspace designed to organize themes, characters, conflicts, and scenes seamlessly into narrative form.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
            <button 
              onClick={handleGetStarted}
              className="bg-primary hover:bg-white text-white hover:text-black font-sans font-bold rounded-2xl transition-all duration-300 px-10 py-5 text-lg shadow-primary-glow hover:scale-105"
            >
              Start Writing Free
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-sans font-bold rounded-2xl transition-all duration-300 px-10 py-5 text-lg backdrop-blur-sm hover:scale-105"
            >
              Explore Workspace
            </button>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-surface-dark to-transparent pointer-events-none"></div>
    </section>
  );
};

export default HeroSection;