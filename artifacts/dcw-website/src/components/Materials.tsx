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
    <section id="materials" className="py-20 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="mb-11 md:mb-14">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.14em] text-[hsl(23_73%_68%)] uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-primary block"></span>
              Capabilities
            </h2>
            <h3 className="text-5xl md:text-6xl font-display font-semibold leading-none text-background">
              Materials We Weld
            </h3>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-background/20 border border-background/20">
          {materials.map((material, index) => (
            <StaggerItem key={index}>
              <div className="bg-foreground px-6 py-6 md:py-8 min-h-[92px] h-full flex items-center hover:bg-secondary transition-colors duration-300 group">
                <span className="text-[15px] font-medium text-background leading-snug">
                  {material}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
