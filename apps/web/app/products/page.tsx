import { Button } from '@/components/ui/button'
import { getAllProducts, getProductsPage } from '@/lib/sanity.queries'
import { ArrowRight, Award, Filter, MapPin, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'Premium Products - Swiss Footwear & Accessories',
  description: 'Discover our collection of premium Swiss-designed footwear and accessories. Each piece crafted with genuine materials and precision engineering.',
}

export default async function ProductsPage() {
  // Fetch data from Sanity
  const [products, productsPageData] = await Promise.all([
    getAllProducts(),
    getProductsPage()
  ])

  // Enhanced product data with Swiss details
  const fallbackProducts = [
    {
      _id: '1',
      title: 'Alpine Classic Sneaker',
      type: 'sneaker',
      materials: '100% genuine Italian leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'A timeless design that combines comfort with sophistication',
      price: 'CHF 320',
      featured: true,
    },
    {
      _id: '2',
      title: 'Swiss Heritage Bag',
      type: 'bag',
      materials: '100% genuine leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'Elegant and functional for the modern professional',
      price: 'CHF 280',
      featured: false,
    },
    {
      _id: '3',
      title: 'Mountain Peak Cap',
      type: 'cap',
      materials: 'Premium cotton blend',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'Swiss-inspired design meets contemporary comfort',
      price: 'CHF 95',
      featured: false,
    },
    {
      _id: '4',
      title: 'Precision Boot',
      type: 'sneaker',
      materials: '100% waterproof leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'Engineered for performance and style',
      price: 'CHF 420',
      featured: true,
    },
    {
      _id: '5',
      title: 'Executive Travel Bag',
      type: 'bag',
      materials: 'Premium Swiss leather',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'Perfect companion for business travel',
      price: 'CHF 380',
      featured: false,
    },
    {
      _id: '6',
      title: 'Urban Sport Cap',
      type: 'cap',
      materials: 'Organic cotton',
      designedIn: 'Switzerland',
      madeIn: 'Turkey',
      description: 'Sustainable materials meet timeless design',
      price: 'CHF 85',
      featured: false,
    },
  ]

  const displayProducts = products?.length > 0 ? products : fallbackProducts
  const filterButtons = productsPageData?.filterButtons || [
    { label: 'All Products', value: 'all' },
    { label: 'Sneakers', value: 'sneaker' },
    { label: 'Bags', value: 'bag' },
    { label: 'Caps', value: 'cap' },
  ]

  // Get product type icon
  const getProductIcon = (type: string) => {
    switch (type) {
      case 'sneaker': return '👟'
      case 'bag': return '🎒'
      case 'cap': return '🧢'
      default: return '✨'
    }
  }

  return (
    <div className="relative">
      {/* === HERO SECTION === */}
      <section className="relative py-32 gradient-subtle overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Swiss Quality Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Swiss Collection</span>
            </div>
            
            <h1 className="text-hero font-heading text-foreground mb-6">
              {productsPageData?.heroTitle || 'Our'} 
              <span className="gradient-gold-text block">Products</span>
            </h1>
            
            <p className="text-large text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              {productsPageData?.heroSubtitle || 'Discover our collection of premium footwear and accessories, each piece designed in Switzerland and crafted with the finest materials.'}
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-heading text-primary mb-2">{displayProducts.length}</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Swiss Design</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading text-primary mb-2">Premium</div>
                <div className="text-sm text-muted-foreground">Materials</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === FILTER SECTION === */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-foreground font-medium">Filter by category:</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {filterButtons.map((button: any, index: number) => (
                <Button 
                  key={index} 
                  variant={index === 0 ? "default" : "outline"} 
                  size="sm"
                  className={index === 0 ? "btn-gold" : "btn-outline-gold"}
                >
                  {button.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === PRODUCTS GRID === */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {displayProducts.map((product: any, index) => (
              <div key={product._id} className="card-luxury hover-lift group">
                {/* Product Badge */}
                {product.featured && (
                  <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
                    Featured
                  </div>
                )}
                
                {/* Product Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/15"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                      {getProductIcon(product.type)}
                    </div>
                  </div>
                  
                  {/* Swiss Cross Design Element */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-primary/10">
                    <div className="w-full h-0.5 bg-primary/30 absolute top-1/2 transform -translate-y-1/2"></div>
                    <div className="h-full w-0.5 bg-primary/30 absolute left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading text-foreground group-hover:text-primary transition-colors mb-2">
                        {product.title}
                      </h3>
                      {product.price && (
                        <div className="text-lg font-semibold text-primary">
                          {product.price}
                        </div>
                      )}
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium capitalize ml-3">
                      {product.type}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description || `${product.materials}, designed in ${product.designedIn || 'Switzerland'}`}
                  </p>
                  
                  {/* Materials & Origin */}
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      <span>{product.materials}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>Designed in {product.designedIn} • Made in {product.madeIn}</span>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Link href={`/products/${product.slug?.current || product._id}`}>
                    <Button className="w-full btn-outline-gold group">
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SWISS QUALITY SECTION === */}
      <section className="py-24 gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-section font-heading text-foreground mb-6">
                  Swiss Quality
                  <span className="gradient-gold-text block">Promise</span>
                </h2>
                <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-8"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-premium text-center group hover-lift">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading text-foreground mb-3">Premium Materials</h3>
                  <p className="text-muted-foreground">Only the finest leather and sustainable materials</p>
                </div>
                
                <div className="card-premium text-center group hover-lift">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <Star className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading text-foreground mb-3">Swiss Design</h3>
                  <p className="text-muted-foreground">Precision engineering meets timeless aesthetics</p>
                </div>
                
                <div className="card-premium text-center group hover-lift">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-heading text-foreground mb-3">Ethical Crafting</h3>
                  <p className="text-muted-foreground">Partnering with skilled artisans worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center card-luxury">
            <h2 className="text-section font-heading text-foreground mb-6">
              {productsPageData?.ctaSection?.title || "Can't find what you're looking for?"}
            </h2>
            <p className="text-large text-muted-foreground mb-8 max-w-3xl mx-auto">
              {productsPageData?.ctaSection?.description || "Get in touch with our team. We're always working on new designs and would love to hear from you."}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="btn-gold">
                  {productsPageData?.ctaSection?.buttonText || 'Contact Us'}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" className="btn-outline-gold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 