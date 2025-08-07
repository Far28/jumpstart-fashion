import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Search, User, Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-luxury bg-gradient-luxury bg-clip-text text-transparent">
              JumpStart
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
              Collections
            </a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
              Women
            </a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
              Men
            </a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
              Accessories
            </a>
            <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
              Sale
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                3
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Collections
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Women
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Men
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Accessories
              </a>
              <a href="#" className="text-sm font-medium hover:text-accent transition-colors">
                Sale
              </a>
              <div className="pt-4 border-t border-border/40">
                <Button variant="ghost" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};