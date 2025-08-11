import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Lookbook = () => {
  const lookbookSections = [
    {
      title: "Spring Elegance",
      subtitle: "Discover our latest spring collection featuring flowing fabrics and pastel tones",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: ["Flowing Dresses", "Light Cardigans", "Elegant Blouses"]
    },
    {
      title: "Urban Chic",
      subtitle: "Street-style inspired pieces for the modern fashionista",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: ["Leather Jackets", "High-Waist Jeans", "Statement Accessories"]
    },
    {
      title: "Professional Power",
      subtitle: "Command attention in boardrooms with our power dressing collection",
      image: "/images/professional.png",
      items: ["Tailored Blazers", "Pencil Skirts", "Classic Pumps"]
    },
    {
      title: "Weekend Casual",
      subtitle: "Comfortable yet stylish pieces for your leisure time",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      items: ["Cozy Sweaters", "Relaxed Denim", "Comfortable Sneakers"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Fashion
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Lookbook</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Explore our curated collections and get inspired by the latest fashion trends
          </p>
          <Link to="/categories">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Explore Collections
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-10"></div>
      </section>

      {/* Lookbook Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Style Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each collection tells a unique story, crafted to inspire your personal style journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {lookbookSections.map((section, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
                  <img 
                    src={section.image} 
                    alt={section.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{section.title}</h3>
                    <p className="text-white/90 text-sm">{section.subtitle}</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Featured Items:</h4>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item, itemIndex) => (
                      <span 
                        key={itemIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                    Shop This Look
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Style Tips & Inspiration</h2>
            <p className="text-lg text-gray-600">
              Expert advice and styling tips to elevate your fashion game
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-2xl font-bold mb-2">Color Coordination</h4>
                  <p className="text-sm opacity-90">Master the art of color</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">How to Mix and Match Colors</h3>
                <p className="text-gray-600 mb-4">
                  Learn the fundamentals of color theory in fashion. Start with neutral bases like black, white, or beige, then add one statement color. Complementary colors like navy and camel or blush and gray create sophisticated combinations that never go out of style.
                </p>
                <Link to="/women">
                  <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-700">
                    Shop Color Coordinated Pieces →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gradient-to-br from-blue-200 to-indigo-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-2xl font-bold mb-2">Layering Mastery</h4>
                  <p className="text-sm opacity-90">Create depth & texture</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">The Art of Layering</h3>
                <p className="text-gray-600 mb-4">
                  Master the technique of layering to create versatile outfits for any season. Start with lightweight base layers, add structured pieces like blazers or cardigans, and finish with statement accessories. This approach allows you to adapt your look from day to night effortlessly.
                </p>
                <Link to="/accessories">
                  <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-700">
                    Discover Layering Accessories →
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gradient-to-br from-green-200 to-teal-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="text-2xl font-bold mb-2">Investment Pieces</h4>
                  <p className="text-sm opacity-90">Build a timeless wardrobe</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Building a Capsule Wardrobe</h3>
                <p className="text-gray-600 mb-4">
                  Invest in quality pieces that form the foundation of your wardrobe. A well-tailored blazer, classic white shirt, perfect-fit jeans, and little black dress are timeless essentials. These versatile pieces can be styled in countless ways and will serve you for years to come.
                </p>
                <Link to="/sale">
                  <Button variant="link" className="p-0 h-auto text-purple-600 hover:text-purple-700">
                    Shop Investment Pieces →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Lookbook;
