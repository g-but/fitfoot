import { client } from './sanity.client'
import type { Product, HomePage, AboutPage, ContactInfo, ProductsPage, ContactPage, SiteSettings } from './types'

// Product queries
export const getAllProducts = async (): Promise<Product[]> => {
  return await client.fetch(`
    *[_type == "product"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      type,
      heroImage,
      gallery,
      description,
      materials,
      designedIn,
      madeIn
    }
  `)
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return await client.fetch(`
    *[_type == "product" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      type,
      heroImage,
      gallery,
      description,
      materials,
      designedIn,
      madeIn
    }
  `, { slug })
}

// Page queries
export const getHomePage = async (): Promise<HomePage | null> => {
  // Force fresh data by disabling CDN
  const freshClient = client.withConfig({ useCdn: false })
  
  const data = await freshClient.fetch(`
    *[_type == "homePage"][0] {
      _id,
      _updatedAt,
      title,
      heroTitle,
      heroSubtitle,
      heroImage,
      featuredProducts[]-> {
        _id,
        title,
        slug,
        heroImage,
        type
      },
      aboutSection,
      ctaSection
    }
  `)
  
  return data
}

export const getAboutPage = async (): Promise<AboutPage | null> => {
  return await client.fetch(`
    *[_type == "aboutPage"][0] {
      _id,
      title,
      content,
      heroImage,
      teamSection,
      valuesSection
    }
  `)
}

export const getContactInfo = async (): Promise<ContactInfo | null> => {
  return await client.fetch(`
    *[_type == "contactInfo"][0] {
      _id,
      email,
      phone,
      address,
      socialLinks,
      businessHours
    }
  `)
}

export const getProductsPage = async (): Promise<ProductsPage | null> => {
  return await client.fetch(`
    *[_type == "productsPage"][0] {
      _id,
      title,
      heroTitle,
      heroSubtitle,
      heroImage,
      filterButtons,
      ctaSection
    }
  `)
}

export const getContactPage = async (): Promise<ContactPage | null> => {
  return await client.fetch(`
    *[_type == "contactPage"][0] {
      _id,
      title,
      heroTitle,
      heroSubtitle,
      contactInfoTitle,
      contactMethods,
      formTitle,
      formFields,
      submitButtonText
    }
  `)
}

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  return await client.fetch(`
    *[_type == "siteSettings"][0] {
      _id,
      title,
      description,
      keywords,
      siteUrl,
      logo,
      navigation,
      headerCta,
      footer
    }
  `)
} 