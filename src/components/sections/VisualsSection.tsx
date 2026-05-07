
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
    <section id={id} className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-sans font-bold text-center mb-16 text-white tracking-tight">
          See <span className="text-primary font-serif italic">Plot</span> in Action
        </h2>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {visuals.map((visual, index) => (
            <div key={index} className="group relative bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-2 shadow-glass hover:shadow-primary-glow-lg">
              {/* Subtle top border glow on hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[2rem]"></div>
              
              <div className="rounded-[1.5rem] overflow-hidden mb-6 relative">
                 <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-500 z-10"></div>
                 <img 
                   src={visual.imageUrl} 
                   alt={visual.title} 
                   className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700"
                 />
              </div>
              <h3 className="text-xl font-sans font-bold mb-3 text-white group-hover:text-primary transition-colors duration-300 tracking-tight">{visual.title}</h3>
              <p className="text-editor-text-muted font-sans text-sm leading-relaxed">{visual.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisualsSection;