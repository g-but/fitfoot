import { NextRequest, NextResponse } from 'next/server';

// Enhanced mock product data that mimics Medusa's structure
const products = [
  {
    id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZX',
    title: 'Performance Runner Pro',
    subtitle: 'Professional running shoe with advanced technology',
    description: 'Experience unparalleled performance with our flagship running shoe. Featuring advanced cushioning technology, breathable mesh upper, and responsive midsole for optimal energy return.',
    handle: 'performance-runner-pro',
    status: 'published',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    weight: 280,
    length: null,
    height: null,
    width: null,
    hs_code: null,
    origin_country: 'CH',
    mid_code: null,
    material: 'Synthetic mesh, EVA foam, rubber outsole',
    collection_id: 'pcol_running',
    type_id: 'ptyp_shoes',
    discountable: true,
    external_id: null,
    metadata: {
      gender: 'unisex',
      sport: 'running',
      technology: ['CloudTech', 'EnergyReturn', 'BreatheMesh']
    },
    variants: [
      {
        id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ01',
        title: 'Size 40 / Black',
        product_id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZX',
        sku: 'PRO-RUN-40-BLK',
        barcode: '7612345678901',
        ean: '7612345678901',
        upc: null,
        variant_rank: 0,
        inventory_quantity: 15,
        allow_backorder: false,
        manage_inventory: true,
        weight: 280,
        length: null,
        height: null,
        width: null,
        hs_code: null,
        origin_country: 'CH',
        mid_code: null,
        material: null,
        metadata: {
          size: '40',
          color: 'Black',
          size_eu: '40',
          size_us: '7',
          size_uk: '6.5'
        },
        prices: [
          {
            id: 'ma_01HQZX1YGKF2QJZX1YGKF2QJ02',
            currency_code: 'chf',
            amount: 29900,
            min_quantity: null,
            max_quantity: null,
            price_list_id: null,
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ01',
            region_id: null,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ],
        options: [
          {
            id: 'optval_01HQZX1YGKF2QJZX1YGKF2Q01',
            value: '40',
            option_id: 'opt_size',
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ01',
            metadata: null,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          },
          {
            id: 'optval_01HQZX1YGKF2QJZX1YGKF2Q02',
            value: 'Black',
            option_id: 'opt_color',
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ01',
            metadata: null,
            created_at: '2024-01-15T10:00:00Z',
            updated_at: '2024-01-15T10:00:00Z'
          }
        ],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ03',
        title: 'Size 42 / Black',
        product_id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZX',
        sku: 'PRO-RUN-42-BLK',
        barcode: '7612345678902',
        ean: '7612345678902',
        upc: null,
        variant_rank: 1,
        inventory_quantity: 8,
        allow_backorder: false,
        manage_inventory: true,
        weight: 285,
        metadata: {
          size: '42',
          color: 'Black',
          size_eu: '42',
          size_us: '8.5',
          size_uk: '8'
        },
        prices: [
          {
            id: 'ma_01HQZX1YGKF2QJZX1YGKF2QJ04',
            currency_code: 'chf',
            amount: 29900,
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ03'
          }
        ],
        options: [
          {
            id: 'optval_01HQZX1YGKF2QJZX1YGKF2Q03',
            value: '42',
            option_id: 'opt_size',
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ03'
          },
          {
            id: 'optval_01HQZX1YGKF2QJZX1YGKF2Q04',
            value: 'Black',
            option_id: 'opt_color',
            variant_id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ03'
          }
        ]
      }
    ],
    options: [
      {
        id: 'opt_size',
        title: 'Size',
        product_id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZX',
        metadata: null,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'opt_color',
        title: 'Color',
        product_id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZX',
        metadata: null,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ],
    images: [
      {
        id: 'img_01HQZX1YGKF2QJZX1YGKF2QJ01',
        url: '/images/performance-runner-black-1.jpg',
        metadata: {
          alt: 'Performance Runner Pro - Black - Side View',
          angle: 'side'
        },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'img_01HQZX1YGKF2QJZX1YGKF2QJ02',
        url: '/images/performance-runner-black-2.jpg',
        metadata: {
          alt: 'Performance Runner Pro - Black - Top View',
          angle: 'top'
        },
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ],
    tags: [
      {
        id: 'tag_running',
        value: 'running',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'tag_performance',
        value: 'performance',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ],
    sales_channels: [
      {
        id: 'sc_01HQZX1YGKF2QJZX1YGKF2QJ01',
        name: 'Default Sales Channel',
        description: 'Created by Medusa',
        is_disabled: false,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      }
    ]
  },
  {
    id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZY',
    title: 'Classic Oxford Elite',
    subtitle: 'Premium leather dress shoe',
    description: 'Handcrafted from the finest Italian leather, this classic oxford combines traditional craftsmanship with modern comfort. Perfect for business meetings, formal events, or any occasion that demands sophistication.',
    handle: 'classic-oxford-elite',
    status: 'published',
    weight: 450,
    origin_country: 'IT',
    material: 'Full-grain leather, leather sole',
    metadata: {
      gender: 'men',
      occasion: 'formal',
      craftsmanship: 'handmade'
    },
    variants: [
      {
        id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ05',
        title: 'Size 41 / Brown',
        sku: 'OXF-ELT-41-BRN',
        inventory_quantity: 5,
        metadata: {
          size: '41',
          color: 'Brown',
          size_eu: '41',
          size_us: '8',
          size_uk: '7.5'
        },
        prices: [
          {
            currency_code: 'chf',
            amount: 44900
          }
        ],
        options: [
          { value: '41', option_id: 'opt_size' },
          { value: 'Brown', option_id: 'opt_color' }
        ]
      }
    ],
    options: [
      { id: 'opt_size', title: 'Size' },
      { id: 'opt_color', title: 'Color' }
    ],
    images: [
      {
        url: '/images/oxford-brown-1.jpg',
        metadata: { alt: 'Classic Oxford Elite - Brown - Side View' }
      }
    ],
    tags: [
      { value: 'formal' },
      { value: 'leather' },
      { value: 'oxford' }
    ]
  },
  {
    id: 'prod_01HQZX1YGKF2QJZX1YGKF2QJZZ',
    title: 'Urban Walker Comfort',
    subtitle: 'All-day comfort sneaker',
    description: 'The perfect blend of style and comfort for urban exploration. Features memory foam insole, flexible outsole, and premium materials that adapt to your daily adventures.',
    handle: 'urban-walker-comfort',
    status: 'published',
    weight: 320,
    origin_country: 'PT',
    material: 'Canvas, memory foam, rubber',
    metadata: {
      gender: 'unisex',
      style: 'casual',
      comfort: 'memory-foam'
    },
    variants: [
      {
        id: 'variant_01HQZX1YGKF2QJZX1YGKF2QJ06',
        title: 'Size 39 / White',
        sku: 'URB-WLK-39-WHT',
        inventory_quantity: 12,
        metadata: {
          size: '39',
          color: 'White',
          size_eu: '39',
          size_us: '6.5',
          size_uk: '6'
        },
        prices: [
          {
            currency_code: 'chf',
            amount: 34900
          }
        ],
        options: [
          { value: '39', option_id: 'opt_size' },
          { value: 'White', option_id: 'opt_color' }
        ]
      }
    ],
    options: [
      { id: 'opt_size', title: 'Size' },
      { id: 'opt_color', title: 'Color' }
    ],
    images: [
      {
        url: '/images/urban-walker-white-1.jpg',
        metadata: { alt: 'Urban Walker Comfort - White - Side View' }
      }
    ],
    tags: [
      { value: 'casual' },
      { value: 'comfort' },
      { value: 'urban' }
    ]
  }
]

export async function GET(request: NextRequest) {
  try {
    // Forward request to enhanced Medusa server
    const response = await fetch('http://localhost:9000/store/products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match beta-shop format
    const transformedProducts = data.products?.map((product: any) => ({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price || product.refurbished_price || 0,
      currency: product.currency || 'CHF',
      images: ['/placeholder-shoe.jpg'], // Add default image
      variants: [{
        id: `${product.id}-variant-1`,
        title: 'Default',
        price: product.price || product.refurbished_price || 0,
        inventory: 10
      }],
      category: product.product_type || 'shoes',
      status: 'published',
      product_type: product.product_type,
      condition_grade: product.condition_grade,
      sustainability_data: product.sustainability_data,
      environmental_impact: product.environmental_impact
    })) || [];

    return NextResponse.json({ 
      products: transformedProducts,
      total: transformedProducts.length 
    });
  } catch (error) {
    console.error('Error fetching products from Medusa:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, productId } = body

    if (action === 'get_by_id' && productId) {
      const product = products.find(p => p.id === productId)
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ product })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error processing product request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 