import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import productsImage from "@/assets/products-collection.jpg";

const trendingProducts = [
  {
    id: 1,
    name: "Silk Midnight Elegance Dress",
    price: 299,
    originalPrice: 399,
    image: productsImage,
    brand: "LUXE ATELIER",
    rating: 4.8,
    isNew: false,
    isSale: true,
  },
  {
    id: 2,
    name: "Cashmere Oversized Blazer",
    price: 449,
    image: productsImage,
    brand: "MODERN ESSENCE",
    rating: 4.9,
    isNew: true,
    isSale: false,
  },
  {
    id: 3,
    name: "Italian Leather Ankle Boots",
    price: 329,
    image: productsImage,
    brand: "ARTISAN CRAFT",
    rating: 4.7,
    isNew: false,
    isSale: false,
  },
  {
    id: 4,
    name: "Pearl Statement Necklace",
    price: 189,
    originalPrice: 249,
    image: productsImage,
    brand: "PEARL HOUSE",
    rating: 4.6,
    isNew: false,
    isSale: true,
  },
];

export const TrendingProducts = () => {
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
            <Button className="btn-luxury">
              Get My Recommendations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};