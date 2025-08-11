import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ShoppingBag, Search, User, Menu, LogOut, Settings, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { SearchDialog } from "@/components/SearchDialog";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <h1 className="text-2xl font-bold text-luxury bg-gradient-luxury bg-clip-text text-transparent cursor-pointer">
                JumpStart
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-sm font-medium hover:text-accent transition-colors">
              Categories
            </Link>
            <Link to="/lookbook" className="text-sm font-medium hover:text-accent transition-colors">
              Lookbook
            </Link>
            <Link to="/women" className="text-sm font-medium hover:text-accent transition-colors">
              Women
            </Link>
            <Link to="/men" className="text-sm font-medium hover:text-accent transition-colors">
              Men
            </Link>
            <Link to="/accessories" className="text-sm font-medium hover:text-accent transition-colors">
              Accessories
            </Link>
            <Link to="/sale" className="text-sm font-medium hover:text-accent transition-colors">
              Sale
            </Link>
            <Link to="/stores" className="text-sm font-medium hover:text-accent transition-colors">
              Stores
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <SearchDialog />
            
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">
                        {profile?.first_name && profile?.last_name 
                          ? `${profile.first_name} ${profile.last_name}`
                          : 'User'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Management Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" asChild>
                <Link to="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link to="/cart">
                <ShoppingBag className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground">
                    {getTotalItems()}
                  </Badge>
                )}
              </Link>
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
              <Link to="/" className="text-sm font-medium hover:text-accent transition-colors">
                Home
              </Link>
              <Link to="/categories" className="text-sm font-medium hover:text-accent transition-colors">
                Categories
              </Link>
              <Link to="/lookbook" className="text-sm font-medium hover:text-accent transition-colors">
                Lookbook
              </Link>
              <Link to="/women" className="text-sm font-medium hover:text-accent transition-colors">
                Women
              </Link>
              <Link to="/men" className="text-sm font-medium hover:text-accent transition-colors">
                Men
              </Link>
              <Link to="/accessories" className="text-sm font-medium hover:text-accent transition-colors">
                Accessories
              </Link>
              <Link to="/sale" className="text-sm font-medium hover:text-accent transition-colors">
                Sale
              </Link>
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