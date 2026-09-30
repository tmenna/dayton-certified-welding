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
    <section id="certifications" className="py-24 md:py-32 bg-white relative border-y border-border">
      {/* Background industrial pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          <div className="lg:col-span-4">
            <FadeIn>
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary block"></span>
                Qualifications
              </h2>
              <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground mb-6">
                Code Compliance & Certifications
              </h3>
              <p className="text-muted-foreground font-medium leading-relaxed mb-8">
                We maintain rigorous standards of excellence, fully certified across major structural, pipeline, and military codes. Our commitment to quality assurance ensures your project meets exact specifications.
              </p>
              
              <div className="hidden lg:flex items-center gap-4 text-foreground/40">
                <ShieldCheck size={48} strokeWidth={1} />
                <span className="text-sm font-bold tracking-widest uppercase">Verified Standard</span>
              </div>
            </FadeIn>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, index) => {
                // Determine prefix (AWS, ASME, API, NAVSEA) for visual styling
                const prefix = cert.split(' ')[0];
                const rest = cert.substring(prefix.length).trim();

                return (
                  <StaggerItem key={index}>
                    <div className="flex items-stretch border border-border bg-background group hover:border-primary/50 transition-colors">
                      <div className="bg-muted px-4 py-6 flex items-center justify-center border-r border-border min-w-[80px] group-hover:bg-primary group-hover:text-white transition-colors group-hover:border-primary">
                        <span className="font-display font-bold text-sm tracking-wider">
                          {prefix}
                        </span>
                      </div>
                      <div className="p-4 flex items-center">
                        <span className="font-semibold text-foreground">
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
