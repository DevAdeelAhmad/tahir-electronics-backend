"use strict";

const fs = require("fs-extra");
const path = require("path");
const mime = require("mime-types");

async function getOrCreateTag(name, description) {
  // Check if tag exists
  const existingTag = await strapi.db.query("api::tag.tag").findOne({
    where: { name },
  });

  if (existingTag) {
    console.log(`Tag "${name}" already exists, skipping creation`);
    return existingTag;
  }

  // Create new tag
  return await strapi.entityService.create("api::tag.tag", {
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      publishedAt: new Date(),
    },
  });
}

async function getOrCreateCategory(name, description, featured = false) {
  // Check if category exists
  const existingCategory = await strapi.db
    .query("api::category.category")
    .findOne({
      where: { name },
    });

  if (existingCategory) {
    console.log(`Category "${name}" already exists, skipping creation`);
    return existingCategory;
  }

  // Create new category
  return await strapi.entityService.create("api::category.category", {
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      featured,
      publishedAt: new Date(),
    },
  });
}

async function getOrCreateBrand(name, description) {
  // Check if brand exists
  const existingBrand = await strapi.db.query("api::brand.brand").findOne({
    where: { name },
  });

  if (existingBrand) {
    console.log(`Brand "${name}" already exists, skipping creation`);
    return existingBrand;
  }

  // Create new brand
  return await strapi.entityService.create("api::brand.brand", {
    data: {
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      publishedAt: new Date(),
    },
  });
}

async function getOrCreateProduct(data) {
  // Check if product exists by SKU
  const existingProduct = await strapi.db
    .query("api::product.product")
    .findOne({
      where: { sku: data.sku },
    });

  if (existingProduct) {
    console.log(
      `Product "${data.name}" with SKU ${data.sku} already exists, skipping creation`
    );
    return existingProduct;
  }

  // Prepare relationships correctly
  const productData = { ...data };

  // Extract relationship data for later use
  const categories = productData.categories;
  const brand = productData.brand;
  const thumbnail = productData.thumbnail;
  const images = productData.images;
  const relatedProducts = productData.relatedProducts;

  // Remove relationships from initial creation data
  delete productData.categories;
  delete productData.brand;
  delete productData.thumbnail;
  delete productData.images;
  delete productData.relatedProducts;

  // Make sure we're setting this to an empty array to avoid issues with self-reference
  productData.relatedProducts = [];

  // First create the product without any relationships
  const product = await strapi.entityService.create("api::product.product", {
    data: {
      ...productData,
      publishedAt: new Date(),
    },
  });

  // Now let's handle relationships one by one
  try {
    if (categories && categories.length > 0) {
      await strapi.db.query("api::product.product").update({
        where: { id: product.id },
        data: {
          categories: categories,
        },
      });
    }

    if (brand) {
      await strapi.db.query("api::product.product").update({
        where: { id: product.id },
        data: {
          brand: brand,
        },
      });
    }

    if (relatedProducts && relatedProducts.length > 0) {
      await strapi.db.query("api::product.product").update({
        where: { id: product.id },
        data: {
          relatedProducts: relatedProducts,
        },
      });
    }

    // Handle media separately if needed
    if (thumbnail || images) {
      const mediaData = {};
      if (thumbnail) mediaData.thumbnail = thumbnail;
      if (images) mediaData.images = images;

      await strapi.db.query("api::product.product").update({
        where: { id: product.id },
        data: mediaData,
      });
    }

    // Get the updated product
    const updatedProduct = await strapi.db
      .query("api::product.product")
      .findOne({
        where: { id: product.id },
      });

    return updatedProduct;
  } catch (error) {
    console.error(
      `Error updating relationships for product ${product.id}:`,
      error
    );
    // Return the product anyway, even if relationships failed
    return product;
  }
}

