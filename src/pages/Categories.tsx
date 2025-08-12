import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

const categories = [
	{
		id: "women",
		name: "Women's Collection",
		description: "Discover our elegant and sophisticated women's fashion",
		path: "/women",
		image:
			"https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		items: "250+ Items",
		badge: "New Arrivals",
	},
	{
		id: "men",
		name: "Men's Collection",
		description: "Premium menswear for the modern gentleman",
		path: "/men",
		image:
			"https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		items: "180+ Items",
		badge: "Trending",
	},
	{
		id: "accessories",
		name: "Accessories",
		description: "Complete your look with our curated accessories",
		path: "/accessories",
		image:
			"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		items: "120+ Items",
		badge: "Essential",
	},
	{
		id: "sale",
		name: "Sale & Offers",
		description: "Don't miss out on our exclusive deals and discounts",
		path: "/sale",
		image:
			"https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		items: "90+ Items",
		badge: "Up to 50% Off",
	},
];

const Categories = () => {
	const { addToCart } = useCart();

	// Helper function to get correct image path
	const getImageUrl = (imageName: string) => {
		const base = import.meta.env.BASE_URL || "/";
		return `${base}images/${imageName}`;
	};

	const featuredProducts = [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			name: "Textured Wrap Dress",
			price: 259,
			originalPrice: 329,
			category: "Women",
			rating: 4.8,
			isNew: false,
			isSale: true,
			image: getImageUrl("textureddress.png"),
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440107",
			name: "Tailored Wool Coat",
			price: 519,
			category: "Men",
			rating: 4.9,
			isNew: true,
			isSale: false,
			image: getImageUrl("woolcoat.jpeg"),
		},
		{
			id: "550e8400-e29b-41d4-a716-446655440207",
			name: "Crossbody Leather Purse",
			price: 195,
			category: "Accessories",
			rating: 4.7,
			isNew: false,
			isSale: false,
			image: getImageUrl("Crossbody Phone Bag.jpg"),
		},
	];

	const handleAddToCart = async (productId: string, productName: string) => {
		try {
			await addToCart(productId, 1);
		} catch (error) {
			console.error("Error adding to cart:", error);
		}
	};
	return (
		<div className="min-h-screen bg-background">
			<Navigation />

			<main>
				{/* Hero Section */}
				<section className="relative py-20 px-4">
					<div className="max-w-6xl mx-auto text-center">
						<h1 className="text-4xl md:text-5xl font-light text-luxury mb-6">
							Shop All Categories
						</h1>
						<p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
							Explore our complete collection of premium fashion across all
							categories. From elegant dresses to sophisticated accessories, find
							everything you need to express your unique style.
						</p>
					</div>
				</section>

				{/* Categories Grid */}
				<section className="py-16 px-4">
					<div className="max-w-6xl mx-auto">
						<div className="grid md:grid-cols-2 gap-8">
							{categories.map((category) => (
								<Link key={category.id} to={category.path} className="group">
									<Card className="card-fashion hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
										<CardContent className="p-0">
											<div className="relative">
												<img
													src={category.image}
													alt={category.name}
													className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
													style={{ imageRendering: "crisp-edges" }}
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

												{/* Badge */}
												<div className="absolute top-4 left-4">
													<Badge
														className={`${
															category.id === "sale"
																? "bg-red-500"
																: "bg-luxury"
														} 
                            text-white font-semibold px-3 py-1`}
													>
														{category.badge}
													</Badge>
												</div>

												{/* Content Overlay */}
												<div className="absolute bottom-0 left-0 right-0 p-6 text-white">
													<h3 className="text-2xl font-semibold mb-2 group-hover:text-luxury transition-colors">
														{category.name}
													</h3>
													<p className="text-gray-200 mb-3 line-clamp-2">
														{category.description}
													</p>
													<div className="flex items-center justify-between">
														<span className="text-sm font-medium">
															{category.items}
														</span>
														<ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Featured Products Section */}
				<section className="py-16 px-4 bg-gray-50">
					<div className="max-w-6xl mx-auto">
						<div className="text-center mb-12">
							<h2 className="text-3xl font-light text-luxury mb-4">
								Featured Products
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Handpicked selections from across our categories
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{featuredProducts.map((product) => (
								<Card
									key={product.id}
									className="group card-fashion hover:shadow-xl transition-all duration-300 border-0"
								>
									<CardContent className="p-0">
										<div className="relative overflow-hidden">
											<img
												src={product.image}
												alt={product.name}
												className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
												style={{ imageRendering: "crisp-edges" }}
											/>

											<div className="absolute top-3 left-3 flex flex-col gap-2">
												{product.isSale && (
													<Badge className="bg-red-500 text-white font-semibold">
														Sale
													</Badge>
												)}
												{product.isNew && (
													<Badge className="bg-green-500 text-white font-semibold">
														New
													</Badge>
												)}
											</div>
										</div>

										<div className="p-6 space-y-3">
											<div className="text-xs text-gray-500 uppercase tracking-wider font-medium">
												{product.category}
											</div>

											<h3 className="font-semibold text-gray-900 text-lg group-hover:text-luxury transition-colors">
												{product.name}
											</h3>

											<div className="flex items-center gap-2">
												<div className="flex items-center">
													{Array.from({ length: 5 }).map((_, i) => (
														<Star
															key={i}
															className={`w-4 h-4 ${
																i < Math.floor(product.rating)
																	? "fill-yellow-400 text-yellow-400"
																	: "text-gray-300"
															}`}
														/>
													))}
												</div>
												<span className="text-sm text-gray-600">
													({product.rating})
												</span>
											</div>

											<div className="flex items-center gap-3">
												<span className="text-xl font-bold text-gray-900">
													${product.price}
												</span>
												{product.originalPrice && (
													<span className="text-lg text-gray-500 line-through">
														${product.originalPrice}
													</span>
												)}
											</div>

											<div className="flex gap-2 pt-2">
												<Button
													onClick={() =>
														handleAddToCart(product.id, product.name)
													}
													className="btn-luxury flex-1"
													size="sm"
												>
													<ShoppingCart className="w-4 h-4 mr-2" />
													Add to Cart
												</Button>
												<Link
													to={`/${product.category.toLowerCase()}`}
													className="flex-1"
												>
													<Button
														variant="outline"
														className="w-full border-luxury text-luxury hover:bg-luxury hover:text-white"
														size="sm"
													>
														View Details
													</Button>
												</Link>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>

						<div className="text-center mt-12">
							<Link to="/women">
								<Button className="btn-luxury">
									View All Products
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
						</div>
					</div>
				</section>

				{/* Call to Action */}
				<section className="py-20 px-4">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-3xl md:text-4xl font-light text-luxury mb-6">
							Ready to Start Shopping?
						</h2>
						<p className="text-xl text-muted-foreground mb-8">
							Join thousands of satisfied customers who have found their perfect
							style with us.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Link to="/women">
								<Button className="btn-luxury">
									Shop Women's Collection
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</Link>
							<Link to="/men">
								<Button
									variant="outline"
									className="border-luxury text-luxury hover:bg-luxury hover:text-white"
								>
									Shop Men's Collection
								</Button>
							</Link>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
};

export default Categories;
