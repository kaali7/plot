
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
    <section id={id} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white">
          How Plot Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="mb-6">
                <span className="text-4xl">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;