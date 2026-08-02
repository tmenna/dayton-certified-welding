import { FadeIn, StaggerContainer, StaggerItem } from "./animations";

const materials = [
  "Carbon Steel",
  "HSLA (High Strength Low Alloy Steel)",
  "Stainless Steel",
  "Alloy Steel",
  "Reinforced Steel",
  "Structural Steel (HSS)",
  "Cast Iron",
  "Aluminum",
];

export function Materials() {
  return (
    <section id="materials" className="py-24 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center justify-center gap-3">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Capabilities
              <span className="w-8 h-[2px] bg-primary block"></span>
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-white">
              Materials We Weld
            </h3>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {materials.map((material, index) => (
            <StaggerItem key={index}>
              <div className="border border-white/10 bg-white/5 p-6 text-center hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                <span className="font-semibold text-white tracking-wide">
                  {material}
                </span>
                <div className="w-8 h-[2px] bg-primary mx-auto mt-4 scale-0 group-hover:scale-100 transition-transform origin-center duration-300" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
