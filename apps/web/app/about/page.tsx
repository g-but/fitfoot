import { Button } from '@/components/ui/button'
import { getAboutPage } from '@/lib/sanity.queries'
import { ArrowRight, Award, Leaf, Shield, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'About Us - Premium Quality & Craftsmanship',
  description: 'Learn about Fitfoot\'s commitment to premium materials, quality design, and ethical production. Discover our story and values.',
}

export default async function AboutPage() {
  // Fetch data from Sanity
  const aboutPageData = await getAboutPage()
  


  // Fallback values if no Sanity data
  const fallbackValues = [
    {
      title: 'Quality First',
      description: 'We never compromise on materials or craftsmanship. Every product is made to last generations.',
      icon: 'quality',
    },
    {
      title: 'Premium Design',
      description: 'Our products embody precision, minimalism, and attention to detail.',
      icon: 'design',
    },
    {
      title: 'Ethical Production',
      description: 'We work with trusted partners who share our commitment to fair labor practices.',
      icon: 'ethics',
    },
    {
      title: 'Sustainability',
      description: 'We choose materials and processes that minimize our environmental impact.',
      icon: 'sustainability',
    },
  ]

  // Use Sanity data or fallback
  const values = (aboutPageData?.valuesSection?.values && aboutPageData.valuesSection.values.length > 0) 
    ? aboutPageData.valuesSection.values 
    : fallbackValues
  const teamMembers = aboutPageData?.teamSection?.teamMembers || [
    { 
      name: 'Sarah Mueller', 
      role: 'Founder & CEO', 
      bio: 'Passionate about creating exceptional products that combine timeless design principles with sustainable practices and ethical manufacturing.' 
    },
    { 
      name: 'Thomas Schneider', 
      role: 'Head of Design', 
      bio: 'With over 15 years in luxury goods design, Thomas brings precision and minimalist aesthetics to every product.' 
    },
    { 
      name: 'Elena Weber', 
      role: 'Head of Production', 
      bio: 'Ensures every piece meets our exacting standards through ethical partnerships with master craftsmen in Switzerland and Turkey.' 
    }
  ]

  
  // Get content from Sanity or use fallback
  const content = aboutPageData?.content || []
  const teamSectionTitle = aboutPageData?.teamSection?.title || 'Meet Our Team'
  const valuesSectionTitle = aboutPageData?.valuesSection?.title || 'Our Values'

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'quality': Award,
      'design': Shield, 
      'ethics': Users,
      'sustainability': Leaf,
      'default': Award
    }
    const IconComponent = iconMap[iconName] || iconMap.default
    return <IconComponent className="w-6 h-6 text-primary" />
  }

  return (
    <div className="relative">
      {/* === HERO SECTION === */}
      <section className="relative py-32 gradient-subtle overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h1 className="text-hero font-heading text-foreground mb-6">
                    {aboutPageData?.title || 'About'} 
                    <span className="gradient-gold-text block">Fitfoot</span>
                  </h1>
                  <p className="text-large text-muted-foreground leading-relaxed">
                    {content.length > 0 ? content[0]?.children?.[0]?.text : 'Founded with a passion for quality, Fitfoot represents the perfect fusion of traditional craftsmanship and modern design. We believe that quality footwear and accessories should be both beautiful and built to last.'}
                  </p>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-heading text-primary mb-2">2024</div>
                    <div className="text-sm text-muted-foreground">Founded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading text-primary mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Premium Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-heading text-primary mb-2">∞</div>
                    <div className="text-sm text-muted-foreground">Passion</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/shop">
                    <Button className="btn-gold">
                      Explore Collection
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="btn-outline-gold">
                      Get in Touch
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Visual */}
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/15 rounded-2xl shadow-luxury relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/10 to-primary/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-primary/20">
                      <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L3.09 8.26L4.91 9.74L12 4L19.09 9.74L20.91 8.26L12 2ZM12 6L7 10V18H17V10L12 6Z"/>
                      </svg>
                    </div>
                  </div>
                  {/* Swiss Cross Pattern */}
                  <div className="absolute top-8 right-8 w-8 h-8 bg-primary/10">
                    <div className="w-full h-1 bg-primary/20 absolute top-1/2 transform -translate-y-1/2"></div>
                    <div className="h-full w-1 bg-primary/20 absolute left-1/2 transform -translate-x-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === STORY SECTION === */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section font-heading text-foreground mb-6">
                Our Story
              </h2>
              <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-8"></div>
            </div>
            
            <div className="prose prose-lg mx-auto space-y-8">
              {content.length > 0 ? (
                content.map((block: any, index: number) => (
                  <p key={index} className={`text-muted-foreground leading-relaxed ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                    {block.children?.[0]?.text || ''}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Fitfoot was born from a simple belief: that everyone deserves footwear and accessories that combine exceptional quality with timeless design. Founded in the heart of Switzerland, we draw inspiration from the precision and craftsmanship that our country is known for.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our journey began when our founders, passionate about both design and quality, noticed a gap in the market for truly premium, ethically-made footwear. They set out to create products that would not only look beautiful but would also stand the test of time.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Today, every Fitfoot product is designed in Switzerland and crafted by skilled artisans in Turkey, using only the finest materials. We're proud to offer products that embody Swiss quality while supporting ethical manufacturing practices.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* === VALUES SECTION === */}
      <section className="py-24 gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section font-heading text-foreground mb-6">
                {valuesSectionTitle}
              </h2>
              <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-8"></div>
              <p className="text-large text-muted-foreground max-w-3xl mx-auto">
                These principles guide everything we do, from design to production to customer service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value: any, index: number) => (
                <div key={index} className="card-premium text-center group hover-lift">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                    {getIconComponent(value.icon)}
                  </div>
                  <h3 className="text-xl font-heading text-foreground mb-4 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === TEAM SECTION === */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-section font-heading text-foreground mb-6">
                {teamSectionTitle}
              </h2>
              <div className="w-20 h-1 gradient-gold mx-auto rounded-full mb-8"></div>
              <p className="text-large text-muted-foreground max-w-3xl mx-auto">
                Meet the passionate team behind Fitfoot's commitment to Swiss quality and design excellence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member: any, index: number) => (
                <div key={index} className="card-luxury text-center group hover-lift">
                  {/* Avatar */}
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full mx-auto mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-primary/40">
                        <Users className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-primary font-medium mb-3">
                        {member.role}
                      </p>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-foreground text-background relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform -skew-y-12"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-section font-heading text-background mb-6">
              Ready to Experience
              <span className="gradient-gold-text block">Premium Quality?</span>
            </h2>
            <p className="text-large text-background/80 mb-12 leading-relaxed">
              Join thousands of customers who trust Fitfoot for premium footwear and accessories that combine exceptional design with superior craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/shop">
                <Button size="xl" className="btn-gold">
                  Shop Collection
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="xl" className="border-background/30 text-background hover:bg-background hover:text-foreground">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 