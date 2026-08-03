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
    <section id="industries" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Sectors
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              Industries Served
            </h3>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <FadeIn delay={0.1}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-14 h-14 bg-white border border-border flex items-center justify-center text-foreground">
                  <Droplet strokeWidth={1.5} size={28} />
                </div>
                <h4 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                  Water & Wastewater
                </h4>
              </div>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {waterFacilities.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1.5 opacity-80">▹</span>
                      <span className="text-lg font-medium text-foreground">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-border">
                <div className="w-14 h-14 bg-white border border-border flex items-center justify-center text-foreground">
                  <Anchor strokeWidth={1.5} size={28} />
                </div>
                <h4 className="text-2xl md:text-3xl font-display font-semibold text-foreground">
                  Naval & Military
                </h4>
              </div>
              <StaggerContainer className="grid grid-cols-1 gap-y-4">
                {navalFacilities.map((item, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-start gap-3">
                      <span className="text-primary mt-1.5 opacity-80">▹</span>
                      <span className="text-lg font-medium text-foreground">{item}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              
              <div className="mt-12 p-8 bg-white border border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <p className="text-muted-foreground font-medium italic relative z-10">
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
