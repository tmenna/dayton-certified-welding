import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

const photos = [
  {
    src: new URL("@assets/dayton_certified_welding_1_1785709353361.jpg", import.meta.url).href,
    caption: "Large-Diameter Pipeline Elbow",
    detail: "Water Trunk Line · Field Welding",
  },
  {
    src: new URL("@assets/dayton_certified_welding_2_1785709353361.jpg", import.meta.url).href,
    caption: "",
    detail: "",
  },
  {
    src: new URL("@assets/dayton_certified_welding_3_1785709353361.jpg", import.meta.url).href,
    caption: "",
    detail: "",
  },
  {
    src: new URL("@assets/dayton_certified_welding_4_1785709353361.jpg", import.meta.url).href,
    caption: "",
    detail: "",
  },
  {
    src: new URL("@assets/dayton_certified_welding_5_1785709353361.jpg", import.meta.url).href,
    caption: "",
    detail: "",
  },
  {
    src: new URL("@assets/dayton_certified_welding_6_1785709353361.jpg", import.meta.url).href,
    caption: "",
    detail: "",
  },
];

export function ProjectExperience() {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="experience" className="py-24 md:py-32 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-primary block"></span>
              Field Work
            </h2>
            <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
              Project Experience
            </h3>
            <p className="mt-4 text-muted-foreground font-medium max-w-2xl">
              Representative work across water infrastructure, pipeline systems, and industrial facilities throughout Southern California.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, i) => (
            <StaggerItem key={i}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer bg-white border border-border overflow-hidden"
                onClick={() => setLightbox(i)}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all duration-300 pointer-events-none" />
                  {/* Expand hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-10 h-10 border-2 border-white flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                        <path d="M1 1h5M1 1v5M15 1h-5M15 1v5M1 15h5M1 15v-5M15 15h-5M15 15v-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                {photo.caption && (
                  <div className="px-4 py-3 border-t border-border">
                    <p className="text-sm font-semibold text-foreground">{photo.caption}</p>
                    {photo.detail && <p className="text-xs text-muted-foreground mt-0.5 font-medium tracking-wide">{photo.detail}</p>}
                  </div>
                )}
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 border border-white/30 flex items-center justify-center text-white hover:border-primary hover:text-primary transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={18} />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              src={photos[lightbox].src}
              alt={photos[lightbox].caption}
              className="w-full max-h-[75vh] object-contain"
            />
            <div className="mt-4 border-l-2 border-primary pl-4">
              <p className="text-white font-semibold">{photos[lightbox].caption}</p>
              <p className="text-white/60 text-sm font-medium tracking-wide mt-0.5">{photos[lightbox].detail}</p>
            </div>
            {/* Prev / Next */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)}
                className="px-5 py-2 border border-white/20 text-white/70 hover:border-primary hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors"
              >
                ← Prev
              </button>
              <button
                onClick={() => setLightbox((lightbox + 1) % photos.length)}
                className="px-5 py-2 border border-white/20 text-white/70 hover:border-primary hover:text-primary text-sm font-bold uppercase tracking-wider transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
