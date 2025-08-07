"use strict";

/**
 * Seed script for Electronics Brands
 * This script creates sample brands for Tahir Electronics store
 */

async function seedBrands() {
  console.log("📱 Seeding Electronics Brands for Tahir Electronics");
  console.log("===================================================");

  try {
    // Sample electronics brands
    const brandsData = [
      {
        name: "Samsung",
        slug: "samsung",
        description:
          "South Korean multinational conglomerate known for smartphones, TVs, appliances, and semiconductors.",
      },
      {
        name: "Apple",
        slug: "apple",
        description:
          "American technology company famous for iPhone, iPad, Mac computers, and innovative consumer electronics.",
      },
      {
        name: "Sony",
        slug: "sony",
        description:
          "Japanese electronics giant specializing in gaming consoles, audio equipment, cameras, and entertainment.",
      },
      {
        name: "LG",
        slug: "lg",
        description:
          "Korean electronics company known for home appliances, TVs, mobile phones, and innovative displays.",
      },
      {
        name: "HP",
        slug: "hp",
        description:
          "American technology company specializing in computers, printers, and enterprise solutions.",
      },
      {
        name: "Dell",
        slug: "dell",
        description:
          "American computer technology company known for laptops, desktops, and enterprise solutions.",
      },
      {
        name: "Xiaomi",
        slug: "xiaomi",
        description:
          "Chinese electronics company known for smartphones, smart home devices, and affordable technology.",
      },
      {
        name: "Canon",
        slug: "canon",
        description:
          "Japanese multinational corporation specializing in cameras, printers, and imaging solutions.",
      },
      {
        name: "Panasonic",
        slug: "panasonic",
        description:
          "Japanese electronics company known for home appliances, automotive systems, and industrial solutions.",
      },
      {
        name: "Bose",
        slug: "bose",
        description:
          "American audio equipment company known for premium speakers, headphones, and sound systems.",
      },
      {
        name: "Nintendo",
        slug: "nintendo",
        description:
          "Japanese video game company famous for gaming consoles and beloved game franchises.",
      },
      {
        name: "Microsoft",
        slug: "microsoft",
        description:
          "American technology corporation known for Xbox, Surface devices, and software solutions.",
      },
    ];

    // Check if brands already exist
    const existingBrandCount = await strapi.db
      .query("api::brand.brand")
      .count();

    if (existingBrandCount > 0) {
      console.log(
        `⚠️  Found ${existingBrandCount} existing brands. Skipping seeding to avoid duplicates.`
      );
      console.log(
        "   Run the clean:store script first if you want to reset all data."
      );
      return;
    }

    console.log(`\n🌱 Creating ${brandsData.length} electronics brands...`);

    // Create brands
    for (const brandData of brandsData) {
      try {
        const brand = await strapi.entityService.create("api::brand.brand", {
          data: {
            ...brandData,
            publishedAt: new Date(),
          },
        });

        console.log(`   ✅ Created brand: ${brand.name}`);
      } catch (error) {
        console.log(
          `   ❌ Failed to create brand ${brandData.name}: ${error.message}`
        );
      }
    }

    // Final summary
    const finalBrandCount = await strapi.db.query("api::brand.brand").count();
    console.log(`\n🎉 Brand seeding completed!`);
    console.log(`📊 Total brands in database: ${finalBrandCount}`);
    console.log("\n🚀 Next Steps:");
    console.log("   1. Add brand images through the admin panel");
    console.log("   2. Associate products with brands");
    console.log("   3. Use brands for filtering and organization");
  } catch (error) {
    console.error("❌ Brand seeding failed:", error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await seedBrands();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
