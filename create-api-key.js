const { MedusaApp } = require('@medusajs/framework');
const { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } = require('@medusajs/medusa/core-flows');
const { Modules } = require('@medusajs/framework/utils');

async function createPublishableApiKey() {
  try {
    console.log("🔑 Creating FitFoot Publishable API Key...");
    
    const app = await MedusaApp({
      loadEnv: true
    });
    
    const container = app.getContainer();
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
    
    // Get existing sales channel
    const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });
    
    if (!defaultSalesChannel.length) {
      console.log("❌ No default sales channel found. Please run the full seed script first.");
      return;
    }
    
    console.log("✅ Found default sales channel:", defaultSalesChannel[0].id);
    
    // Create publishable API key
    const { result: publishableApiKeyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "FitFoot Webshop",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    
    const publishableApiKey = publishableApiKeyResult[0];
    console.log("✅ Created publishable API key:", publishableApiKey.id);
    
    // Link sales channel to API key
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    });
    
    console.log("✅ Linked sales channel to API key");
    console.log("\n🎉 API Key Setup Complete!");
    console.log("📋 Details:");
    console.log("   Key ID:", publishableApiKey.id);
    console.log("   Title: FitFoot Webshop");
    console.log("   Type: publishable");
    console.log("\n🔧 Next steps:");
    console.log("1. Update apps/web/.env.local with:");
    console.log(`   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.id}`);
    console.log("2. Restart the frontend application");
    console.log("3. Test the store API endpoints");
    
    return publishableApiKey;
    
  } catch (error) {
    console.error("❌ Error creating API key:", error);
    
    if (error.message && error.message.includes("already exists")) {
      console.log("ℹ️ API key might already exist");
    }
    
    throw error;
  }
}

createPublishableApiKey()
  .then(() => {
    console.log("🎉 API key creation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 API key creation failed:", error);
    process.exit(1);
  }); 