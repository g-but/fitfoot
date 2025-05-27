import React from 'react'
import { Button } from '@/components/ui/button'
import { getAboutPage } from '@/lib/sanity.queries'

export default async function AboutPage() {
  // Fetch data from Sanity
  const aboutPageData = await getAboutPage()
  


  // Fallback values if no Sanity data
  const fallbackValues = [
    {
      title: 'Quality First',
      description: 'We never compromise on materials or craftsmanship. Every product is made to last.',
      icon: '🏆',
    },
    {
      title: 'Swiss Design',
      description: 'Our products embody Swiss precision, minimalism, and attention to detail.',
      icon: '🇨🇭',
    },
    {
      title: 'Ethical Production',
      description: 'We work with trusted partners who share our commitment to fair labor practices.',
      icon: '🤝',
    },
    {
      title: 'Sustainability',
      description: 'We choose materials and processes that minimize our environmental impact.',
      icon: '🌱',
    },
  ]

  // Use Sanity data or fallback
  const values = aboutPageData?.valuesSection?.values || fallbackValues
  const teamMembers = aboutPageData?.teamSection?.teamMembers || [
    { name: 'Team Member 1', role: 'Founder & CEO', bio: 'Passionate about creating exceptional products that combine Swiss design principles with sustainable practices.' },
    { name: 'Team Member 2', role: 'Head of Design', bio: 'Passionate about creating exceptional products that combine Swiss design principles with sustainable practices.' },
    { name: 'Team Member 3', role: 'Head of Production', bio: 'Passionate about creating exceptional products that combine Swiss design principles with sustainable practices.' }
  ]

  
  // Get content from Sanity or use fallback
  const content = aboutPageData?.content || []
  const teamSectionTitle = aboutPageData?.teamSection?.title || 'Meet Our Team'
  const valuesSectionTitle = aboutPageData?.valuesSection?.title || 'Our Values'

  // Helper function to get icon emoji
  const getIconEmoji = (iconName: string) => {
    const iconMap: { [key: string]: string } = {
      'quality': '🏆',
      'design': '🇨🇭', 
      'ethics': '🤝',
      'sustainability': '🌱'
    }
    return iconMap[iconName] || '🏆'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-neutral-light py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">
                {aboutPageData?.title || 'About Fitfoot'}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {content.length > 0 ? content[0]?.children?.[0]?.text : 'Founded in Switzerland, Fitfoot represents the perfect fusion of traditional craftsmanship and modern design. We believe that quality footwear and accessories should be both beautiful and built to last.'}
              </p>
              <Button variant="accent" size="lg">
                Our Story
              </Button>
            </div>
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-12">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              {content.length > 0 ? (
                content.map((block: any, index: number) => (
                  <p key={index} className={`leading-relaxed mb-8 ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                    {block.children?.[0]?.text || ''}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-xl leading-relaxed mb-8">
                    Fitfoot was born from a simple belief: that everyone deserves footwear and accessories that combine exceptional quality with timeless design. Founded in the heart of Switzerland, we draw inspiration from the precision and craftsmanship that our country is known for.
                  </p>
                  <p className="text-lg leading-relaxed mb-8">
                    Our journey began when our founders, passionate about both design and quality, noticed a gap in the market for truly premium, ethically-made footwear. They set out to create products that would not only look beautiful but would also stand the test of time.
                  </p>
                  <p className="text-lg leading-relaxed">
                    Today, every Fitfoot product is designed in Switzerland and crafted by skilled artisans in Turkey, using only the finest materials. We're proud to offer products that embody Swiss quality while supporting ethical manufacturing practices.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-12">
            {valuesSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{typeof value.icon === 'string' && value.icon.length === 1 ? value.icon : getIconEmoji(value.icon)}</div>
                <h3 className="text-xl font-semibold text-primary mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-12">
            {teamSectionTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto justify-items-center">
            {teamMembers.map((member: any, index: number) => (
              <div key={index} className="text-center">
                <div className="aspect-square bg-gray-200 rounded-full mb-4 mx-auto w-32 h-32"></div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-500">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Experience Swiss Quality?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Discover our collection of premium footwear and accessories, each piece designed with Swiss precision and crafted to last.
          </p>
          <div className="space-x-4">
            <Button variant="secondary" size="lg">
              Shop Collection
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
} 