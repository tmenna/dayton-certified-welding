import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import { ShieldCheck } from "lucide-react";

const certifications = [
  "AWS D1.1 Structural Steel",
  "AWS D1.2 Aluminum",
  "AWS D1.8 Seismic Welding",
  "ASME Section IX",
  "ASME B31.1 Power Piping",
  "ASME B31.3 Process Piping",
  "API 1104 Pipeline Welding",
  "NAVSEA Certified Welding",
];

export function Certifications() {
  return (
    <section id="certifications" className="py-20 md:py-28 bg-card relative border-y border-border">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          
          <div className="lg:col-span-4">
            <FadeIn>
              <h2 className="text-xs font-mono font-semibold tracking-[0.12em] text-primary uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-primary block"></span>
                Qualifications
              </h2>
              <h3 className="text-5xl md:text-6xl font-display font-semibold leading-none text-foreground mb-6">
                Code Compliance & Certifications
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-[1.7] mb-8">
                We maintain rigorous standards of excellence, fully certified across major structural, pipeline, and military codes. Our commitment to quality assurance ensures your project meets exact specifications.
              </p>
              
              <div className="hidden lg:flex items-center gap-3 text-muted-foreground border-t border-border pt-5">
                <ShieldCheck size={24} strokeWidth={1.25} />
                <span className="text-xs font-mono font-semibold tracking-[0.12em] uppercase">Verified Standard</span>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
              {certifications.map((cert, index) => {
                // Determine prefix (AWS, ASME, API, NAVSEA) for visual styling
                const prefix = cert.split(' ')[0];
                const rest = cert.substring(prefix.length).trim();

                return (
                  <StaggerItem key={index}>
                    <div className="flex items-stretch bg-card group hover:bg-background transition-colors min-h-[82px]">
                      <div className="bg-accent px-3 py-5 flex items-center justify-center border-r border-border min-w-[76px]">
                        <span className="font-mono font-semibold text-xs tracking-tight text-primary">
                          {prefix}
                        </span>
                      </div>
                      <div className="p-4 md:p-5 flex items-center">
                        <span className="text-sm font-semibold text-foreground leading-snug">
                          {rest || prefix} {/* Fallback if it's just one word */}
                        </span>
                      </div>
                    </div>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
          
        </div>
      </div>
    </section>
  );
}
