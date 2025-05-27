const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'm6r6y2se',
  dataset: 'production',
  apiVersion: '2025-05-27',
  token: process.env.SANITY_AUTH_TOKEN, // You'll need to get this from Sanity
  useCdn: false
})

async function populateContent() {
  try {
    console.log('🚀 Starting to populate Sanity with initial content...')

    // Create sample products
    const products = [
      {
        _type: 'product',
        title: 'Alpine Sneaker',
        slug: { current: 'alpine-sneaker' },
        type: 'sneaker',
        materials: '100% genuine leather',
        designedIn: 'Switzerland',
        madeIn: 'Turkey',
        description: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Our Alpine Sneaker combines Swiss design precision with premium materials. Crafted from 100% genuine leather, these sneakers offer both style and durability for the modern adventurer.'
              }
            ]
          }
        ]
      },
      {
        _type: 'product',
        title: 'Urban Backpack',
        slug: { current: 'urban-backpack' },
        type: 'bag',
        materials: '100% genuine leather',
        designedIn: 'Switzerland',
        madeIn: 'Turkey',
        description: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'The Urban Backpack is designed for the modern professional. With Swiss precision engineering and premium leather construction, it\'s the perfect companion for work and travel.'
              }
            ]
          }
        ]
      },
      {
        _type: 'product',
        title: 'Classic Cap',
        slug: { current: 'classic-cap' },
        type: 'cap',
        materials: '100% genuine leather',
        designedIn: 'Switzerland',
        madeIn: 'Turkey',
        description: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Our Classic Cap features timeless Swiss design with premium leather details. A perfect accessory that combines style with Swiss craftsmanship.'
              }
            ]
          }
        ]
      }
    ]

    console.log('📦 Creating products...')
    const createdProducts = []
    for (const product of products) {
      const result = await client.create(product)
      createdProducts.push(result)
      console.log(`✅ Created product: ${result.title}`)
    }

    // Create homepage content
    const homePage = {
      _type: 'homePage',
      title: 'Home',
      heroTitle: 'Step into quality.\nDesigned in Switzerland.',
      heroSubtitle: 'Premium footwear and accessories crafted with genuine materials and Swiss precision.',
      featuredProducts: createdProducts.map(product => ({
        _type: 'reference',
        _ref: product._id
      })),
      aboutSection: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Every Fitfoot product is designed with Swiss precision and crafted using only the finest materials. Our commitment to quality ensures that each piece not only looks exceptional but stands the test of time.'
            }
          ]
        }
      ],
      ctaSection: {
        title: 'Ready to Experience Swiss Quality?',
        description: 'Discover our collection of premium footwear and accessories, each piece designed with Swiss precision and crafted to last.',
        buttonText: 'Shop Collection',
        buttonLink: '/products'
      }
    }

    console.log('🏠 Creating homepage content...')
    const homePageResult = await client.create(homePage)
    console.log(`✅ Created homepage: ${homePageResult.title}`)

    // Create contact info
    const contactInfo = {
      _type: 'contactInfo',
      email: 'info@fitfoot.ch',
      phone: '+41 XX XXX XX XX',
      address: {
        street: 'Swiss Design Street',
        city: 'Zurich',
        postalCode: '8001',
        country: 'Switzerland'
      },
      socialLinks: {
        instagram: 'https://instagram.com/fitfoot',
        facebook: 'https://facebook.com/fitfoot',
        twitter: 'https://twitter.com/fitfoot'
      },
      businessHours: [
        { day: 'Monday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Tuesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Wednesday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Thursday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Friday', hours: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', hours: 'Closed' }
      ]
    }

    console.log('📞 Creating contact info...')
    const contactResult = await client.create(contactInfo)
    console.log(`✅ Created contact info`)

    // Create about page content
    const aboutPage = {
      _type: 'aboutPage',
      title: 'About',
      content: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Founded in the heart of Switzerland, Fitfoot represents the perfect fusion of traditional Swiss craftsmanship and contemporary design. Our journey began with a simple belief: that quality footwear and accessories should be both beautiful and built to last.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Every Fitfoot product is meticulously designed in Switzerland, where attention to detail and precision are not just values, but a way of life. We work exclusively with premium materials, ensuring that each piece meets our exacting standards for quality, durability, and style.'
            }
          ]
        },
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Our commitment extends beyond just creating exceptional products. We believe in ethical manufacturing practices and sustainable design, working with trusted partners who share our values and dedication to excellence.'
            }
          ]
        }
      ],
      teamSection: {
        title: 'Our Team',
        description: [
          {
            _type: 'block',
            children: [
              {
                _type: 'span',
                text: 'Behind every Fitfoot product is a passionate team of designers, craftspeople, and quality specialists who share a common vision: to create exceptional footwear and accessories that stand the test of time.'
              }
            ]
          }
        ],
        teamMembers: [
          {
            name: 'Anna Müller',
            role: 'Head of Design',
            bio: 'With over 15 years of experience in Swiss design, Anna leads our creative vision and ensures every product reflects our commitment to excellence.'
          },
          {
            name: 'Marco Weber',
            role: 'Quality Director',
            bio: 'Marco oversees our quality standards and works closely with our manufacturing partners to ensure every product meets our exacting specifications.'
          },
          {
            name: 'Sophie Zimmermann',
            role: 'Sustainability Lead',
            bio: 'Sophie drives our commitment to ethical and sustainable practices, ensuring our products are made responsibly and with respect for the environment.'
          }
        ]
      },
      valuesSection: {
        title: 'Our Values',
        values: [
          {
            title: 'Swiss Quality',
            description: 'Every product is designed with Swiss precision and attention to detail, ensuring exceptional quality that lasts.',
            icon: 'quality'
          },
          {
            title: 'Premium Materials',
            description: 'We use only the finest materials, including 100% genuine leather, to create products that age beautifully.',
            icon: 'materials'
          },
          {
            title: 'Ethical Manufacturing',
            description: 'We work with trusted partners who share our commitment to fair labor practices and sustainable production.',
            icon: 'ethics'
          },
          {
            title: 'Timeless Design',
            description: 'Our designs transcend trends, focusing on classic aesthetics that remain relevant for years to come.',
            icon: 'design'
          }
        ]
      }
    }

    console.log('📄 Creating about page content...')
    const aboutPageResult = await client.create(aboutPage)
    console.log(`✅ Created about page: ${aboutPageResult.title}`)

    console.log('🎉 Successfully populated Sanity with initial content!')
    console.log('\n📋 Summary:')
    console.log(`- Created ${createdProducts.length} products`)
    console.log(`- Created homepage content`)
    console.log(`- Created about page content`)
    console.log(`- Created contact information`)
    console.log('\n🌐 You can now view your content at:')
    console.log('- Sanity Studio: http://localhost:3333')
    console.log('- Frontend: http://localhost:3000')

  } catch (error) {
    console.error('❌ Error populating content:', error)
  }
}

populateContent() 