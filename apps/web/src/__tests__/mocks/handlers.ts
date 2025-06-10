import { http, HttpResponse } from 'msw'
import type { Product, HomePage, AboutPage, ContactInfo } from '@/lib/types'

// Mock data
const mockProducts: Product[] = [
  {
    _id: '1',
    _type: 'product',
    title: 'Test Sneaker',
    slug: { current: 'test-sneaker' },
    type: 'sneaker',
    materials: 'Genuine leather',
    designedIn: 'Switzerland',
    madeIn: 'Italy'
  },
  {
    _id: '2',
    _type: 'product',
    title: 'Test Bag',
    slug: { current: 'test-bag' },
    type: 'bag',
    materials: 'Premium canvas',
    designedIn: 'Switzerland',
    madeIn: 'Portugal'
  }
]

const mockHomePage: HomePage = {
  _id: 'home',
  _type: 'homePage',
  title: 'Test Home Page',
  heroTitle: 'Test Hero Title',
  heroSubtitle: 'Test Hero Subtitle',
  featuredProducts: mockProducts.slice(0, 2)
}

const mockAboutPage: AboutPage = {
  _id: 'about',
  _type: 'aboutPage',
  title: 'Test About Page'
}

const mockContactInfo: ContactInfo = {
  _id: 'contact',
  _type: 'contactInfo',
  email: 'test@fitfoot.com'
}

// Request handlers
export const handlers = [
  // Sanity API handlers
  http.get('https://m6r6y2se.api.sanity.io/v2025-05-27/data/query/production', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('query')
    
    if (query?.includes('*[_type == "product"]')) {
      return HttpResponse.json({ result: mockProducts })
    }
    
    if (query?.includes('*[_type == "homePage"]')) {
      return HttpResponse.json({ result: [mockHomePage] })
    }
    
    if (query?.includes('*[_type == "aboutPage"]')) {
      return HttpResponse.json({ result: [mockAboutPage] })
    }
    
    if (query?.includes('*[_type == "contactInfo"]')) {
      return HttpResponse.json({ result: [mockContactInfo] })
    }
    
    return HttpResponse.json({ result: [] })
  }),
  
  // Medusa API handlers
  http.get('http://localhost:9000/store/products', () => {
    return HttpResponse.json({
      products: mockProducts.map(p => ({
        id: p._id,
        title: p.title,
        handle: p.slug.current,
        description: `Description for ${p.title}`,
        images: [],
        variants: []
      }))
    })
  }),
  
  http.get('http://localhost:9000/store/products/:id', ({ params }) => {
    const product = mockProducts.find(p => p._id === params.id)
    if (product) {
      return HttpResponse.json({
        product: {
          id: product._id,
          title: product.title,
          handle: product.slug.current,
          description: `Description for ${product.title}`,
          images: [],
          variants: []
        }
      })
    }
    return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
  })
] 