import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import { Hammer, ClipboardCheck, Users, Calculator } from "lucide-react";

const services = [
  {
    title: "Certified Welding Services",
    description: "Certified on-site welding for industrial, commercial, municipal, and government facilities.",
    icon: Hammer,
  },
  {
    title: "Welding Inspection & NDT",
    description: "Visual welding inspections and coordination of Non-Destructive Testing (NDT) to ensure code compliance and quality assurance.",
    icon: ClipboardCheck,
  },
  {
    title: "Welding Consultation",
    description: "Technical consultation for welding procedures, repairs, project planning, and code compliance.",
    icon: Users,
  },
  {
    title: "Free Project Estimates",
    description: "Contact Dayton Certified Welding for a free estimate and expert consultation tailored to your project's welding and fabrication requirements.",
    icon: Calculator,
  },
];

export function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white relative border-t border-border">
      <div className="container mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-[0.2em] text-primary uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-primary block"></span>
                Capabilities
              </h2>
              <h3 className="text-4xl md:text-5xl font-display font-semibold text-foreground">
                Core Services
              </h3>
            </div>
            <p className="text-muted-foreground font-medium max-w-md">
              Comprehensive welding solutions delivered with precision, backed by decades of on-site experience.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={index}>
                <div className="group border border-border p-8 h-full flex flex-col bg-background hover:border-primary/50 transition-colors duration-300">
                  <div className="w-12 h-12 bg-white border border-border flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-300 text-foreground">
                    <Icon strokeWidth={1.5} size={24} />
                  </div>
                  <h4 className="text-xl font-display font-semibold text-foreground mb-4">
                    {service.title}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {service.description}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
