import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const TrendingProducts = () => {
  // Helper function to get correct image path
  const getImageUrl = (imageName: string) => {
    if (!imageName) return '/placeholder.svg';
    if (imageName.startsWith('http')) return imageName; // Already a full URL
    
    // Remove any leading slashes or 'images/' prefix from imageName
    const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
    
    const base = import.meta.env.BASE_URL;
    
    // Simple and reliable path construction
    const finalUrl = `${base}images/${cleanImageName}`;
    
    return finalUrl;
  };

  const trendingProducts = [
    {
      id: 1,
      name: "Rose Gold Evening Clutch",
      price: 199,
      originalPrice: 259,
      image: getImageUrl('clutches.jpg'),
      brand: "GLAMOUR NIGHTS",
      rating: 4.8,
      isNew: false,
      isSale: true,
    },
    {
      id: 2,
      name: "Merino Wool Cardigan",
      price: 329,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      brand: "WOOL HERITAGE",
      rating: 4.9,
      isNew: true,
      isSale: false,
    },
    {
      id: 3,
      name: "Suede Chelsea Boots",
      price: 279,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      brand: "LONDON SOLE",
      rating: 4.7,
      isNew: false,
      isSale: false,
    },
    {
      id: 4,
      name: "Geometric Statement Earrings",
      price: 149,
      originalPrice: 189,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      brand: "MODERN JEWELS",
      rating: 4.6,
      isNew: false,
      isSale: true,
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="mb-6 md:mb-0">
            <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
              Trending Now
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-luxury mb-4">
              Customer Favorites
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg">
              Discover the pieces our community can't stop talking about.
              These trending items are flying off our virtual shelves.
            </p>
          </div>
          
          <Button variant="outline" className="self-start md:self-auto">
            View All Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* AI Insights Banner */}
        <div className="mt-16 card-fashion bg-gradient-subtle p-8 md:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-luxury mb-6">
              <span className="text-white text-2xl">🤖</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-light text-luxury mb-4">
              AI-Powered Recommendations
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Our advanced AI analyzes customer reviews and preferences to curate 
              personalized recommendations just for you. Experience fashion discovery 
              like never before.
            </p>
            <Button 
              className="btn-luxury"
              onClick={() => {
                // Scroll to the AI recommendations test section
                const aiSection = document.querySelector('[data-ai-recommendations]');
                if (aiSection) {
                  aiSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Fallback: scroll to bottom where AI sections are
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }
              }}
            >
              Get My Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};