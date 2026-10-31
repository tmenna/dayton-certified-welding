import logo from "@/assets/dcw-logo-tight.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-primary">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-5">
            <img
              src={logo}
              alt="Dayton Certified Welding"
              className="h-16 w-16 object-contain rounded-full bg-white p-1 shrink-0 opacity-90"
            />
            <div className="text-center md:text-left">
              <h2 className="font-display font-bold text-xl tracking-tight text-white mb-1">
                DAYTON CERTIFIED WELDING
              </h2>
              <p className="text-muted-foreground text-sm font-medium">
                A Southern California Union Welding Company.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#certifications" className="hover:text-white transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left text-xs font-medium text-muted-foreground">
          <p>&copy; {currentYear} Dayton Certified Welding Inc. All rights reserved.</p>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <p>Since 1993</p>
            <p className="text-background/60">
              Web solution by{" "}
              <a
                href="https://holtekllc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-background/80 underline decoration-white/25 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Holtek Solutions
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
