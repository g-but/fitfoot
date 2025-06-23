import { CreateInventoryLevelInput, ExecArgs, IProductModuleService } from "@medusajs/framework/types";
import {
    ContainerRegistrationKeys,
    Modules,
    ProductStatus
} from "@medusajs/framework/utils";
import {
    createApiKeysWorkflow,
    createInventoryLevelsWorkflow,
    createProductCategoriesWorkflow,
    createRegionsWorkflow,
    createSalesChannelsWorkflow,
    createShippingOptionsWorkflow,
    createShippingProfilesWorkflow,
    createStockLocationsWorkflow,
    createTaxRegionsWorkflow,
    linkSalesChannelsToApiKeyWorkflow,
    linkSalesChannelsToStockLocationWorkflow,
    updateStoresWorkflow
} from "@medusajs/medusa/core-flows";

export default async function seedFitFootProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);
  const productService = container.resolve<IProductModuleService>("product");

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system"
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default"
  })
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
    await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default Shipping Profile",
            type: "default",
          },
        ],
      },
    });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: "true",
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Shirts",
          is_active: true,
        },
        {
          name: "Sweatshirts",
          is_active: true,
        },
        {
          name: "Pants",
          is_active: true,
        },
        {
          name: "Merch",
          is_active: true,
        },
      ],
    },
  });

  // Swiss sustainable footwear products
  const swissFootwearProducts = [
    {
      title: "Alpine Trek Pro - Swiss Made Hiking Boots",
      subtitle: "Premium waterproof hiking boots from Swiss Alps",
      description: "Handcrafted in Switzerland using sustainably sourced leather and recycled materials. These boots are designed for serious mountain adventures while minimizing environmental impact.",
      handle: "alpine-trek-pro-hiking-boots",
      is_giftcard: false,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "https://images.unsplash.com/photo-1544966503-7cc6cd46d6ad?w=800&h=600&fit=crop"
        }
      ],
      options: [
        {
          title: "Size",
          values: ["38", "39", "40", "41", "42", "43", "44", "45"]
        },
        {
          title: "Color", 
          values: ["Brown", "Black", "Forest Green"]
        }
      ],
      variants: [
        {
          title: "38 / Brown",
          sku: "ATP-38-BRN",
          manage_inventory: true,
          inventory_quantity: 15,
          prices: [
            {
              currency_code: "chf",
              amount: 29900 // CHF 299.00
            },
            {
              currency_code: "eur", 
              amount: 27500 // EUR 275.00
            }
          ],
          options: {
            "Size": "38",
            "Color": "Brown"
          }
        },
        {
          title: "41 / Black",
          sku: "ATP-41-BLK",
          manage_inventory: true,
          inventory_quantity: 25,
          prices: [
            {
              currency_code: "chf",
              amount: 29900
            },
            {
              currency_code: "eur",
              amount: 27500
            }
          ],
          options: {
            "Size": "41", 
            "Color": "Black"
          }
        }
      ],
      tags: [
        { value: "swiss-made" },
        { value: "sustainable" },
        { value: "hiking" },
        { value: "waterproof" },
        { value: "recycled-materials" }
      ]
    },
    {
      title: "Zurich Urban - Eco-Friendly City Sneakers",
      subtitle: "Stylish sneakers made from recycled ocean plastic",
      description: "Modern urban sneakers crafted from recycled ocean plastic and organic hemp. Perfect for city life with Swiss precision manufacturing and minimal carbon footprint.",
      handle: "zurich-urban-eco-sneakers",
      is_giftcard: false,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop"
        }
      ],
      options: [
        {
          title: "Size",
          values: ["36", "37", "38", "39", "40", "41", "42", "43", "44"]
        },
        {
          title: "Color",
          values: ["Ocean Blue", "Stone Gray", "Forest Green"]
        }
      ],
      variants: [
        {
          title: "39 / Ocean Blue",
          sku: "ZUR-39-OCN",
          manage_inventory: true,
          inventory_quantity: 30,
          prices: [
            {
              currency_code: "chf",
              amount: 18900 // CHF 189.00
            },
            {
              currency_code: "eur",
              amount: 17500
            }
          ],
          options: {
            "Size": "39",
            "Color": "Ocean Blue"
          }
        }
      ],
      tags: [
        { value: "sustainable" },
        { value: "urban" },
        { value: "recycled-plastic" },
        { value: "vegan" },
        { value: "swiss-design" }
      ]
    },
    {
      title: "Basel Work - Sustainable Safety Boots",
      subtitle: "Steel-toe safety boots with eco-friendly materials",
      description: "Professional safety boots meeting Swiss workplace standards. Made with sustainably sourced materials and designed for long-lasting durability in industrial environments.",
      handle: "basel-work-safety-boots",
      is_giftcard: false,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "https://images.unsplash.com/photo-1582897085656-c636d006a246?w=800&h=600&fit=crop"
        }
      ],
      options: [
        {
          title: "Size",
          values: ["39", "40", "41", "42", "43", "44", "45", "46"]
        }
      ],
      variants: [
        {
          title: "42",
          sku: "BSL-42-STL",
          manage_inventory: true,
          inventory_quantity: 20,
          prices: [
            {
              currency_code: "chf",
              amount: 24900 // CHF 249.00
            },
            {
              currency_code: "eur",
              amount: 22900
            }
          ],
          options: {
            "Size": "42"
          }
        }
      ],
      tags: [
        { value: "safety" },
        { value: "work-boots" },
        { value: "steel-toe" },
        { value: "sustainable" },
        { value: "industrial" }
      ]
    },
    {
      title: "Matterhorn Winter - Insulated Snow Boots",
      subtitle: "Warm, waterproof boots for Swiss winters",
      description: "Designed for harsh Swiss winters with premium insulation and waterproof membrane. Made with responsibly sourced materials and built to last decades in extreme conditions.",
      handle: "matterhorn-winter-snow-boots",
      is_giftcard: false,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
        }
      ],
      options: [
        {
          title: "Size",
          values: ["37", "38", "39", "40", "41", "42", "43", "44"]
        },
        {
          title: "Color",
          values: ["Chocolate Brown", "Midnight Black"]
        }
      ],
      variants: [
        {
          title: "40 / Chocolate Brown",
          sku: "MTH-40-CHC",
          manage_inventory: true,
          inventory_quantity: 18,
          prices: [
            {
              currency_code: "chf",
              amount: 35900 // CHF 359.00
            },
            {
              currency_code: "eur",
              amount: 32900
            }
          ],
          options: {
            "Size": "40",
            "Color": "Chocolate Brown"
          }
        }
      ],
      tags: [
        { value: "winter" },
        { value: "insulated" },
        { value: "waterproof" },
        { value: "sustainable" },
        { value: "swiss-tested" }
      ]
    },
    {
      title: "Geneva Formal - Sustainable Dress Shoes",
      subtitle: "Elegant dress shoes for business professionals",
      description: "Sophisticated dress shoes crafted with vegetable-tanned leather and cork soles. Perfect for business settings while maintaining our commitment to environmental responsibility.",
      handle: "geneva-formal-dress-shoes",
      is_giftcard: false,
      status: ProductStatus.PUBLISHED,
      images: [
        {
          url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop"
        }
      ],
      options: [
        {
          title: "Size",
          values: ["38", "39", "40", "41", "42", "43", "44", "45"]
        },
        {
          title: "Style",
          values: ["Oxford", "Derby", "Loafer"]
        }
      ],
      variants: [
        {
          title: "42 / Oxford",
          sku: "GNV-42-OXF",
          manage_inventory: true,
          inventory_quantity: 12,
          prices: [
            {
              currency_code: "chf",
              amount: 39900 // CHF 399.00
            },
            {
              currency_code: "eur",
              amount: 36900
            }
          ],
          options: {
            "Size": "42",
            "Style": "Oxford"
          }
        }
      ],
      tags: [
        { value: "formal" },
        { value: "business" },
        { value: "vegetable-tanned" },
        { value: "sustainable" },
        { value: "handcrafted" }
      ]
    }
  ]

  console.log("Creating Swiss sustainable footwear products...")

  for (const productData of swissFootwearProducts) {
    try {
      const product = await productService.createProducts(productData)
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

  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels.");

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = [];
  for (const inventoryItem of inventoryItems) {
    const inventoryLevel = {
      location_id: stockLocation.id,
      stocked_quantity: 1000000,
      inventory_item_id: inventoryItem.id,
    };
    inventoryLevels.push(inventoryLevel);
  }

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("Finished seeding inventory levels data.");
}
