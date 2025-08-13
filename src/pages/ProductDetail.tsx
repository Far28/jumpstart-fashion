import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, ShoppingCart, Star, TrendingUp, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ReviewForm from "@/components/ReviewForm";
import ReviewsDisplay from "@/components/ReviewsDisplay";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sale_price: number | null;
  is_sale: boolean;
  category: string;
  subcategory: string;
  brand: string;
  image_url: string;
  sizes: string[];
  colors: string[];
  stock_quantity: number;
  rating: number;
  review_count: number;
  tags: string[];
}

interface SentimentStats {
  positive: number;
  negative: number;
  neutral: number;
  totalReviews: number;
  averageScore: number;
}

// Helper function to get correct image path
const getImageUrl = (imageName: string) => {
  if (!imageName) return '/placeholder.svg';
  if (imageName.startsWith('http')) return imageName; // Already a full URL
  
  // Remove any leading slashes or 'images/' prefix from imageName
  const cleanImageName = imageName.replace(/^(\/|images\/)+/, '');
  
  const base = import.meta.env.BASE_URL || '/';
  
  // Always use base URL - let Vite handle dev vs prod
  const finalUrl = `${base}images/${cleanImageName}`;
  
  console.log('getImageUrl Debug:', {
    input: imageName,
    cleanImageName,
    base,
    finalUrl,
    isDev: import.meta.env.DEV,
    currentLocation: window.location.href
  });
  
  return finalUrl;
};

