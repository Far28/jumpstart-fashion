import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import productsImage from "@/assets/products-collection.jpg";

const categories = [
  {
    id: 1,
    name: "Dresses",
    description: "Elegant pieces for every occasion",
    image: productsImage,
    itemCount: 120,
  },
  {
    id: 2,
    name: "Accessories",
    description: "Complete your perfect look",
    image: productsImage,
    itemCount: 85,
  },
  {
    id: 3,
    name: "Footwear",
    description: "Step into luxury and comfort",
    image: productsImage,
    itemCount: 95,
  },
];

export const FeaturedCategories = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-accent uppercase tracking-wider mb-4">
            Shop by Category
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-luxury mb-6">
            Curated Collections
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our handpicked selections designed to elevate your wardrobe
            with pieces that define modern luxury.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group card-fashion overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="space-y-2 mb-4">
                    <h3 className="text-2xl font-light">{category.name}</h3>
                    <p className="text-sm text-white/80">{category.description}</p>
                    <p className="text-xs text-white/60">
                      {category.itemCount} items
                    </p>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white hover:text-primary transition-all duration-300 group-hover:translate-x-2"
                  >
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button className="btn-luxury">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};