import HeroSection from '@/components/sections/HeroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import VisualsSection from '@/components/sections/VisualsSection';
import CTASection from '@/components/sections/CTASection';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection id="features" />
      <VisualsSection id="visuals" />
      <CTASection id="cta" />
      <Footer />
    </>
  );
}

export default App;