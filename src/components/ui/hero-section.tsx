import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fashion.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Luxury fashion collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-accent uppercase tracking-wider">
                Spring/Summer 2024
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-luxury leading-tight">
                Redefine Your
                <span className="block bg-gradient-luxury bg-clip-text text-transparent font-medium">
                  Fashion Story
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Experience fashion retail powered by AI insights. From our nationwide 
                network of 750+ stores to personalized recommendations, discover premium 
                pieces that speak to your unique style.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/categories">
                <Button className="btn-luxury group">
                  Shop Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/lookbook">
                <Button variant="outline" className="border-foreground/20 hover:bg-foreground/5">
                  View Lookbook
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <p className="text-2xl font-light text-luxury">750+</p>
                <p className="text-sm text-muted-foreground">Stores Nationwide</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-luxury">AI-Powered</p>
                <p className="text-sm text-muted-foreground">Recommendations</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-light text-luxury">Real-time</p>
                <p className="text-sm text-muted-foreground">Sentiment Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="w-24 h-24 rounded-full bg-gradient-luxury opacity-20 blur-xl" />
      </div>
    </section>
  );
};