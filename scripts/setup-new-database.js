"use strict";

/**
 * Comprehensive setup script for new Clothing Store database
 * This script handles permissions, basic configuration, and optional data seeding
 */

async function setupNewDatabase() {
  console.log("Tahir Electronics - New Database Setup");
  console.log("=====================================");

  try {
    // Step 1: Configure permissions
    console.log("\n📋 Step 1: Configuring role permissions...");
    const setupPermissions = require("./configure-permissions");
    await setupPermissions();

    // Step 2: Check if we should seed basic data
    console.log("\n📦 Step 2: Checking for existing data...");

    // Check if we have any products
    const productCount = await strapi.db.query("api::product.product").count();
    const categoryCount = await strapi.db
      .query("api::category.category")
      .count();
    const vendorCount = await strapi.db.query("api::vendor.vendor").count();

    console.log(`   - Products: ${productCount}`);
    console.log(`   - Categories: ${categoryCount}`);
    console.log(`   - Vendors: ${vendorCount}`);

    if (productCount === 0 && categoryCount === 0 && vendorCount === 0) {
      console.log(
        "\n👕 Database appears to be empty. Would you like to seed sample data?"
      );
      console.log("   To seed products, run: npm run seed:products");
      console.log(
        "   This will create sample categories, vendors, and products"
      );
    } else {
      console.log("\n✅ Database contains existing data - skipping seeding");
    }

    // Step 3: Verify essential single types exist
    console.log("\n🔍 Step 3: Verifying essential configurations...");

    // Check/create Global settings
    let globalSettings = await strapi.db.query("api::global.global").findOne();
    if (!globalSettings) {
      console.log("   Creating Global settings...");
      globalSettings = await strapi.entityService.create("api::global.global", {
        data: {
          siteName: "Clothing Store",
          siteDescription:
            "Your trusted source for premium fashion and clothing",
          publishedAt: new Date(),
        },
      });
    }

    // Check/create Site Settings
    let siteSettings = await strapi.db
      .query("api::site-setting.site-setting")
      .findOne();
    if (!siteSettings) {
      console.log("   Creating Site settings...");
      siteSettings = await strapi.entityService.create(
        "api::site-setting.site-setting",
        {
          data: {
            siteName: "Tahir Electronics",
            siteTagline: "Premium Electronics & Gadgets",
            contactEmail: "info@tahirelectronics.com",
            currencyCode: "USD",
            currencySymbol: "$",
            enableQuickbooksSync: true,
            enableStripePayments: true,
            publishedAt: new Date(),
          },
        }
      );
    }

    // Check/create About page
    let aboutPage = await strapi.db.query("api::about.about").findOne();
    if (!aboutPage) {
      console.log("   Creating About page...");
      aboutPage = await strapi.entityService.create("api::about.about", {
        data: {
          title: "About Our Clothing Store",
          subtitle: "Your Partner in Premium Fashion",
          companyHistory:
            "Our clothing store is dedicated to providing high-quality fashion for style enthusiasts.",
          mission:
            "To empower customers with the best fashion choices and premium clothing options.",
          vision:
            "To be the leading provider of innovative fashion solutions and premium clothing.",
          publishedAt: new Date(),
        },
      });
    }

    // Step 4: Verify payment and shipping methods
    console.log(
      "\n💳 Step 4: Setting up basic payment and shipping methods..."
    );

    // Create basic payment methods if none exist
    const paymentMethodCount = await strapi.db
      .query("api::payment-method.payment-method")
      .count();
    if (paymentMethodCount === 0) {
      console.log("   Creating basic payment methods...");

      await strapi.entityService.create("api::payment-method.payment-method", {
        data: {
          name: "Credit Card (Stripe)",
          code: "stripe_card",
          description: "Pay with your credit or debit card",
          isActive: true,
          processingFee: 2.9,
          isFeePercentage: true,
          stripePaymentMethodTypes: ["card"],
          displayOrder: 1,
          publishedAt: new Date(),
        },
      });
    }

    // Create basic shipping methods if none exist
    const shippingMethodCount = await strapi.db
      .query("api::shipping-method.shipping-method")
      .count();
    if (shippingMethodCount === 0) {
      console.log("   Creating basic shipping methods...");

      await strapi.entityService.create(
        "api::shipping-method.shipping-method",
        {
          data: {
            name: "Standard Shipping",
            code: "standard",
            description: "Standard ground shipping (5-7 business days)",
            cost: 9.99,
            isActive: true,
            estimatedDays: 7,
            displayOrder: 1,
            publishedAt: new Date(),
          },
        }
      );

      await strapi.entityService.create(
        "api::shipping-method.shipping-method",
        {
          data: {
            name: "Express Shipping",
            code: "express",
            description: "Express shipping (2-3 business days)",
            cost: 19.99,
            isActive: true,
            estimatedDays: 3,
            displayOrder: 2,
            publishedAt: new Date(),
          },
        }
      );
    }

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📋 Setup Summary:");
    console.log("   ✅ Role permissions configured");
    console.log("   ✅ Global settings created");
    console.log("   ✅ Site settings created");
    console.log("   ✅ About page created");
    console.log("   ✅ Payment methods configured");
    console.log("   ✅ Shipping methods configured");
    console.log("\n🚀 Next Steps:");
    console.log("   1. Start your Strapi server: npm run develop");
    console.log("   2. Access admin panel and verify configurations");
    console.log("   3. If needed, seed products: npm run seed:products");
    console.log("   4. Configure your frontend to connect to the API");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await setupNewDatabase();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
