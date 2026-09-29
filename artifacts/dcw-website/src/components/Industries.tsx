import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import { Droplet, Anchor } from "lucide-react";

export function Industries() {
  const waterFacilities = [
    "Wastewater Treatment Plants",
    "Fresh Water Treatment Plants",
    "Pump Stations",
    "Pipeline Infrastructure",
    "Water Trunk Lines",
    "Industrial Piping",
    "Pressure Piping",
    "Utility Infrastructure",
  ];

  const navalFacilities = [
    "Naval Ship Repair",
    "Defense Contractors",
  ];

  return (
    <section id="industries" className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="mb-11 md:mb-14">
            <h2 className="text-[11px] font-mono font-semibold tracking-[0.14em] text-primary uppercase mb-4 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-primary block"></span>
              Sectors
            </h2>
            <h3 className="text-5xl md:text-6xl font-display font-semibold leading-none text-foreground">
              Industries Served
            </h3>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <FadeIn delay={0.1}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-7 pb-5 border-b border-foreground/40">
                <div className="w-11 h-11 bg-card border border-border flex items-center justify-center text-primary">
                  <Droplet strokeWidth={1.5} size={22} />
                </div>
                <h4 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
                  Water & Wastewater
                </h4>
              </div>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {waterFacilities.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-start gap-3 py-3 border-b border-border/70">
                      <span className="text-primary mt-1.5 text-xs" aria-hidden="true">—</span>
                      <span className="text-[15px] font-medium text-foreground">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-7 pb-5 border-b border-foreground/40">
                <div className="w-11 h-11 bg-card border border-border flex items-center justify-center text-primary">
                  <Anchor strokeWidth={1.5} size={22} />
                </div>
                <h4 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
                  Naval & Military
                </h4>
              </div>
              <StaggerContainer className="grid grid-cols-1">
                {navalFacilities.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-start gap-3 py-3 border-b border-border/70">
                      <span className="text-primary mt-1.5 text-xs" aria-hidden="true">—</span>
                      <span className="text-[15px] font-medium text-foreground">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              
              <div className="mt-10 p-6 md:p-8 bg-accent border-l-2 border-primary relative overflow-hidden">
                <p className="text-foreground/75 text-sm leading-relaxed font-medium relative z-10">
                  "Trusted by government agencies, naval defense contractors, and critical utility infrastructure providers."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
