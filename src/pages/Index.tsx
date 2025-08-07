import { Navigation } from "@/components/ui/navigation";
import { HeroSection } from "@/components/ui/hero-section";
import { FeaturedCategories } from "@/components/ui/featured-categories";
import { TrendingProducts } from "@/components/ui/trending-products";
import { Footer } from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturedCategories />
        <TrendingProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
