"use strict";

/**
 * Clean database script for new clothing store
 * This script removes all content data while preserving:
 * - Database schema
 * - User roles and permissions
 * - Authentication configuration
 */

async function cleanDatabaseForNewStore() {
  console.log("🧹 Cleaning Database for New Clothing Store");
  console.log("==========================================");

  try {
    console.log(
      "\n⚠️  This will delete ALL content data but preserve schema and authentication"
    );
    console.log("   - Products, Categories, Vendors will be deleted");
    console.log("   - Orders, Customers, Reviews will be deleted");
    console.log(
      "   - Uploaded files will be preserved (you can manually clean them)"
    );
    console.log("   - User accounts, roles, and permissions will be PRESERVED");
    console.log("   - Schema and content types will be PRESERVED");

    // Get counts before deletion
    console.log("\n📊 Current Data Count:");
    const counts = {
      products: await strapi.db.query("api::product.product").count(),
      categories: await strapi.db.query("api::category.category").count(),
      brands: await strapi.db.query("api::brand.brand").count(),
      vendors: await strapi.db.query("api::vendor.vendor").count(),
      orders: await strapi.db.query("api::order.order").count(),
      customers: await strapi.db.query("api::customer.customer").count(),
      reviews: await strapi.db.query("api::review.review").count(),
      articles: await strapi.db.query("api::article.article").count(),
      carts: await strapi.db.query("api::cart.cart").count(),
      wishlists: await strapi.db.query("api::wishlist.wishlist").count(),
    };

    Object.entries(counts).forEach(([type, count]) => {
      console.log(`   - ${type}: ${count}`);
    });

    if (Object.values(counts).every((count) => count === 0)) {
      console.log("\n✅ Database is already clean - no content data to remove");
      return;
    }

    console.log("\n🗑️  Starting cleanup process...");

    // Delete in order to respect foreign key constraints
    const cleanupOrder = [
      "api::order-item.order-item",
      "api::order.order",
      "api::cart.cart",
      "api::wishlist.wishlist",
      "api::review.review",
      "api::inventory.inventory",
      "api::product-variant.product-variant",
      "api::product.product",
      "api::category.category",
      "api::brand.brand",
      "api::vendor.vendor",
      "api::customer.customer",
      "api::article.article",
      "api::blog-category.blog-category",
      "api::contact-request.contact-request",
      "api::hero-slider.hero-slider",
      "api::special-offer.special-offer",
      "api::tag.tag",
    ];

    for (const contentType of cleanupOrder) {
      try {
        const count = await strapi.db.query(contentType).count();
        if (count > 0) {
          await strapi.db.query(contentType).deleteMany({});
          console.log(`   ✅ Deleted ${count} records from ${contentType}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Skipping ${contentType}: ${error.message}`);
      }
    }

    // Reset single types to default values for clothing store
    console.log("\n🔄 Updating single types for clothing store...");

    // Update Global settings
    try {
      await strapi.db.query("api::global.global").deleteMany({});
      await strapi.entityService.create("api::global.global", {
        data: {
          siteName: "Clothing Store",
          siteDescription:
            "Your trusted source for premium fashion and clothing",
          publishedAt: new Date(),
        },
      });
      console.log("   ✅ Updated Global settings");
    } catch (error) {
      console.log(`   ⚠️  Could not update Global settings: ${error.message}`);
    }

    // Update Site Settings
    try {
      await strapi.db.query("api::site-setting.site-setting").deleteMany({});
      await strapi.entityService.create("api::site-setting.site-setting", {
        data: {
          siteName: "Clothing Store",
          siteTagline: "Premium Fashion & Clothing",
          contactEmail: "info@clothingstore.com",
          currencyCode: "USD",
          currencySymbol: "$",
          enableQuickbooksSync: true,
          enableStripePayments: true,
          publishedAt: new Date(),
        },
      });
      console.log("   ✅ Updated Site settings");
    } catch (error) {
      console.log(`   ⚠️  Could not update Site settings: ${error.message}`);
    }

    // Update About page
    try {
      await strapi.db.query("api::about.about").deleteMany({});
      await strapi.entityService.create("api::about.about", {
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
      console.log("   ✅ Updated About page");
    } catch (error) {
      console.log(`   ⚠️  Could not update About page: ${error.message}`);
    }

    console.log("\n🎉 Database cleanup completed successfully!");
    console.log("\n📋 Cleanup Summary:");
    console.log("   ✅ All content data removed");
    console.log("   ✅ Single types updated for clothing store");
    console.log("   ✅ Schema and content types preserved");
    console.log("   ✅ User accounts and authentication preserved");
    console.log("   ✅ Roles and permissions preserved");
    console.log("\n🚀 Next Steps:");
    console.log(
      "   1. Run: npm run setup:database (to configure basic settings)"
    );
    console.log("   2. Start your server: npm run develop");
    console.log("   3. Access admin panel to verify everything works");
    console.log("   4. Add your clothing store content");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await cleanDatabaseForNewStore();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
