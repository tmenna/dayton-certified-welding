import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logo from "@assets/dcw-logo-srufer-welder_1785714280136.png";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Industries", href: "#industries" },
    { name: "Experience", href: "#experience" },
    { name: "Certifications", href: "#certifications" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color] duration-300 border-b ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-border"
          : "bg-background border-border"
      }`}
    >
      <div className="container mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-6 min-h-[76px] lg:min-h-[88px]">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
          className="cursor-pointer group text-left min-w-0 shrink-0"
          aria-label="Dayton Certified Welding — back to top"
        >
          <span className="font-display font-semibold text-[19px] sm:text-[23px] lg:text-[25px] text-foreground leading-[0.9] tracking-[0.005em] flex items-center gap-3">
            <img src={logo} alt="" className="h-11 w-11 sm:h-13 sm:w-13 lg:h-15 lg:w-15 shrink-0 object-contain" />
            <span className="max-w-[180px] sm:max-w-none">DAYTON CERTIFIED<br className="hidden sm:block xl:hidden" /> WELDING</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-8 shrink-0" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs font-bold text-foreground/85 hover:text-primary transition-colors uppercase tracking-[0.1em] py-3"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-foreground text-background px-6 py-3 text-xs font-bold uppercase tracking-[0.1em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="xl:hidden text-foreground p-2 border border-border shrink-0"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-[0_18px_30px_-24px_hsl(var(--foreground)/0.3)]">
          <nav className="flex flex-col px-5 sm:px-8 py-2" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-2 py-4 text-xs font-bold text-foreground border-b border-border uppercase tracking-[0.12em] hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="px-2 py-4 text-xs font-bold text-primary uppercase tracking-[0.12em]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
