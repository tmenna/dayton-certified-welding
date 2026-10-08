import { FadeIn } from "./animations";
import { ArrowRight, ChevronDown } from "lucide-react";
import pipelineWelding from "@assets/Pipeline_weld_dayton_1791493895020.jpeg";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Right-side hero photo */}
      <div className="absolute top-0 right-0 w-[42vw] h-full hidden lg:block pointer-events-none">
        <img
          src={pipelineWelding}
          alt="Field welder working on a flanged pipeline"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient fade toward the text */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>

      {/* Structural background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-24 h-[1px] bg-border" />
        <div className="absolute bottom-1/4 left-0 w-[20vw] h-[1px] bg-border" />
        {/* Subtle grid pattern on left side only */}
        <div
          className="absolute inset-y-0 left-0 w-[58vw] opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "4rem 4rem"
          }}
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl">
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-4 mb-6">
              <span className="w-12 h-1 bg-primary block"></span>
              <span className="text-sm md:text-base font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Since 1993
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-semibold leading-[1.05] text-foreground mb-8">
              A Southern California <br className="hidden md:block" />
              <span className="text-primary">Union Welding</span> Company.
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium max-w-2xl leading-relaxed mb-12">
              Since 1993, Dayton Certified Welding has built a reputation for delivering dependable welding solutions across California.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-6">
              <a
                href="#contact"
                className="group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 font-semibold text-sm tracking-wider uppercase transition-all hover:bg-primary/90"
              >
                Request an Estimate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="group flex items-center justify-center gap-3 bg-white text-foreground border border-border px-8 py-4 font-semibold text-sm tracking-wider uppercase transition-all hover:border-foreground"
              >
                View Capabilities
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-6 md:left-12 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-xs font-semibold tracking-widest uppercase writing-vertical-rl rotate-180 mb-2">Scroll</span>
        <ChevronDown size={20} />
      </div>
    </section>
  );
}
