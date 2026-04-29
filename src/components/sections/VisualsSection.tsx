
interface VisualsSectionProps {
  id?: string;
}

const VisualsSection = ({ id }: VisualsSectionProps) => {
  // Placeholder images - in a real app, these would be actual screenshots
  const visuals = [
    {
      title: 'Story Overview',
      description: 'See your entire story structure at a glance',
      // Using placeholder URLs - in production, replace with actual images
      imageUrl: 'https://picsum.photos/400/300?image=10'
    },
    {
      title: 'Character Cards',
      description: 'Manage and visualize your characters',
      imageUrl: 'https://picsum.photos/400/300?image=20'
    },
    {
      title: 'Scene Builder',
      description: 'Build scenes with rich details and resources',
      imageUrl: 'https://picsum.photos/400/300?image=30'
    },
    {
      title: 'Writing Mode',
      description: 'Write your story in a distraction-free environment',
      imageUrl: 'https://picsum.photos/400/300?image=40'
    }
  ];

  return (
    <section id={id} className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
          See Plot in Action
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {visuals.map((visual, index) => (
            <div key={index} className="bg-white/5 rounded-xl p-6 backdrop-blur-sm">
              <img 
                src={visual.imageUrl} 
                alt={visual.title} 
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-3 text-white">{visual.title}</h3>
              <p className="text-gray-300">{visual.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisualsSection;