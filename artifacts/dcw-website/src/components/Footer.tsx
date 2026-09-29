import logo from "@assets/dcw-logo-srufer-welder_1785714280136.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 md:py-14 border-t-2 border-primary">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-9">
          
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Dayton Certified Welding"
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain shrink-0"
            />
            <div className="text-left">
              <h2 className="font-display font-semibold text-xl sm:text-2xl leading-none text-background mb-2">
                DAYTON CERTIFIED WELDING
              </h2>
              <p className="text-background/65 text-xs sm:text-sm">
                A Southern California Union Welding Company.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-mono font-semibold text-background/75 uppercase tracking-[0.1em]">
            <a href="#services" className="hover:text-background transition-colors">Services</a>
            <a href="#certifications" className="hover:text-background transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-background transition-colors">Contact</a>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-background/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs font-mono text-background/70">
          <p>&copy; {currentYear} Dayton Certified Welding Inc. All rights reserved.</p>
          <p>Since 1993</p>
        </div>
      </div>
    </footer>
  );
}
