import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail, 
  MapPin, 
  Phone 
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-primary-foreground/10">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-light mb-4">
              Stay in Style
            </h3>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for exclusive access to new collections, 
              styling tips, and special offers curated just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button className="bg-gradient-luxury hover:opacity-90 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold bg-gradient-luxury bg-clip-text text-transparent">
                JumpStart
              </h2>
              <p className="text-primary-foreground/80 leading-relaxed">
                Redefining fashion retail with AI-powered insights and curated 
                collections that speak to your unique style.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary-foreground/60 hover:text-primary-foreground">
                  <Facebook className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Shop */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Shop</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Women's Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Men's Collection
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Accessories
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Sale Items
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    New Arrivals
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                    Care Instructions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-6">
              <h4 className="text-lg font-medium">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80 text-sm">
                    123 Fashion Ave, Style City, SC 12345
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80 text-sm">
                    +1 (555) 123-4567
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-primary-foreground/80 text-sm">
                    hello@jumpstart.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-primary-foreground/10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-primary-foreground/60 text-sm">
              © 2024 JumpStart. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};