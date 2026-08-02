export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background py-12 border-t-4 border-primary">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center justify-center md:justify-start gap-2 mb-2 text-white">
              <span className="w-3 h-6 bg-primary block"></span>
              DAYTON CERTIFIED WELDING
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              A Southern California Union Welding Company.
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#certifications" className="hover:text-white transition-colors">Certifications</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
          <p>&copy; {currentYear} Dayton Certified Welding Inc. All rights reserved.</p>
          <p>Established 1993</p>
        </div>
      </div>
    </footer>
  );
}