async function seedProductData() {
  // Check if product seed has already run
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "product-seed",
  });

  const seedHasRun = await pluginStore.get({ key: "seedHasRun" });

  if (seedHasRun) {
    console.log(
      "Product seed data has already been imported. To reimport, clear your database first."
    );
    return;
  }

  try {
    // Create Product Categories
    console.log("Creating product categories...");
    const bracketFansCategory = await getOrCreateCategory(
      "Bracket Fans",
      "Wall-mounted fans that save space while providing strong and directional airflow, great for shops and warehouses."
    );
    const cablesCategory = await getOrCreateCategory(
      "Cables",
      "Durable and reliable electrical cables that ensure safe and consistent power delivery for all types of installations."
    );
    const camerasCategory = await getOrCreateCategory(
      "Cameras",
      "best for your protection"
    );
    const ceilingFansCategory = await getOrCreateCategory(
      "Ceiling fans",
      "Stylish and powerful fans designed for optimal air circulation in homes, offices, and commercial spaces."
    );
    const energySaversCategory = await getOrCreateCategory(
      "Energy Savers",
      "Long-lasting CFL bulbs that consume less power and provide bright, consistent light for every room."
    );
    const exhaustsCategory = await getOrCreateCategory(
      "Exhausts",
      "Designed to remove stale air, odors, and humidity—perfect for kitchens, bathrooms, and industrial use."
    );
    const ledBulbsCategory = await getOrCreateCategory(
      "LED Bulbs",
      "Modern, energy-saving bulbs that offer bright illumination and long lifespan with lower electricity costs."
    );
    const pedestalFansCategory = await getOrCreateCategory(
      "Pedestal fans",
      "Portable and height-adjustable fans ideal for focused cooling in any room or outdoor setting."
    );
    const solarPanelsCategory = await getOrCreateCategory(
      "Solar Panels",
      "High-efficiency solar panels that convert sunlight into electricity—ideal for homes, businesses, and off-grid setups."
    );

    // Create Brands
    console.log("Creating brands...");
    const royalFans = await getOrCreateBrand(
      "Royal Fans",
      "Royal Fans is a leading fan brand in Pakistan, known for its premium quality, energy efficiency, and long-lasting performance."
    );
    const wahidFans = await getOrCreateBrand(
      "Wahid Fans",
      "Wahid Fans is a trusted name in home appliances, offering high-quality, energy-efficient fans designed for superior performance and durability."
    );

    // Create Products
    console.log("Creating products...");

    // 1. CleanAir 10" Exhaust Fan
    await getOrCreateProduct({
      name: 'CleanAir 10" Exhaust Fan',
      slug: "clean-air-10-exhaust-fan",
      sku: "CAEF-10",
      shortDescription: "Removes moisture, odors, and stale air quickly.",
      description:
        "Ensure proper ventilation with reliable suction:\n\n- 10-inch size suitable for medium-sized rooms\n- Quickly removes smoke, steam, and odors\n- Low power consumption with high performance\n- Easy wall or window installation\n- Plastic body for rust resistance and easy cleaning",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 3455,
        onSale: false,
        currency: "PKR",
      },
      categories: [exhaustsCategory.id],
      brand: royalFans.id,
    });

    // 2. Ceiling Breeze 18" Fan
    await getOrCreateProduct({
      name: 'Ceiling Breeze 18" Fan',
      slug: "solar-breeze-18-fan",
      sku: "CBF-18",
      shortDescription:
        "A solar-powered pedestal fan ideal for load-shedding hours",
      description:
        "The Solar Breeze 18\" Fan runs directly on solar energy, offering excellent air circulation without depending on electricity. It's perfect for outdoor use or areas with frequent power outages. With low energy consumption and a durable build, it's both eco-friendly and reliable.\n\n- Powered directly by solar energy (no electricity needed)\n- 18\" blades for wide and strong airflow\n- Ideal for outdoor areas, shops, or homes without stable power\n- Eco-friendly and low maintenance",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 6500,
        onSale: false,
        currency: "PKR",
      },
      categories: [pedestalFansCategory.id],
      brand: wahidFans.id,
    });

    // 3. EcoSave 23W CFL Bulb
    await getOrCreateProduct({
      name: "EcoSave 23W CFL Bulb",
      slug: "eco-save-23-w-cfl-bulb",
      sku: "ESCFL-23",
      shortDescription: "Energy-efficient light with soft white glow",
      description:
        "Light up your home while saving electricity:\n\n- 23W output equals 100W incandescent brightness\n- Up to 80% energy savings\n- Lifespan of 8,000+ hours\n- Fits in all standard bulb holders\n- Provides soft and comfortable light for eyes",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 9800,
        onSale: false,
        currency: "PKR",
      },
      categories: [energySaversCategory.id],
      brand: royalFans.id,
    });

    // 4. PowerPed 16" Stand Fan
    await getOrCreateProduct({
      name: 'PowerPed 16" Stand Fan',
      slug: "power-ped-16-stand-fan",
      sku: "PPSF-16",
      shortDescription: "Adjustable height fan with wide-angle airflow",
      description:
        'Flexible and powerful cooling for every room:\n\n- 16" blade diameter for strong breeze\n- Adjustable height and 90° oscillation\n- 3-speed settings for personalized cooling\n- Stable base to prevent wobbling\n- Low-noise motor with energy efficiency',
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 8500,
        onSale: false,
        currency: "PKR",
      },
      categories: [pedestalFansCategory.id],
      brand: wahidFans.id,
    });

    // 5. Royal Cool 56" Ceiling Fan
    await getOrCreateProduct({
      name: 'Royal Cool 56" Ceiling Fan',
      slug: "royal-cool-56-ceiling-fan",
      sku: "RCCF-56",
      shortDescription:
        "Stylish, high-performance ceiling fan with strong airflow",
      description:
        "Enhance your space with a blend of style and comfort:\n\n- 56-inch wide blades for maximum air delivery\n- Rust-free body and aerodynamic blade design\n- Energy-saving motor with silent operation\n- Perfect for homes, offices, or hallways\n- Available in multiple colors and finishes",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 76000,
        onSale: false,
        currency: "PKR",
      },
      categories: [ceilingFansCategory.id],
      brand: royalFans.id,
    });

    // 6. SafeLine 1.5mm Copper Cable
    await getOrCreateProduct({
      name: "SafeLine 1.5mm Copper Cable",
      slug: "safe-line-1-5mm-copper-cable",
      sku: "SLCC-1.5",
      shortDescription: "Heat-resistant, durable copper cable",
      description:
        "Built for safety and long-term performance:\n\n- 1.5mm pure copper conductor\n- Double insulation for extra safety\n- Heat and flame-resistant outer layer\n- Suitable for home and industrial wiring\n- Approved for high-load applications",
      hasVariants: false,
      featured: false,
      price: {
        regularPrice: 65000,
        onSale: false,
        currency: "PKR",
      },
      categories: [cablesCategory.id],
      brand: royalFans.id,
    });

    // 7. Solar Panels
    await getOrCreateProduct({
      name: "Solar Panels",
      slug: "solar-panels",
      sku: "SP-150W",
      shortDescription: "High-efficiency solar panel for homes and shops",
      description:
        "Generate clean energy with long-lasting solar power:\n\n- 150W power output for multiple applications\n- Mono/polycrystalline options available\n- Durable frame with weather-resistant glass\n- High energy conversion rate\n- Ideal for home, farm, or commercial installations",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 12300,
        onSale: false,
        currency: "PKR",
      },
      categories: [solarPanelsCategory.id],
      brand: royalFans.id,
    });

    // 8. WallFlow 18" Bracket Fan
    await getOrCreateProduct({
      name: 'WallFlow 18" Bracket Fan',
      slug: "wall-flow-18-bracket-fan",
      sku: "WFBF-18",
      shortDescription: "Wall-mounted fan with adjustable tilt and speed",
      description:
        "Save floor space without compromising on airflow:\n\n- Wall-mounted design for space efficiency\n- Adjustable head for directional airflow\n- Multiple speed options for comfort control\n- Ideal for workshops, stores, kitchens\n- Durable motor with long life",
      hasVariants: false,
      featured: true,
      price: {
        regularPrice: 5600,
        onSale: false,
        currency: "PKR",
      },
      categories: [bracketFansCategory.id],
      brand: wahidFans.id,
    });

    // Mark the seed as completed
    await pluginStore.set({ key: "seedHasRun", value: true });

    console.log("Product seed completed successfully!");
  } catch (error) {
    console.error("Error seeding product data:", error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await seedProductData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
