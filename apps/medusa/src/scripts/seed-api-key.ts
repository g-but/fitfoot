import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createApiKeysWorkflow, linkSalesChannelsToApiKeyWorkflow } from "@medusajs/medusa/core-flows";

export default async function createApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);

  logger.info("🔑 Creating FitFoot publishable API key...");
  
  // Get existing default sales channel
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    logger.error("❌ No default sales channel found. Please run the main seed script first.");
    return;
  }

  logger.info(`✅ Found default sales channel: ${defaultSalesChannel[0].id}`);

  try {
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
    logger.info(`✅ Created publishable API key: ${publishableApiKey.id}`);

    // Link sales channel to API key
    await linkSalesChannelsToApiKeyWorkflow(container).run({
      input: {
        id: publishableApiKey.id,
        add: [defaultSalesChannel[0].id],
      },
    });
    
    logger.info("✅ Linked sales channel to API key");
    logger.info("🎉 API Key Setup Complete!");
    logger.info("📋 Details:");
    logger.info(`   Key ID: ${publishableApiKey.id}`);
    logger.info("   Title: FitFoot Webshop");
    logger.info("   Type: publishable");
    logger.info("🔧 Update your .env.local with:");
    logger.info(`   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.id}`);
    
  } catch (error) {
    if (error.message && error.message.includes("already exists")) {
      logger.info("ℹ️ API key already exists, which is fine!");
    } else {
      logger.error("❌ Error creating API key:", error);
      throw error;
    }
  }
}
