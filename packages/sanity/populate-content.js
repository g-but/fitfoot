const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'm6r6y2se',
  dataset: 'production',
  apiVersion: '2023-05-27',
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN, // Optional: for write operations
})

async function populateContent() {
  try {
    console.log('🚀 Starting to populate Sanity with content...')

    // Create products page content
    const productsPage = await client.createOrReplace({
      _id: 'productsPage',
      _type: 'productsPage',
      heroTitle: 'Our Premium Collection',
      heroSubtitle: 'Swiss-designed footwear and accessories crafted with genuine materials and precision engineering.',
    })
    console.log('✅ Created products page:', productsPage.heroTitle)

    // Create site settings if they don't exist
    const siteSettings = await client.createIfNotExists({
      _id: 'siteSettings',
      _type: 'siteSettings',
      title: 'FitFoot - Swiss Quality Footwear',
      description: 'Premium footwear and accessories designed in Switzerland',
      keywords: ['footwear', 'swiss design', 'premium', 'leather', 'accessories'],
      siteUrl: 'https://fitfoot.ch',
      logo: {
        text: 'FitFoot',
      },
      navigation: [
        { label: 'Home', href: '/' },
        { label: 'Products', href: '/products' },
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
      ],
    })
    console.log('✅ Site settings ready')

    console.log('🎉 Content population completed!')
    console.log('\n📋 Summary:')
    console.log('- Products page content created')
    console.log('- Site settings configured')
    console.log('\n🌐 You can now view your content at:')
    console.log('- Sanity Studio: http://localhost:3333')
    console.log('- Frontend: http://localhost:3000')

  } catch (error) {
    console.error('❌ Error populating content:', error)
  }
}

populateContent() 