import Button from '@/components/ui/Button';
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
    <section id={id} className="py-20 bg-gradient-to-r from-black via-[#2a003f] to-[#5a007a]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">
          Ready to Transform Your Storytelling Process?
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of writers who have moved from messy drafts to polished stories with Plot's structured approach.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button variant="primary" size="large" onClick={handleGetStarted}>
            Get Started Free
          </Button>
          <Button variant="outline" size="large" onClick={handleLearnMore}>
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;