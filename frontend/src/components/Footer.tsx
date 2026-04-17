import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/40 bg-card/50 backdrop-blur-sm">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-bold text-lg gradient-text mb-3">Shonali Network</h3>
          <p className="text-sm text-muted-foreground">Premium digital solutions for modern businesses.</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Services</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/services" className="hover:text-primary transition-colors">All Services</Link>
            <Link to="/services/website-development" className="hover:text-primary transition-colors">Website Development</Link>
            <Link to="/services/app-development" className="hover:text-primary transition-colors">App Development</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Company</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <Link to="/brochure" className="hover:text-primary transition-colors">Brochure</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <span>hello@shonalinetwork.com</span>
            <span>+91 98765 43210</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Shonali Network. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
