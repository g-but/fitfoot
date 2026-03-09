// Mock product data for development and testing
import { ProductFormData } from '@/types/admin';

export const MOCK_PRODUCTS: ProductFormData[] = [
  {
    id: '1',
    title: 'Eco Runner Sneakers',
    description: 'Comfortable running shoes made from recycled materials',
    category: 'shoes',
    brand: 'EcoFoot',
    gender: 'unisex',
    material: 'Recycled polyester, organic cotton',
    sustainabilityFeatures: ['Recycled components', 'Carbon neutral shipping'],
    careInstructions: 'Machine wash cold, air dry',
    variants: [
      {
        id: 'v1',
        size: '9',
        sizeSystem: 'US',
        color: 'Forest Green',
        condition: 'new',
        price: 129.99,
        inventory: 15,
        sku: 'ECO-RUN-GRN-9',
        images: ['https://via.placeholder.com/400x400/22c55e/ffffff?text=Eco+Runner']
      },
      {
        id: 'v2',
        size: '10',
        sizeSystem: 'US',
        color: 'Ocean Blue',
        condition: 'new',
        price: 129.99,
        inventory: 8,
        sku: 'ECO-RUN-BLU-10',
        images: ['https://via.placeholder.com/400x400/3b82f6/ffffff?text=Eco+Runner']
      }
    ],
    tags: ['running', 'eco-friendly', 'unisex'],
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: 'Vintage Leather Boots',
    description: 'Restored vintage leather boots with modern comfort',
    category: 'shoes',
    brand: 'Heritage',
    gender: 'men',
    material: 'Genuine leather, rubber sole',
    sustainabilityFeatures: ['Refurbished/Restored', 'Locally sourced'],
    careInstructions: 'Polish regularly, condition leather monthly',
    variants: [
      {
        id: 'v3',
        size: '10',
        sizeSystem: 'US',
        color: 'Brown',
        condition: 'like-new',
        price: 199.99,
        compareAtPrice: 250.00,
        inventory: 5,
        sku: 'VIN-BOOT-BRN-10',
        images: ['https://via.placeholder.com/400x400/92400e/ffffff?text=Vintage+Boots']
      }
    ],
    tags: ['vintage', 'leather', 'restored'],
    status: 'active',
    createdAt: '2024-01-10T14:00:00Z',
    updatedAt: '2024-01-18T09:15:00Z'
  },
  {
    id: '3',
    title: 'Organic Cotton Tote',
    description: 'Spacious tote bag made from organic cotton',
    category: 'bags',
    brand: 'GreenCarry',
    gender: 'unisex',
    material: 'Organic cotton canvas',
    sustainabilityFeatures: ['Organic materials', 'Fair trade certified'],
    careInstructions: 'Machine wash cold, line dry',
    variants: [
      {
        id: 'v4',
        size: 'One Size',
        sizeSystem: 'US',
        color: 'Natural',
        condition: 'new',
        price: 39.99,
        inventory: 25,
        sku: 'ORG-TOTE-NAT-OS',
        images: ['https://via.placeholder.com/400x400/f3f4f6/000000?text=Organic+Tote']
      }
    ],
    tags: ['organic', 'cotton', 'tote', 'sustainable'],
    status: 'active',
    createdAt: '2024-01-08T11:30:00Z',
    updatedAt: '2024-01-16T16:45:00Z'
  },
  {
    id: '4',
    title: 'Recycled Denim Jacket',
    description: 'Stylish jacket made from recycled denim',
    category: 'hats',
    brand: 'DenimRevive',
    gender: 'unisex',
    material: 'Recycled denim, organic cotton lining',
    sustainabilityFeatures: ['Recycled materials', 'Low water production'],
    careInstructions: 'Machine wash cold, hang dry',
    variants: [
      {
        id: 'v5',
        size: 'M',
        sizeSystem: 'US',
        color: 'Indigo',
        condition: 'new',
        price: 89.99,
        inventory: 12,
        sku: 'REC-JACKET-IND-M',
        images: ['https://via.placeholder.com/400x400/1e40af/ffffff?text=Denim+Jacket']
      }
    ],
    tags: ['denim', 'recycled', 'jacket', 'upcycled'],
    status: 'draft',
    createdAt: '2024-01-05T13:20:00Z',
    updatedAt: '2024-01-12T10:30:00Z'
  },
  {
    id: '5',
    title: 'Bamboo Fiber Socks',
    description: 'Comfortable socks made from bamboo fiber',
    category: 'shoes',
    brand: 'BambooComfort',
    gender: 'unisex',
    material: 'Bamboo fiber, elastane',
    sustainabilityFeatures: ['Renewable resource', 'Biodegradable'],
    careInstructions: 'Machine wash warm, tumble dry low',
    variants: [
      {
        id: 'v6',
        size: 'L',
        sizeSystem: 'US',
        color: 'Black',
        condition: 'new',
        price: 14.99,
        inventory: 50,
        sku: 'BAM-SOCK-BLK-L',
        images: ['https://via.placeholder.com/400x400/000000/ffffff?text=Bamboo+Socks']
      },
      {
        id: 'v7',
        size: 'M',
        sizeSystem: 'US',
        color: 'White',
        condition: 'new',
        price: 14.99,
        inventory: 35,
        sku: 'BAM-SOCK-WHT-M',
        images: ['https://via.placeholder.com/400x400/ffffff/000000?text=Bamboo+Socks']
      }
    ],
    tags: ['bamboo', 'socks', 'comfortable', 'eco-friendly'],
    status: 'active',
    createdAt: '2024-01-03T09:15:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  }
];
