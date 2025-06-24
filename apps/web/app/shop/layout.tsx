import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop - Sustainable Footwear | FitFoot',
  description: 'Discover our collection of sustainable shoes. Choose from brand new eco-friendly options or expertly refurbished footwear that reduces environmental impact.',
  keywords: 'sustainable shoes, refurbished footwear, eco-friendly shoes, zero waste, FitFoot',
  openGraph: {
    title: 'Shop - Sustainable Footwear | FitFoot',
    description: 'Discover our collection of sustainable shoes. Choose from brand new eco-friendly options or expertly refurbished footwear that reduces environmental impact.',
    type: 'website',
  },
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 