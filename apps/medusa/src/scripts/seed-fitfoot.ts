import { ExecArgs } from "@medusajs/framework/types"
import { Modules, ProductStatus } from "@medusajs/framework/utils"

export default async function seedFitFootProducts({ container }: ExecArgs) {
  const productModuleService = container.resolve(Modules.PRODUCT)

  console.log("🇨🇭 Seeding FitFoot Swiss Sustainable Footwear...")

  // Simple product data structure that matches MedusaJS expectations
  const products = [
    {
      title: "Alpine Trek Pro - Swiss Made Hiking Boots",
      handle: "alpine-trek-pro-hiking-boots",
      description: "Handcrafted in Switzerland using sustainably sourced leather and recycled materials. These boots are designed for serious mountain adventures while minimizing environmental impact.",
      status: ProductStatus.PUBLISHED,
      options: [
        {
          title: "Size",
          values: ["39", "40", "41", "42", "43"]
        }
      ],
      variants: [
        {
          title: "Size 41",
          sku: "ATP-41-BRN",
          options: {
            Size: "41"
          }
        }
      ],
      tags: ["swiss-made", "sustainable", "hiking", "waterproof"]
    },
    {
      title: "Zurich Urban - Eco-Friendly City Sneakers",
      handle: "zurich-urban-eco-sneakers", 
      description: "Modern urban sneakers crafted from recycled ocean plastic and organic hemp. Perfect for city life with Swiss precision manufacturing and minimal carbon footprint.",
      status: ProductStatus.PUBLISHED,
      options: [
        {
          title: "Size",
          values: ["38", "39", "40", "41", "42"]
        }
      ],
      variants: [
        {
          title: "Size 40",
          sku: "ZUR-40-OCN",
          options: {
            Size: "40"
          }
        }
      ],
      tags: ["sustainable", "urban", "recycled-plastic", "vegan"]
    },
    {
      title: "Basel Work - Sustainable Safety Boots",
      handle: "basel-work-safety-boots",
      description: "Professional safety boots meeting Swiss workplace standards. Made with sustainably sourced materials and designed for long-lasting durability in industrial environments.",
      status: ProductStatus.PUBLISHED,
      options: [
        {
          title: "Size",
          values: ["40", "41", "42", "43", "44"]
        }
      ],
      variants: [
        {
          title: "Size 42",
          sku: "BSL-42-STL",
          options: {
            Size: "42"
          }
        }
      ],
      tags: ["safety", "work-boots", "steel-toe", "sustainable"]
    },
    {
      title: "Matterhorn Winter - Insulated Snow Boots",
      handle: "matterhorn-winter-snow-boots",
      description: "Designed for harsh Swiss winters with premium insulation and waterproof membrane. Made with responsibly sourced materials and built to last decades in extreme conditions.",
      status: ProductStatus.PUBLISHED,
      options: [
        {
          title: "Size",
          values: ["38", "39", "40", "41", "42"]
        }
      ],
      variants: [
        {
          title: "Size 40",
          sku: "MTH-40-CHC",
          options: {
            Size: "40"
          }
        }
      ],
      tags: ["winter", "insulated", "waterproof", "sustainable"]
    },
    {
      title: "Geneva Formal - Sustainable Dress Shoes",
      handle: "geneva-formal-dress-shoes",
      description: "Sophisticated dress shoes crafted with vegetable-tanned leather and cork soles. Perfect for business settings while maintaining our commitment to environmental responsibility.",
      status: ProductStatus.PUBLISHED, 
      options: [
        {
          title: "Size",
          values: ["39", "40", "41", "42", "43"]
        }
      ],
      variants: [
        {
          title: "Size 42",
          sku: "GNV-42-OXF",
          options: {
            Size: "42"
          }
        }
      ],
      tags: ["formal", "business", "vegetable-tanned", "sustainable"]
    }
  ]

  console.log("Creating Swiss sustainable footwear products...")

  for (const productData of products) {
    try {
      await productModuleService.createProducts(productData)
      console.log(`✅ Created: ${productData.title}`)
    } catch (error) {
      console.error(`❌ Failed to create ${productData.title}:`, error)
    }
  }

  console.log("🎉 FitFoot Swiss sustainable footwear seeding completed!")
  console.log("")
  console.log("🔗 Next steps:")
  console.log("   1. Visit http://localhost:9000/admin to manage products")
  console.log("   2. Visit http://localhost:3005/shop to see the storefront")
  console.log("   3. Start customizing your Swiss e-commerce platform!")
} 