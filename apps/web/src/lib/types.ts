// Sanity document types
export interface SanityDocument {
  _id: string
  _type: string
  _createdAt?: string
  _updatedAt?: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface SanityBlock {
  _key: string
  _type: 'block'
  children: Array<{
    _key: string
    _type: 'span'
    marks: string[]
    text: string
  }>
  markDefs: any[]
  style: string
}

// Product types
export interface Product extends SanityDocument {
  _type: 'product'
  title: string
  slug: {
    current: string
  }
  type: 'sneaker' | 'bag' | 'cap'
  heroImage?: SanityImage
  gallery?: SanityImage[]
  description?: SanityBlock[]
  materials: string
  designedIn: string
  madeIn: string
}

// Page types
export interface HomePage extends SanityDocument {
  _type: 'homePage'
  title: string
  heroTitle: string
  heroSubtitle: string
  heroImage?: SanityImage
  featuredProducts?: Product[]
  aboutSection?: {
    title: string
    description: string
    features: Array<{
      text: string
    }>
  }
  ctaSection?: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
  }
}

export interface AboutPage extends SanityDocument {
  _type: 'aboutPage'
  title: string
  content?: SanityBlock[]
  heroImage?: SanityImage
  teamSection?: {
    title: string
    description?: SanityBlock[]
    teamMembers: Array<{
      _key: string
      name: string
      role: string
      image?: SanityImage
      bio: string
    }>
  }
  valuesSection?: {
    title: string
    values: Array<{
      _key: string
      title: string
      description: string
      icon: string
    }>
  }
}

export interface ProductsPage extends SanityDocument {
  _type: 'productsPage'
  title: string
  heroTitle: string
  heroSubtitle: string
  heroSubline: string
  heroDescription: string
  heroImage?: SanityImage
  collectionsTitle: string
  collectionsDescription: string
  sustainabilityTitle: string
  sustainabilityDescription: string
  filterButtons?: Array<{
    label: string
    value: string
  }>
  ctaSection?: {
    title: string
    subline: string
    description: string
    buttonText: string
  }
}

export interface ContactPage extends SanityDocument {
  _type: 'contactPage'
  title: string
  heroTitle: string
  heroSubtitle: string
  contactInfoTitle: string
  contactMethods?: Array<{
    icon: 'email' | 'location' | 'phone'
    title: string
    details: string[]
  }>
  formTitle: string
  formFields?: Array<{
    name: string
    label: string
    type: 'text' | 'email' | 'textarea'
    placeholder: string
    required: boolean
  }>
  submitButtonText: string
}

export interface ContactInfo extends SanityDocument {
  _type: 'contactInfo'
  email: string
  phone?: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  socialLinks?: {
    instagram?: string
    facebook?: string
    twitter?: string
    linkedin?: string
  }
  businessHours?: Array<{
    day: string
    hours: string
  }>
}

export interface SiteSettings extends SanityDocument {
  _type: 'siteSettings'
  title: string
  description: string
  keywords: string[]
  siteUrl: string
  logo?: {
    text: string
    image?: SanityImage
  }
  navigation?: Array<{
    label: string
    href: string
  }>
  headerCta?: {
    text: string
    href: string
  }
  footer?: {
    copyright: string
  }
} 