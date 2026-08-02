import { FadeIn } from "./animations";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-muted/40 hidden lg:block border-l border-border pointer-events-none" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <FadeIn>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center justify-center gap-3">
                <span className="w-8 h-[2px] bg-primary block"></span>
                Get In Touch
                <span className="w-8 h-[2px] bg-primary block"></span>
              </h2>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-foreground">
                Free Project Estimates
              </h3>
            </div>

            <div className="bg-white border border-border p-8 md:p-12 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-2xl font-display font-semibold text-foreground mb-6">
                    Expert Consultation
                  </h4>
                  <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
                    Contact Dayton Certified Welding for a free estimate and expert consultation tailored to your project's precise welding and fabrication requirements.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <Phone size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone</span>
                        <a href="tel:+19512970622" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          (951) 297-0622
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <Mail size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</span>
                        <a href="mailto:david@daytoncertifiedwelding.com" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                          david@daytoncertifiedwelding.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background border border-border flex items-center justify-center text-primary shrink-0">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Location</span>
                        <span className="text-lg font-semibold text-foreground">
                          Temecula, California
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-border p-6 md:p-8">
                  <h4 className="font-display font-semibold text-xl text-foreground mb-6 pb-4 border-b border-border">
                    Request an Inquiry
                  </h4>
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Name / Company</label>
                      <input type="text" className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="John Doe - Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                      <input type="email" className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Project Details</label>
                      <textarea rows={4} className="w-full bg-white border border-border px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors resize-none" placeholder="Describe your welding requirements..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-foreground text-background font-bold uppercase tracking-wider py-4 hover:bg-primary hover:text-white transition-colors mt-2">
                      Send Request
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
