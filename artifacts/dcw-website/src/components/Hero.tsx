import { FadeIn } from "./animations";
import { ArrowRight } from "lucide-react";
import arcFlash from "@assets/dayton_certified_welding_4_1785709353361.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center pt-[76px] lg:pt-[88px] overflow-hidden bg-background">
      {/* Right-side hero photo */}
      <div className="absolute top-[88px] right-0 w-[42%] h-[calc(100%-88px)] hidden lg:block pointer-events-none border-l border-border">
        <img
          src={arcFlash}
          alt="Certified field welding — confined space arc work"
          className="w-full h-full object-cover object-[48%_center] saturate-[0.72] contrast-[1.1]"
        />
        {/* Dark gradient fade toward the text */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/45 to-transparent" />
        {/* Bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
      </div>

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="max-w-[900px]">
          <FadeIn delay={0.1}>
            <div className="flex items-center gap-4 mb-7 md:mb-10">
              <span className="w-8 h-[2px] bg-primary block"></span>
              <span className="text-xs font-mono font-semibold tracking-[0.12em] text-primary uppercase">
                Since 1993
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-[clamp(3rem,6.8vw,6.375rem)] font-display font-semibold leading-[1.08] md:leading-[0.97] text-foreground mb-7 md:mb-9 max-w-[950px]">
              A Southern California <br className="hidden md:block" />
              <span className="inline-block whitespace-nowrap bg-foreground text-[#FBFBFB] px-[0.12em]">Union Welding</span> Company.
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground font-normal max-w-[590px] leading-[1.65] mb-9 md:mb-12">
              Since 1993, Dayton Certified Welding has built a reputation for delivering dependable welding solutions across California.
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="#contact"
                className="group flex items-center justify-center gap-5 bg-primary text-primary-foreground px-7 py-4 font-bold text-xs tracking-[0.13em] uppercase transition-colors hover:bg-foreground"
              >
                Request an Estimate
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#services"
                className="group flex items-center justify-center gap-3 bg-background text-foreground border border-border px-7 py-4 font-bold text-xs tracking-[0.13em] uppercase transition-colors hover:border-foreground"
              >
                View Capabilities
              </a>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="lg:hidden h-[220px] sm:h-[300px] relative border-t border-border">
        <img src={arcFlash} alt="Certified field welding — confined space arc work" className="w-full h-full object-cover object-center saturate-[0.72] contrast-[1.1]" />
      </div>
    </section>
  );
}
