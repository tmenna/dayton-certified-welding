import { FadeIn, StaggerContainer, StaggerItem } from "./animations";
import { BadgeCheck, ClipboardCheck, Users, Calculator } from "lucide-react";

const services = [
  {
    title: "Certified Welding Services",
    description: "Certified on-site welding for industrial, commercial, municipal, and government facilities.",
    items: ["Naval Ship Repair"],
    icon: BadgeCheck,
  },
  {
    title: "Welding Inspection & NDT",
    description: "Visual welding inspections and coordination of Non-Destructive Testing (NDT) to ensure code compliance and quality assurance.",
    items: [],
    icon: ClipboardCheck,
  },
  {
    title: "Welding Consultation",
    description: "Technical consultation for welding procedures, repairs, project planning, and code compliance.",
    items: [],
    icon: Users,
  },
  {
    title: "Free Project Estimates",
    description: "Contact Dayton Certified Welding for a free estimate and expert consultation tailored to your project's welding and fabrication requirements.",
    items: [],
    icon: Calculator,
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 md:py-28 bg-card relative border-t border-border">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-12 mb-11 md:mb-14 pb-7 border-b border-border">
            <div className="max-w-2xl">
              <h2 className="text-xs font-mono font-semibold tracking-[0.12em] text-primary uppercase mb-4 flex items-center gap-3">
                <span className="w-6 h-[2px] bg-primary block"></span>
                Capabilities
              </h2>
              <h3 className="text-5xl md:text-6xl font-display font-semibold leading-none text-foreground">
                Core Services
              </h3>
            </div>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
              Comprehensive welding solutions delivered with precision, backed by decades of on-site experience.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-border border border-border">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <StaggerItem key={index}>
                <div className="group p-7 md:p-8 h-full min-h-[275px] flex flex-col bg-card hover:bg-background transition-colors duration-300">
                  <div className="w-10 h-10 border border-border flex items-center justify-center mb-9 text-primary">
                    <Icon strokeWidth={1.5} size={20} />
                  </div>
                  <h4 className="text-[25px] font-display font-semibold leading-[1.05] text-foreground mb-3">
                    {service.title}
                  </h4>
                   <p className="text-[15px] text-muted-foreground leading-[1.65]">
                    {service.description}
                  </p>
                  {service.items.length > 0 && (
                    <ul className="mt-4 space-y-1 flex-grow">
                      {service.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <span className="text-primary" aria-hidden="true">—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