// Helper functions to get sample products from each page
const getAllSampleProducts = () => [
  // Women's products (matching Women.tsx)
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Aurora Velvet Evening Gown',
    description: 'Stunning velvet gown with delicate beadwork',
    price: 445,
    sale_price: 356,
    is_sale: true,
    image_url: 'auroravelvetgown.jpg',
    rating: 4.9,
    review_count: 31,
    brand: 'EVENING GRACE',
    category: 'women',
    subcategory: 'dresses',
    tags: ['velvet', 'beaded', 'formal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Deep Purple', 'Midnight Blue', 'Emerald Green'],
    stock_quantity: 15
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Meadow Chiffon Midi Dress',
    description: 'Lightweight chiffon dress with watercolor print',
    price: 195,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Meadow Chiffon Midi Dress.png',
    rating: 4.7,
    review_count: 22,
    brand: 'GARDEN PARTY',
    category: 'women',
    subcategory: 'dresses',
    tags: ['chiffon', 'midi', 'printed'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Multi', 'Sage Green', 'Dusty Rose'],
    stock_quantity: 28
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Midnight Satin Slip Dress',
    description: 'Minimalist satin dress for effortless elegance',
    price: 229,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Midnight Satin Slip Dress.jpg',
    rating: 4.8,
    review_count: 38,
    brand: 'MINIMALIST',
    category: 'women',
    subcategory: 'dresses',
    tags: ['satin', 'slip', 'minimalist'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Champagne', 'Navy'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Alpaca Wool Turtleneck',
    description: 'Ultra-soft alpaca wool turtleneck sweater',
    price: 298,
    sale_price: null,
    is_sale: false,
    image_url: '/images/alapacacool.jpg',
    rating: 4.8,
    review_count: 27,
    brand: 'ALPINE KNITS',
    category: 'women',
    subcategory: 'tops',
    tags: ['alpaca', 'turtleneck', 'luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Charcoal', 'Cream'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Embroidered Peasant Blouse',
    description: 'Romantic blouse with intricate embroidery details',
    price: 165,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Embroidered Peasant Blouse.jpg',
    rating: 4.6,
    review_count: 19,
    brand: 'ARTISAN CRAFT',
    category: 'women',
    subcategory: 'tops',
    tags: ['embroidered', 'peasant', 'romantic'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Cream', 'Sage Green'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440006',
    name: 'Organic Cotton Henley',
    description: 'Sustainable henley top in organic cotton',
    price: 58,
    sale_price: 42,
    is_sale: true,
    image_url: '/images/organic cotton henley.jpg',
    rating: 4.4,
    review_count: 33,
    brand: 'ECO BASICS',
    category: 'women',
    subcategory: 'tops',
    tags: ['organic', 'henley', 'sustainable'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Forest Green'],
    stock_quantity: 40
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440007',
    name: 'Pleated Palazzo Pants',
    description: 'Flowing palazzo pants with elegant pleating',
    price: 189,
    sale_price: null,
    is_sale: false,
    image_url: '/images/pleated plazo pants.png',
    rating: 4.7,
    review_count: 25,
    brand: 'FLOW FASHION',
    category: 'women',
    subcategory: 'bottoms',
    tags: ['palazzo', 'pleated', 'flowing'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Navy', 'Beige'],
    stock_quantity: 20
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440008',
    name: 'Raw Hem Boyfriend Jeans',
    description: 'Relaxed fit jeans with trendy raw hem detail',
    price: 125,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Raw Hem Boyfriend Jeans.png',
    rating: 4.5,
    review_count: 41,
    brand: 'URBAN EDGE',
    category: 'women',
    subcategory: 'bottoms',
    tags: ['boyfriend', 'raw-hem', 'relaxed'],
    sizes: ['24', '25', '26', '27', '28', '29', '30', '31'],
    colors: ['Light Blue', 'Medium Blue', 'Dark Blue'],
    stock_quantity: 35
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440009',
    name: 'Double-Breasted Trench Coat',
    description: 'Classic trench coat with modern silhouette',
    price: 389,
    sale_price: null,
    is_sale: false,
    image_url: '/images/doublebreastedtrenchcoat.jpg',
    rating: 4.9,
    review_count: 29,
    brand: 'CLASSIC COATS',
    category: 'women',
    subcategory: 'outerwear',
    tags: ['trench', 'double-breasted', 'classic'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Black', 'Navy'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440010',
    name: 'Faux Fur Cropped Jacket',
    description: 'Luxurious faux fur jacket in cropped style',
    price: 275,
    sale_price: 206,
    is_sale: true,
    image_url: '/images/fauxfurjacket.jpg',
    rating: 4.6,
    review_count: 18,
    brand: 'FUR LUXE',
    category: 'women',
    subcategory: 'outerwear',
    tags: ['faux-fur', 'cropped', 'luxurious'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black', 'Cream', 'Brown'],
    stock_quantity: 12
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440011',
    name: 'Pointed Toe Stiletto Pumps',
    description: 'Sophisticated pumps with comfortable padding',
    price: 245,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Pointed Toe Stiletto Pumps.jpg',
    rating: 4.7,
    review_count: 36,
    brand: 'STEP ELEGANCE',
    category: 'women',
    subcategory: 'shoes',
    tags: ['stiletto', 'pointed-toe', 'sophisticated'],
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Black', 'Nude', 'Red'],
    stock_quantity: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440012',
    name: 'Platform Espadrille Sandals',
    description: 'Comfortable platform sandals with rope detailing',
    price: 155,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Platform Espadrille Sandals.jpg',
    rating: 4.5,
    review_count: 28,
    brand: 'SUMMER STEPS',
    category: 'women',
    subcategory: 'shoes',
    tags: ['espadrille', 'platform', 'rope'],
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Natural', 'Black', 'Navy'],
    stock_quantity: 30
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440013',
    name: 'Quilted Chain Shoulder Bag',
    description: 'Elegant quilted bag with gold chain strap',
    price: 325,
    sale_price: null,
    is_sale: false,
    image_url: '/images/image.png',
    rating: 4.8,
    review_count: 24,
    brand: 'LUXURY BAGS',
    category: 'women',
    subcategory: 'bags',
    tags: ['quilted', 'chain', 'shoulder'],
    sizes: ['One Size'],
    colors: ['Black', 'Beige', 'Red'],
    stock_quantity: 15
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440014',
    name: 'Woven Straw Bucket Bag',
    description: 'Handwoven straw bag perfect for summer',
    price: 98,
    sale_price: 78,
    is_sale: true,
    image_url: '/images/Woven Straw Bucket Bag.jpg',
    rating: 4.4,
    review_count: 32,
    brand: 'BEACH STYLE',
    category: 'women',
    subcategory: 'bags',
    tags: ['straw', 'woven', 'bucket'],
    sizes: ['One Size'],
    colors: ['Natural', 'Light Brown'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440015',
    name: 'Vintage-Inspired Cuff Bracelet',
    description: 'Ornate cuff bracelet with vintage details',
    price: 125,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Vintage-Inspired Cuff Bracelet.png',
    rating: 4.6,
    review_count: 21,
    brand: 'VINTAGE VIBES',
    category: 'women',
    subcategory: 'jewelry',
    tags: ['vintage', 'cuff', 'ornate'],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440016',
    name: 'Diamond-Cut Hoop Earrings',
    description: 'Sparkling diamond-cut hoops in sterling silver',
    price: 89,
    sale_price: null,
    is_sale: false,
    image_url: '/images/diamondcuthoop.jpg',
    rating: 4.7,
    review_count: 45,
    brand: 'SPARKLE CO',
    category: 'women',
    subcategory: 'jewelry',
    tags: ['diamond-cut', 'hoops', 'sterling'],
    sizes: ['One Size'],
    colors: ['Silver', 'Gold'],
    stock_quantity: 40
  },
  // Men's products (matching Men.tsx)
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    name: 'Oxford Button-Down Shirt',
    description: 'Classic oxford shirt with refined tailoring',
    price: 129,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Oxford Button-Down Shirt.jpg',
    rating: 4.7,
    review_count: 34,
    brand: 'HERITAGE CLOTHIERS',
    category: 'men',
    subcategory: 'shirts',
    tags: ['oxford', 'classic', 'button-down'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Navy'],
    stock_quantity: 45
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    name: 'Linen Weekend Shirt',
    description: 'Breathable linen shirt for relaxed occasions',
    price: 89,
    sale_price: 69,
    is_sale: true,
    image_url: '/images/Linen Weekend Shirt.jpg',
    rating: 4.5,
    review_count: 28,
    brand: 'COASTAL STYLE',
    category: 'men',
    subcategory: 'shirts',
    tags: ['linen', 'casual', 'breathable'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Natural'],
    stock_quantity: 45
  },
  // Accessories products (matching Accessories.tsx exactly)
  {
    id: '550e8400-e29b-41d4-a716-446655440201',
    name: 'Vintage Leather Satchel',
    description: 'Handcrafted leather satchel with brass hardware',
    price: 289,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Vintage Leather Satchel.jpg',
    rating: 4.8,
    review_count: 27,
    brand: 'HERITAGE BAGS',
    category: 'accessories',
    subcategory: 'bags',
    tags: ['leather', 'vintage', 'satchel'],
    sizes: ['One Size'],
    colors: ['Cognac', 'Black', 'Dark Brown'],
    stock_quantity: 35
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440202',
    name: 'Canvas Weekender Bag',
    description: 'Spacious canvas bag perfect for weekend trips',
    price: 149,
    sale_price: 119,
    is_sale: true,
    image_url: '/images/Canvas Weekender Bag.jpg',
    rating: 4.6,
    review_count: 34,
    brand: 'TRAVEL ESSENTIALS',
    category: 'accessories',
    subcategory: 'bags',
    tags: ['canvas', 'weekender', 'travel'],
    sizes: ['One Size'],
    colors: ['Navy', 'Khaki', 'Black'],
    stock_quantity: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440203',
    name: 'Sterling Silver Signet Ring',
    description: 'Classic signet ring in polished sterling silver',
    price: 179,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.7,
    review_count: 22,
    brand: 'SILVER CRAFT',
    category: 'accessories',
    subcategory: 'jewelry',
    tags: ['sterling', 'signet', 'classic'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Silver'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440204',
    name: 'Beaded Charm Bracelet',
    description: 'Artisan beaded bracelet with gold accents',
    price: 89,
    sale_price: 69,
    is_sale: true,
    image_url: '/images/Beaded Charm Bracelet.jpg',
    rating: 4.5,
    review_count: 41,
    brand: 'ARTISAN JEWELRY',
    category: 'accessories',
    subcategory: 'jewelry',
    tags: ['beaded', 'charm', 'artisan'],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Rose Gold'],
    stock_quantity: 30
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440205',
    name: 'Rose Gold Mesh Watch',
    description: 'Elegant watch with rose gold mesh band',
    price: 245,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Rose Gold Mesh Watch.jpg',
    rating: 4.8,
    review_count: 33,
    brand: 'LUXE TIME',
    category: 'accessories',
    subcategory: 'watches',
    tags: ['rose-gold', 'mesh', 'elegant'],
    sizes: ['One Size'],
    colors: ['Rose Gold', 'Silver', 'Gold'],
    stock_quantity: 20
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440206',
    name: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with health monitoring',
    price: 199,
    sale_price: 159,
    is_sale: true,
    image_url: '/images/Smart Fitness Tracker.jpg',
    rating: 4.4,
    review_count: 89,
    brand: 'TECH WEAR',
    category: 'accessories',
    subcategory: 'watches',
    tags: ['smart', 'fitness', 'tech'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Navy', 'White'],
    stock_quantity: 45
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440207',
    name: 'Aviator Polarized Sunglasses',
    description: 'Classic aviator style with polarized lenses',
    price: 159,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Aviator Polarized Sunglasses.jpg',
    rating: 4.7,
    review_count: 28,
    brand: 'SKY VISION',
    category: 'accessories',
    subcategory: 'sunglasses',
    tags: ['aviator', 'polarized', 'classic'],
    sizes: ['One Size'],
    colors: ['Gold', 'Silver', 'Black'],
    stock_quantity: 32
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440208',
    name: 'Oversized Cat-Eye Frames',
    description: 'Trendy oversized sunglasses with UV protection',
    price: 129,
    sale_price: 99,
    is_sale: true,
    image_url: '/images/Oversized Cat-Eye Frames.jpg',
    rating: 4.5,
    review_count: 36,
    brand: 'FASHION EYES',
    category: 'accessories',
    subcategory: 'sunglasses',
    tags: ['cat-eye', 'oversized', 'trendy'],
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise', 'Pink'],
    stock_quantity: 28
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440209',
    name: 'Wide-Brim Fedora Hat',
    description: 'Stylish fedora with classic wide brim',
    price: 89,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Wide-Brim Fedora Hat.jpg',
    rating: 4.6,
    review_count: 19,
    brand: 'HAT COMPANY',
    category: 'accessories',
    subcategory: 'hats',
    tags: ['fedora', 'wide-brim', 'classic'],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Brown', 'Navy'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440210',
    name: 'Cashmere Blend Winter Scarf',
    description: 'Luxurious cashmere blend scarf in neutral tones',
    price: 125,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Cashmere Blend Winter Scarf.jpg',
    rating: 4.8,
    review_count: 25,
    brand: 'WINTER WARMTH',
    category: 'accessories',
    subcategory: 'scarves',
    tags: ['cashmere', 'winter', 'neutral'],
    sizes: ['One Size'],
    colors: ['Beige', 'Grey', 'Cream'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440211',
    name: 'Genuine Leather Belt',
    description: 'Classic leather belt with silver buckle',
    price: 79,
    sale_price: 59,
    is_sale: true,
    image_url: '/images/Genuine Leather Belt.jpg',
    rating: 4.5,
    review_count: 47,
    brand: 'LEATHER GOODS',
    category: 'accessories',
    subcategory: 'belts',
    tags: ['leather', 'classic', 'silver'],
    sizes: ['30', '32', '34', '36', '38', '40'],
    colors: ['Black', 'Brown', 'Cognac'],
    stock_quantity: 40
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440212',
    name: 'Minimalist Card Holder',
    description: 'Slim card holder with RFID protection',
    price: 49,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Minimalist Card Holder.jpg',
    rating: 4.6,
    review_count: 67,
    brand: 'MINIMAL GEAR',
    category: 'accessories',
    subcategory: 'wallets',
    tags: ['minimalist', 'RFID', 'slim'],
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Navy'],
    stock_quantity: 55
  },

  // MISSING MEN'S PRODUCTS (0103-0112)
  {
    id: '550e8400-e29b-41d4-a716-446655440103',
    name: 'Stretch Chino Trousers',
    description: 'Versatile chinos with comfortable stretch fabric',
    price: 159,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Stretch Chino Trousers.jpg',
    rating: 4.6,
    review_count: 42,
    brand: 'MODERN FIT',
    category: 'men',
    subcategory: 'pants',
    tags: ['chino', 'stretch', 'versatile'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Olive', 'Stone'],
    stock_quantity: 32
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440104',
    name: 'Slim-Fit Dark Wash Jeans',
    description: 'Contemporary jeans with perfect fit',
    price: 179,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Slim-Fit Dark Wash Jeans.jpg',
    rating: 4.8,
    review_count: 56,
    brand: 'DENIM MASTERS',
    category: 'men',
    subcategory: 'pants',
    tags: ['jeans', 'slim-fit', 'dark-wash'],
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Dark Indigo', 'Black', 'Charcoal'],
    stock_quantity: 28
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440105',
    name: 'Navy Wool Business Suit',
    description: 'Sharp business suit in premium wool',
    price: 899,
    sale_price: 719,
    is_sale: true,
    image_url: '/images/Navy Wool Business Suit.jpg',
    rating: 4.9,
    review_count: 23,
    brand: 'EXECUTIVE STYLE',
    category: 'men',
    subcategory: 'suits',
    tags: ['navy', 'wool', 'business'],
    sizes: ['38R', '40R', '42R', '44R', '46R'],
    colors: ['Navy Blue', 'Charcoal', 'Black'],
    stock_quantity: 12
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440106',
    name: 'Quilted Bomber Jacket',
    description: 'Modern bomber with quilted detailing',
    price: 249,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Quilted Bomber Jacket.jpg',
    rating: 4.6,
    review_count: 31,
    brand: 'URBAN LAYER',
    category: 'men',
    subcategory: 'outerwear',
    tags: ['bomber', 'quilted', 'modern'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Olive Green'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440107',
    name: 'Wool Pea Coat',
    description: 'Classic naval-inspired wool coat',
    price: 379,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Wool Pea Coat.jpg',
    rating: 4.8,
    review_count: 19,
    brand: 'NAVAL HERITAGE',
    category: 'men',
    subcategory: 'outerwear',
    tags: ['pea-coat', 'wool', 'naval'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue', 'Charcoal', 'Camel'],
    stock_quantity: 15
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440108',
    name: 'Leather Dress Oxfords',
    description: 'Handcrafted leather oxfords for formal occasions',
    price: 299,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Leather Dress Oxfords.jpg',
    rating: 4.7,
    review_count: 38,
    brand: 'GENTLEMAN SHOES',
    category: 'men',
    subcategory: 'shoes',
    tags: ['oxford', 'leather', 'formal'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'Brown', 'Cognac'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440109',
    name: 'Canvas High-Top Sneakers',
    description: 'Classic canvas sneakers with rubber sole',
    price: 119,
    sale_price: 89,
    is_sale: true,
    image_url: '/images/Canvas High-Top Sneakers.jpg',
    rating: 4.4,
    review_count: 67,
    brand: 'STREET CLASSIC',
    category: 'men',
    subcategory: 'shoes',
    tags: ['canvas', 'high-top', 'casual'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy', 'Red'],
    stock_quantity: 45
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440110',
    name: 'Leather Messenger Bag',
    description: 'Professional messenger bag in genuine leather',
    price: 225,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Leather Messenger Bag.jpg',
    rating: 4.8,
    review_count: 26,
    brand: 'WORK GEAR',
    category: 'men',
    subcategory: 'accessories',
    tags: ['messenger', 'leather', 'professional'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Cognac'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440111',
    name: 'Minimalist Steel Watch',
    description: 'Clean design watch with stainless steel band',
    price: 189,
    sale_price: null,
    is_sale: false,
    image_url: '/images/Minimalist Steel Watch.jpg',
    rating: 4.6,
    review_count: 44,
    brand: 'TIME PIECE',
    category: 'men',
    subcategory: 'watches',
    tags: ['minimalist', 'steel', 'classic'],
    sizes: ['One Size'],
    colors: ['Silver', 'Black', 'Gold'],
    stock_quantity: 30
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440112',
    name: 'Vintage Leather Strap Watch',
    description: 'Retro-inspired watch with aged leather strap',
    price: 149,
    sale_price: 119,
    is_sale: true,
    image_url: '/images/Vintage Leather Strap Watch.jpg',
    rating: 4.5,
    review_count: 33,
    brand: 'RETRO TIME',
    category: 'men',
    subcategory: 'watches',
    tags: ['vintage', 'leather', 'retro'],
    sizes: ['One Size'],
    colors: ['Brown', 'Black', 'Tan'],
    stock_quantity: 24
  },

  // MISSING ACCESSORIES PRODUCTS (0203-0212)
  {
    id: '550e8400-e29b-41d4-a716-446655440203',
    name: 'Sterling Silver Signet Ring',
    description: 'Classic signet ring in polished sterling silver',
    price: 165,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.7,
    review_count: 29,
    brand: 'SILVER CRAFT',
    category: 'accessories',
    subcategory: 'jewelry',
    tags: ['sterling', 'signet', 'classic'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    colors: ['Silver'],
    stock_quantity: 35
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440204',
    name: 'Silk Pocket Square Set',
    description: 'Premium silk pocket squares in various patterns',
    price: 89,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.6,
    review_count: 18,
    brand: 'GENTLEMAN STYLE',
    category: 'accessories',
    subcategory: 'formal',
    tags: ['silk', 'pocket-square', 'formal'],
    sizes: ['One Size'],
    colors: ['Navy Pattern', 'Burgundy Pattern', 'Classic White'],
    stock_quantity: 42
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440205',
    name: 'Leather Card Wallet',
    description: 'Minimalist leather wallet for cards and cash',
    price: 78,
    sale_price: 59,
    is_sale: true,
    image_url: '/placeholder.svg',
    rating: 4.8,
    review_count: 51,
    brand: 'MINIMAL WALLET',
    category: 'accessories',
    subcategory: 'wallets',
    tags: ['leather', 'minimal', 'cards'],
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Navy'],
    stock_quantity: 67
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440206',
    name: 'Cashmere Scarf',
    description: 'Luxurious cashmere scarf for warmth and style',
    price: 195,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.9,
    review_count: 34,
    brand: 'LUXURY KNITS',
    category: 'accessories',
    subcategory: 'scarves',
    tags: ['cashmere', 'luxury', 'warm'],
    sizes: ['One Size'],
    colors: ['Charcoal', 'Camel', 'Navy', 'Burgundy'],
    stock_quantity: 28
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440207',
    name: 'Leather Belt with Brass Buckle',
    description: 'Classic leather belt with antique brass buckle',
    price: 125,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.7,
    review_count: 42,
    brand: 'CLASSIC LEATHER',
    category: 'accessories',
    subcategory: 'belts',
    tags: ['leather', 'brass', 'classic'],
    sizes: ['30', '32', '34', '36', '38', '40'],
    colors: ['Brown', 'Black', 'Cognac'],
    stock_quantity: 38
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440208',
    name: 'Designer Sunglasses',
    description: 'Premium sunglasses with UV protection',
    price: 285,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.8,
    review_count: 27,
    brand: 'SUN LUXURY',
    category: 'accessories',
    subcategory: 'sunglasses',
    tags: ['designer', 'uv-protection', 'premium'],
    sizes: ['One Size'],
    colors: ['Black Frame', 'Tortoise Shell', 'Gold Frame'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440209',
    name: 'Tech Organizer Pouch',
    description: 'Compact pouch for organizing tech accessories',
    price: 65,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.5,
    review_count: 48,
    brand: 'TECH GEAR',
    category: 'accessories',
    subcategory: 'tech',
    tags: ['tech', 'organizer', 'compact'],
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy'],
    stock_quantity: 55
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440210',
    name: 'Woolen Beanie Hat',
    description: 'Cozy woolen beanie for cold weather',
    price: 45,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.4,
    review_count: 63,
    brand: 'WINTER WEAR',
    category: 'accessories',
    subcategory: 'hats',
    tags: ['woolen', 'beanie', 'winter'],
    sizes: ['One Size'],
    colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
    stock_quantity: 75
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440211',
    name: 'Cufflinks Set',
    description: 'Elegant cufflinks for formal occasions',
    price: 155,
    sale_price: null,
    is_sale: false,
    image_url: '/placeholder.svg',
    rating: 4.8,
    review_count: 21,
    brand: 'FORMAL WEAR',
    category: 'accessories',
    subcategory: 'jewelry',
    tags: ['cufflinks', 'formal', 'elegant'],
    sizes: ['One Size'],
    colors: ['Silver', 'Gold', 'Black'],
    stock_quantity: 33
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440212',
    name: 'Travel Duffel Bag',
    description: 'Spacious duffel bag for weekend trips',
    price: 189,
    sale_price: 149,
    is_sale: true,
    image_url: '/placeholder.svg',
    rating: 4.6,
    review_count: 37,
    brand: 'TRAVEL GEAR',
    category: 'accessories',
    subcategory: 'bags',
    tags: ['duffel', 'travel', 'weekend'],
    sizes: ['One Size'],
    colors: ['Black', 'Navy', 'Olive'],
    stock_quantity: 26
  },

  // Men's products from Men.tsx (exact match for navigation)
  {
    id: '550e8400-e29b-41d4-a716-446655440050',
    name: 'Oxford Button-Down Shirt',
    description: 'Classic Oxford cotton button-down shirt',
    price: 89,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'shirts',
    brand: 'CLASSIC FIT',
    image_url: 'Oxford Button-Down Shirt.jpg',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Blue', 'Light Blue'],
    stock_quantity: 67,
    rating: 4.5,
    review_count: 67,
    tags: ['oxford', 'cotton', 'formal']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440051',
    name: 'Linen Weekend Shirt',
    description: 'Relaxed linen shirt for casual weekends',
    price: 125,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'shirts',
    brand: 'COASTAL CASUAL',
    image_url: 'Linen Weekend Shirt.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Navy', 'Khaki'],
    stock_quantity: 34,
    rating: 4.3,
    review_count: 34,
    tags: ['linen', 'casual', 'summer']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440052',
    name: 'Organic Cotton Henley',
    description: 'Soft organic cotton henley shirt',
    price: 65,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'shirts',
    brand: 'ECO BASICS',
    image_url: 'organic cotton henley.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Heather Gray', 'Navy', 'Black'],
    stock_quantity: 89,
    rating: 4.4,
    review_count: 89,
    tags: ['organic', 'cotton', 'henley']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440053',
    name: 'Stretch Chino Trousers',
    description: 'Comfortable stretch chino pants',
    price: 95,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'pants',
    brand: 'FLEX FIT',
    image_url: 'Stretch Chino Trousers.jpg',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Black'],
    stock_quantity: 45,
    rating: 4.6,
    review_count: 45,
    tags: ['chino', 'stretch', 'casual']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440054',
    name: 'Slim Fit Chino Pants',
    description: 'Navy blue slim fit chino pants',
    price: 85,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'pants',
    brand: 'TAILORED FIT',
    image_url: 'Slim Fit Chino Pants in navy blue.jpg',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Navy', 'Khaki', 'Gray'],
    stock_quantity: 52,
    rating: 4.5,
    review_count: 52,
    tags: ['chino', 'slim', 'navy']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440055',
    name: 'Slim-Fit Dark Wash Jeans',
    description: 'Premium dark wash denim jeans',
    price: 115,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'pants',
    brand: 'DENIM WORKS',
    image_url: 'Slim-Fit Dark Wash Jeans.jpg',
    sizes: ['30', '32', '34', '36', '38'],
    colors: ['Dark Wash', 'Black'],
    stock_quantity: 78,
    rating: 4.7,
    review_count: 78,
    tags: ['jeans', 'slim', 'dark wash']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440056',
    name: 'Quilted Bomber Jacket',
    description: 'Modern quilted bomber jacket',
    price: 185,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'outerwear',
    brand: 'STREET STYLE',
    image_url: 'Quilted Bomber Jacket.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive'],
    stock_quantity: 29,
    rating: 4.4,
    review_count: 29,
    tags: ['bomber', 'quilted', 'casual']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440057',
    name: 'Wool Pea Coat',
    description: 'Classic wool pea coat for winter',
    price: 298,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'outerwear',
    brand: 'WINTER CLASSIC',
    image_url: 'Wool Pea Coat.jpg',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Navy'],
    stock_quantity: 41,
    rating: 4.8,
    review_count: 41,
    tags: ['wool', 'pea coat', 'winter']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440058',
    name: 'Navy Wool Business Suit',
    description: 'Professional navy wool business suit',
    price: 595,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'suits',
    brand: 'EXECUTIVE',
    image_url: 'Navy Wool Business Suit.jpg',
    sizes: ['38R', '40R', '42R', '44R'],
    colors: ['Navy', 'Charcoal'],
    stock_quantity: 18,
    rating: 4.9,
    review_count: 18,
    tags: ['wool', 'navy', 'business']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440059',
    name: 'Leather Dress Oxfords',
    description: 'Premium leather Oxford dress shoes',
    price: 245,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'shoes',
    brand: 'CLASSIC LEATHER',
    image_url: 'Leather Dress Oxfords.jpg',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Black', 'Brown'],
    stock_quantity: 33,
    rating: 4.6,
    review_count: 33,
    tags: ['leather', 'oxford', 'formal']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440060',
    name: 'Canvas High-Top Sneakers',
    description: 'Classic canvas high-top sneakers',
    price: 85,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'shoes',
    brand: 'STREET CLASSIC',
    image_url: 'Canvas High-Top Sneakers.jpg',
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['White', 'Black', 'Navy'],
    stock_quantity: 67,
    rating: 4.3,
    review_count: 67,
    tags: ['canvas', 'sneakers', 'casual']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440061',
    name: 'Leather Messenger Bag',
    description: 'Professional leather messenger bag',
    price: 195,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'accessories',
    brand: 'PROFESSIONAL',
    image_url: 'Leather Messenger Bag.jpg',
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock_quantity: 24,
    rating: 4.7,
    review_count: 24,
    tags: ['leather', 'messenger', 'business']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440062',
    name: 'Minimalist Steel Watch',
    description: 'Clean minimalist steel watch',
    price: 155,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'watches',
    brand: 'TIME MINIMAL',
    image_url: 'Minimalist Steel Watch.jpg',
    sizes: ['One Size'],
    colors: ['Silver', 'Black'],
    stock_quantity: 45,
    rating: 4.5,
    review_count: 45,
    tags: ['steel', 'minimalist', 'modern']
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440063',
    name: 'Vintage Leather Strap Watch',
    description: 'Classic vintage-style leather strap watch',
    price: 135,
    sale_price: null,
    is_sale: false,
    category: 'men',
    subcategory: 'watches',
    brand: 'VINTAGE TIME',
    image_url: 'Vintage Leather Strap Watch.jpg',
    sizes: ['One Size'],
    colors: ['Brown', 'Black'],
    stock_quantity: 38,
    rating: 4.4,
    review_count: 38,
    tags: ['leather', 'vintage', 'classic']
  },

  // Sale products (matching Sale.tsx exactly)
  {
    id: '550e8400-e29b-41d4-a716-446655440301',
    name: 'Cashmere Wrap Cardigan',
    description: 'Luxurious cashmere cardigan in blush pink',
    price: 398,
    sale_price: 239,
    is_sale: true,
    image_url: '/images/Cashmere Wrap Cardigan.jpg',
    rating: 4.8,
    review_count: 42,
    brand: 'CASHMERE DREAMS',
    category: 'women',
    subcategory: 'outerwear',
    tags: ['cashmere', 'cardigan', 'luxury'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blush Pink', 'Cream', 'Light Grey'],
    stock_quantity: 15
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440302',
    name: 'Floral Wrap Maxi Dress',
    description: 'Flowing maxi dress with botanical print',
    price: 285,
    sale_price: 171,
    is_sale: true,
    image_url: '/images/Floral Wrap Maxi Dress.jpg',
    rating: 4.6,
    review_count: 38,
    brand: 'BLOOM & CO',
    category: 'women',
    subcategory: 'dresses',
    tags: ['floral', 'maxi', 'wrap'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Floral Print', 'Multi'],
    stock_quantity: 22
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440303',
    name: 'Leather Ankle Boots',
    description: 'Premium leather boots with block heel',
    price: 245,
    sale_price: 147,
    is_sale: true,
    image_url: 'Leather Ankle Boots.jpg',
    rating: 4.7,
    review_count: 29,
    brand: 'STEP CLASSIC',
    category: 'women',
    subcategory: 'shoes',
    tags: ['leather', 'ankle', 'boots'],
    sizes: ['5', '6', '7', '8', '9', '10'],
    colors: ['Black', 'Brown', 'Cognac'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440304',
    name: 'Silk Blouse with Bow Tie',
    description: 'Elegant silk blouse with detachable bow',
    price: 175,
    sale_price: 105,
    is_sale: true,
    image_url: '/images/Silk Blouse with Bow Tie.jpg',
    rating: 4.5,
    review_count: 33,
    brand: 'SILK ESSENCE',
    category: 'women',
    subcategory: 'tops',
    tags: ['silk', 'blouse', 'bow'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['White', 'Blush', 'Navy'],
    stock_quantity: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440305',
    name: 'Merino Wool V-Neck Sweater',
    description: 'Classic v-neck sweater in charcoal grey',
    price: 165,
    sale_price: 99,
    is_sale: true,
    image_url: '/images/Merino Wool V-Neck Sweater.jpg',
    rating: 4.6,
    review_count: 45,
    brand: 'WOOL & CO',
    category: 'men',
    subcategory: 'tops',
    tags: ['merino', 'v-neck', 'sweater'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Charcoal Grey', 'Navy', 'Black'],
    stock_quantity: 30
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440306',
    name: 'Slim Fit Chino Pants',
    description: 'Modern fit chinos in navy blue',
    price: 89,
    sale_price: 53,
    is_sale: true,
    image_url: '/images/Slim Fit Chino Pants in navy blue.jpg',
    rating: 4.4,
    review_count: 52,
    brand: 'URBAN FIT',
    category: 'men',
    subcategory: 'bottoms',
    tags: ['chino', 'slim-fit', 'navy'],
    sizes: ['30', '32', '34', '36', '38', '40'],
    colors: ['Navy Blue', 'Khaki', 'Black'],
    stock_quantity: 45
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440307',
    name: 'Quilted Bomber Jacket',
    description: 'Lightweight bomber with quilted details',
    price: 195,
    sale_price: 117,
    is_sale: true,
    image_url: '/images/Quilted Bomber Jacket.jpg',
    rating: 4.7,
    review_count: 36,
    brand: 'BOMBER STYLE',
    category: 'men',
    subcategory: 'outerwear',
    tags: ['bomber', 'quilted', 'lightweight'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Olive'],
    stock_quantity: 20
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440308',
    name: 'Oxford Leather Dress Shoes',
    description: 'Classic oxford shoes in cognac leather',
    price: 285,
    sale_price: 171,
    is_sale: true,
    image_url: '/images/Oxford Leather Dress Shoes.jpg',
    rating: 4.8,
    review_count: 27,
    brand: 'OXFORD CRAFT',
    category: 'men',
    subcategory: 'shoes',
    tags: ['oxford', 'leather', 'dress'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: ['Cognac', 'Black', 'Brown'],
    stock_quantity: 16
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440309',
    name: 'Italian Leather Handbag',
    description: 'Structured handbag in burgundy leather',
    price: 425,
    sale_price: 255,
    is_sale: true,
    image_url: '/images/image.png',
    rating: 4.9,
    review_count: 31,
    brand: 'MILANO BAGS',
    category: 'accessories',
    subcategory: 'bags',
    tags: ['italian', 'leather', 'handbag'],
    sizes: ['One Size'],
    colors: ['Burgundy', 'Black', 'Navy'],
    stock_quantity: 12
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440310',
    name: 'Swiss Automatic Watch',
    description: 'Precision timepiece with steel bracelet',
    price: 895,
    sale_price: 537,
    is_sale: true,
    image_url: '/images/Swiss Automatic Watch.jpg',
    rating: 4.8,
    review_count: 24,
    brand: 'SWISS TIME',
    category: 'accessories',
    subcategory: 'watches',
    tags: ['swiss', 'automatic', 'steel'],
    sizes: ['One Size'],
    colors: ['Steel', 'Black Steel'],
    stock_quantity: 8
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440311',
    name: 'Designer Sunglasses',
    description: 'Vintage-inspired frames with UV protection',
    price: 225,
    sale_price: 135,
    is_sale: true,
    image_url: '/images/Designer Sunglasses.jpg',
    rating: 4.5,
    review_count: 39,
    brand: 'SHADE STYLE',
    category: 'accessories',
    subcategory: 'sunglasses',
    tags: ['designer', 'vintage', 'uv'],
    sizes: ['One Size'],
    colors: ['Black', 'Tortoise', 'Gold'],
    stock_quantity: 25
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440312',
    name: 'Pearl Statement Necklace',
    description: 'Elegant cultured pearl necklace',
    price: 315,
    sale_price: 189,
    is_sale: true,
    image_url: '/images/Pearl Statement Necklace.jpg',
    rating: 4.6,
    review_count: 28,
    brand: 'PEARL LUXURY',
    category: 'accessories',
    subcategory: 'jewelry',
    tags: ['pearl', 'statement', 'cultured'],
    sizes: ['One Size'],
    colors: ['Pearl White', 'Silver'],
    stock_quantity: 14
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440313',
    name: 'Bohemian Kimono Jacket',
    description: 'Flowing kimono with paisley print',
    price: 145,
    sale_price: 87,
    is_sale: true,
    image_url: '/images/Bohemian Kimono Jacket.jpg',
    rating: 4.4,
    review_count: 34,
    brand: 'BOHO CHIC',
    category: 'women',
    subcategory: 'outerwear',
    tags: ['kimono', 'bohemian', 'paisley'],
    sizes: ['One Size'],
    colors: ['Multi Print', 'Blue Print'],
    stock_quantity: 18
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440314',
    name: 'Denim Trucker Jacket',
    description: 'Classic denim jacket in stonewashed blue',
    price: 125,
    sale_price: 75,
    is_sale: true,
    image_url: '/images/Denim Trucker Jacket.jpg',
    rating: 4.3,
    review_count: 47,
    brand: 'DENIM CLASSIC',
    category: 'men',
    subcategory: 'outerwear',
    tags: ['denim', 'trucker', 'stonewashed'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Stonewashed Blue', 'Dark Blue'],
    stock_quantity: 35
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440315',
    name: 'Crossbody Phone Bag',
    description: 'Compact crossbody bag for essentials',
    price: 75,
    sale_price: 45,
    is_sale: true,
    image_url: '/images/Crossbody Phone Bag.jpg',
    rating: 4.2,
    review_count: 56,
    brand: 'MINI BAGS',
    category: 'accessories',
    subcategory: 'bags',
    tags: ['crossbody', 'phone', 'compact'],
    sizes: ['One Size'],
    colors: ['Black', 'Brown', 'Pink'],
    stock_quantity: 40
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440316',
    name: 'Wool Blend Peacoat',
    description: 'Double-breasted peacoat in navy wool',
    price: 345,
    sale_price: 207,
    is_sale: true,
    image_url: '/images/Wool Blend Peacoat.jpg',
    rating: 4.7,
    review_count: 22,
    brand: 'NAVAL STYLE',
    category: 'men',
    subcategory: 'outerwear',
    tags: ['peacoat', 'wool', 'double-breasted'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Black', 'Charcoal'],
    stock_quantity: 12
  }
];

// Mock sentiment data for sample products
const getSampleSentimentStats = (productId: string): SentimentStats => {
  return {
    positive: 75,
    negative: 15,
    neutral: 10,
    totalReviews: 25,
    averageScore: 4.5
  };
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [sentimentStats, setSentimentStats] = useState<SentimentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [reviewRefreshTrigger, setReviewRefreshTrigger] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchSentimentStats();
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchSentimentStats();
    }
  }, [reviewRefreshTrigger, id]);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      
      // Fallback to sample data
      const sampleProducts = getAllSampleProducts();
      const sampleProduct = sampleProducts.find(p => p.id === id);
      
      if (sampleProduct) {
        console.log('Using sample product data for ID:', id);
        setProduct(sampleProduct);
      } else {
        toast({
          title: "Error",
          description: "Could not load product details",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSentimentStats = async () => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id);

      if (error) throw error;

      if (reviews && reviews.length > 0) {
        // Check if sentiment columns exist, if not provide defaults
        const reviewsWithSentiment = reviews.map(review => ({
          ...review,
          sentiment_label: (review as any).sentiment_label || 'neutral',
          sentiment_score: (review as any).sentiment_score || 0
        }));

        const positive = reviewsWithSentiment.filter(r => r.sentiment_label === 'positive').length;
        const negative = reviewsWithSentiment.filter(r => r.sentiment_label === 'negative').length;
        const neutral = reviewsWithSentiment.filter(r => r.sentiment_label === 'neutral').length;
        
        const totalReviews = reviews.length;
        const averageScore = reviewsWithSentiment.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / totalReviews;

        setSentimentStats({
          positive,
          negative,
          neutral,
          totalReviews,
          averageScore
        });
      } else {
        setSentimentStats({
          positive: 0,
          negative: 0,
          neutral: 0,
          totalReviews: 0,
          averageScore: 0
        });
      }
    } catch (error) {
      console.error('Error fetching sentiment stats:', error);
      // Set default stats in case of error
      setSentimentStats({
        positive: 0,
        negative: 0,
        neutral: 0,
        totalReviews: 0,
        averageScore: 0
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    if (product.colors.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    addToCart(product.id, quantity, selectedSize, selectedColor);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Homepage
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getSentimentPercentages = () => {
    if (!sentimentStats || sentimentStats.totalReviews === 0) {
      return { positive: 0, negative: 0, neutral: 0 };
    }
    
    return {
      positive: Math.round((sentimentStats.positive / sentimentStats.totalReviews) * 100),
      negative: Math.round((sentimentStats.negative / sentimentStats.totalReviews) * 100),
      neutral: Math.round((sentimentStats.neutral / sentimentStats.totalReviews) * 100)
    };
  };

  const percentages = getSentimentPercentages();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link to="/" className="text-gray-500 hover:text-gray-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Link to={`/${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">
            {product.category}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            <img 
              src={getImageUrl(product.image_url)} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {product.rating} ({product.review_count} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6">
                {product.is_sale ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">${product.sale_price}</span>
                    <span className="text-lg text-gray-500 line-through">${product.price}</span>
                    <Badge variant="destructive">Sale</Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">${product.price}</span>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex gap-4">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="w-4 h-4" />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="text-sm text-gray-600">
              {product.stock_quantity > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock_quantity} available)</span>
              ) : (
                <span className="text-red-600">✗ Out of Stock</span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* AI-Powered Reviews Section */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Reviews (AI-Powered)
            </h2>

            {/* Sentiment Statistics */}
            {sentimentStats && sentimentStats.totalReviews > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Sentiment Analysis Summary
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{percentages.positive}%</div>
                      <div className="text-sm text-gray-600">✅ Positive</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{percentages.neutral}%</div>
                      <div className="text-sm text-gray-600">😐 Neutral</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{percentages.negative}%</div>
                      <div className="text-sm text-gray-600">❌ Negative</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{sentimentStats.totalReviews}</div>
                      <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" />
                        Total Reviews
                      </div>
                    </div>
                  </div>

                  {/* Visual Sentiment Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div className="flex h-full rounded-full overflow-hidden">
                      <div 
                        className="bg-green-500" 
                        style={{ width: `${percentages.positive}%` }}
                      ></div>
                      <div 
                        className="bg-gray-400" 
                        style={{ width: `${percentages.neutral}%` }}
                      ></div>
                      <div 
                        className="bg-red-500" 
                        style={{ width: `${percentages.negative}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-600">
                    Average Sentiment Score: {sentimentStats.averageScore.toFixed(2)} 
                    ({sentimentStats.averageScore > 0.2 ? 'Positive' : sentimentStats.averageScore < -0.2 ? 'Negative' : 'Neutral'})
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Review Form and Reviews Display */}
          <div className="grid lg:grid-cols-2 gap-8">
            <ReviewForm 
              productId={product.id}
              productName={product.name}
              onReviewSubmitted={() => setReviewRefreshTrigger(prev => prev + 1)}
            />
            <ReviewsDisplay 
              productId={product.id}
              refreshTrigger={reviewRefreshTrigger}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
