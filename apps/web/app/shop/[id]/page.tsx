'use client';

import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
    ArrowLeft,
    Award,
    Check,
    Heart,
    Leaf,
    Loader2,
    Minus,
    Plus,
    Recycle,
    Share2,
    ShoppingCart,
    Star,
    Truck
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  product_type: 'new' | 'refurbished';
  condition_grade?: string;
  original_price?: number;
  refurbished_price?: number;
  sustainability_data?: any;
  environmental_impact?: {
    carbon_footprint_saved_kg: number;
    materials_recycled_percentage: number;
    water_saved_liters: number;
    waste_diverted_kg: number;
  };
  refurbishment_history?: any;
  created_at: string;
  category?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  discount?: number;
  sizes?: string[];
  colors?: string[];
  features?: string[];
  materials?: string[];
  care_instructions?: string[];
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  
  const { isLoggedIn } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/store/products/${productId}`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      const data = await response.json();
      
      // Enhance product with additional data for better UX
      const enhancedProduct = {
        ...data.product,
        category: 'Running Shoes',
        brand: 'EcoStep',
        rating: 4.7,
        reviewCount: 89,
        inStock: true,
        discount: data.product.original_price && data.product.price < data.product.original_price ? 
          Math.round(((data.product.original_price - data.product.price) / data.product.original_price) * 100) : 
          undefined,
        sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
        colors: ['Black', 'White', 'Brown'],
        features: [
          'Breathable mesh upper',
          'Cushioned midsole',
          'Durable rubber outsole',
          'Moisture-wicking lining',
          'Reinforced heel counter'
        ],
        materials: ['Recycled polyester', 'Organic cotton', 'Natural rubber'],
        care_instructions: [
          'Clean with damp cloth',
          'Air dry only',
          'Store in cool, dry place',
          'Use shoe trees to maintain shape'
        ]
      };
      
      setProduct(enhancedProduct);
      
      // Set default selections
      if (enhancedProduct.sizes?.length > 0) {
        setSelectedSize(enhancedProduct.sizes[2]);
      }
      if (enhancedProduct.colors?.length > 0) {
        setSelectedColor(enhancedProduct.colors[0]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
    }).format(price / 100);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(product.id, { size: selectedSize, color: selectedColor }, quantity);
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3';
      notification.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <div>
          <div class="font-medium">${product.title} added to cart!</div>
          <div class="text-sm opacity-90">Size: ${selectedSize}, Color: ${selectedColor}</div>
        </div>
      `;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 4000);
      
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async () => {
    if (!isLoggedIn) {
      alert('Please log in to manage your wishlist');
      return;
    }

    setAddingToWishlist(true);
    
    setTimeout(() => {
      setIsInWishlist(!isInWishlist);
      setAddingToWishlist(false);
    }, 500);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gold-600" />
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😞</span>
          </div>
          <h2 className="text-2xl font-heading text-foreground mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'The product you\'re looking for doesn\'t exist or has been removed.'}
          </p>
          <Link href="/shop">
            <button className="btn-gold px-6 py-3 rounded-xl font-medium">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Back to Shop
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isRefurbished = product.product_type === 'refurbished';
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-medium text-foreground truncate mx-4">{product.title}</h1>
        <button onClick={handleShare} className="p-2 hover:bg-gray-100 rounded-lg">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {isRefurbished && (
                  <Badge className="bg-gray-800 text-white">
                    <Recycle className="w-3 h-3 mr-1" />
                    Refurbished
                  </Badge>
                )}
                {hasDiscount && (
                  <Badge className="bg-red-600 text-white">
                    -{product.discount}% OFF
                  </Badge>
                )}
                {product.rating >= 4.8 && (
                  <Badge className="bg-gold-600 text-white">
                    <Award className="w-3 h-3 mr-1" />
                    Top Rated
                  </Badge>
                )}
              </div>
              
              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                disabled={addingToWishlist}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-colors z-10"
              >
                <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
              
              {/* Product Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-8xl opacity-30 group-hover:scale-110 transition-transform">
                  {product.category?.includes('Sneaker') ? '👟' : 
                   product.category?.includes('Boot') ? '🥾' : 
                   product.category?.includes('Sandal') ? '👡' : '👞'}
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-2xl opacity-50">
                  👟
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{product.brand}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{product.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-heading text-foreground mb-3">{product.title}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex text-gold-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl font-bold text-foreground">{formatPrice(product.price)}</div>
                {product.original_price && product.original_price > product.price && (
                  <div className="text-lg text-gray-500 line-through">{formatPrice(product.original_price)}</div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Size</h3>
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 border rounded-lg text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-50 text-gold-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`py-2 px-4 border rounded-lg text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? 'border-gold-500 bg-gold-50 text-gold-700'
                          : 'border-gray-200 hover:border-gray-300'
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
              <h3 className="font-medium text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !product.inStock}
                className={`w-full h-12 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                  isRefurbished 
                    ? 'bg-gray-800 text-white hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed'
                    : 'btn-gold disabled:bg-gray-300 disabled:cursor-not-allowed'
                }`}
              >
                {cartLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>

              {/* Shipping Info */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over CHF 100</span>
              </div>
            </div>

            {/* Sustainability Info */}
            {isRefurbished && product.environmental_impact && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-800">Environmental Impact</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-800">{product.environmental_impact.carbon_footprint_saved_kg}kg</div>
                    <div className="text-gray-600">CO₂ Saved</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{product.environmental_impact.water_saved_liters}L</div>
                    <div className="text-gray-600">Water Saved</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{product.environmental_impact.materials_recycled_percentage}%</div>
                    <div className="text-gray-600">Materials Recycled</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{product.environmental_impact.waste_diverted_kg}kg</div>
                    <div className="text-gray-600">Waste Diverted</div>
                  </div>
                </div>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-medium text-foreground mb-3">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials & Care */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {product.materials && product.materials.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Materials</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {product.materials.map((material, index) => (
                      <li key={index}>• {material}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.care_instructions && product.care_instructions.length > 0 && (
                <div>
                  <h3 className="font-medium text-foreground mb-3">Care Instructions</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {product.care_instructions.map((instruction, index) => (
                      <li key={index}>• {instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 