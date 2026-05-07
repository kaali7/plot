
interface Feature {
  icon: string;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: '📊',
    title: 'Unified Story Overview',
    description: 'Organize themes, characters, conflicts, and scenes in a single structured screen with resource attachments.'
  },
  {
    icon: '👥',
    title: 'Character Management',
    description: 'Create detailed character profiles with motivations, traits, relationships, and character arcs.'
  },
  {
    icon: '🎬',
    title: 'Scene Builder',
    description: 'Build scenes with settings, dialogue, actions, and outcomes, complete with character assignment and visual resources.'
  },
  {
    icon: '✍️',
    title: 'Writing Mode',
    description: 'Convert your structured story into narrative format in a clean, distraction-free editor.'
  }
];

interface FeaturesSectionProps {
  id?: string;
}

const FeaturesSection = ({ id }: FeaturesSectionProps) => {
  return (
    <section id={id} className="py-32 bg-surface-dark relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none transform -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none transform -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-20">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white tracking-tight">
            How <span className="text-primary font-serif italic pr-2">Plot</span> Works
          </h2>
          <p className="text-editor-text-muted font-sans text-lg max-w-2xl mx-auto">
            Everything you need to turn chaotic inspiration into a perfectly structured manuscript.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-2 shadow-glass hover:shadow-primary-glow-lg overflow-hidden"
            >
              {/* Subtle top border glow on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="mb-8 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors duration-300">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-sans font-bold mb-4 text-white group-hover:text-primary transition-colors duration-300 tracking-tight">{feature.title}</h3>
              <p className="text-editor-text-muted font-sans text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;