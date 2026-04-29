import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get Started clicked');
    navigate('/signup');
  };

  const handleLearnMore = () => {
    console.log('Learn More clicked');
    // For now, navigate to dashboard to show what Plot offers
    navigate('/dashboard');
  };

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 pt-24 pb-24 bg-gradient-to-r from-black via-[#2a003f] to-[#5a007a]">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white">
          Transform Your Ideas Into Structured Stories
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl">
          Plot is a web-based storytelling workspace that helps writers organize themes, characters, conflicts, and scenes while attaching resources for deeper storytelling.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={handleGetStarted}
            className="bg-primary hover:bg-accent text-white font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent px-8 py-4 text-lg"
          >
            Get Started Free
          </button>
          <button 
            onClick={handleLearnMore}
            className="border border-primary/30 hover:bg-primary/10 text-primary font-medium rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 px-8 py-4 text-lg"
          >
            Learn More
          </button>
        </div>
      </div>
      
      {/* Optional: decorative elements or illustrations */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black via-transparent"></div>
    </section>
  );
};

export default HeroSection;