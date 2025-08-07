"use strict";

async function seedHeroSlider() {
  try {
    console.log("Creating hero slider entries...");

    const sliders = [
      {
        heading: "Go Solar, Save More",
        subHeading:
          "Embrace clean energy with reliable solar panels and solar-powered appliances.",
        btnText: "Shop now",
        btnHref: "/shop/all",
        order: 1,
      },
      {
        heading: "Light Up Smarter",
        subHeading:
          "Bright, energy-saving LED and CFL bulbs for a brighter tomorrow",
        btnText: "Shop now",
        btnHref: "/shop/all",
        order: 2,
      },
      {
        heading: "Stay Cool, Stay Comfortable",
        subHeading:
          "Explore our powerful range of fans designed for every space and season.",
        btnText: "Shop now",
        btnHref: "/shop/all",
        order: 3,
      },
    ];

    for (const slider of sliders) {
      const existingSlider = await strapi.db
        .query("api::hero-slider.hero-slider")
        .findOne({
          where: { heading: slider.heading },
        });

      if (!existingSlider) {
        await strapi.entityService.create("api::hero-slider.hero-slider", {
          data: {
            ...slider,
            publishedAt: new Date(),
          },
        });
        console.log(`Created hero slider: ${slider.heading}`);
      } else {
        console.log(
          `Hero slider "${slider.heading}" already exists, skipping...`
        );
      }
    }
  } catch (error) {
    console.error("Error seeding hero slider data:", error);
  }
}

async function seedSpecialOffer() {
  try {
    console.log("Creating special offer entry...");

    const specialOffer = {
      heading: "🌟 Special Offers Just for You",
      description:
        "Take advantage of our limited-time deals across fans, lighting, and solar energy solutions.",
      offer1: "Exclusive collection with unmatched value",
      offer2: "Affordable solar products",
      offer3: "Energy-efficient lighting solutions",
      buttonText: "Explore Products",
      buttonHref: "/shop/all",
    };

    const existingOffer = await strapi.db
      .query("api::special-offer.special-offer")
      .findOne({
        where: { heading: specialOffer.heading },
      });

    if (!existingOffer) {
      await strapi.entityService.create("api::special-offer.special-offer", {
        data: {
          ...specialOffer,
          publishedAt: new Date(),
        },
      });
      console.log("Created special offer");
    } else {
      console.log("Special offer already exists, skipping...");
    }
  } catch (error) {
    console.error("Error seeding special offer data:", error);
  }
}

async function seedShippingBadges() {
  try {
    console.log("Creating shipping badges...");

    const badges = [
      {
        heading: "Easy Returns",
        description: "10 Days Policy",
        order: 1,
      },
      {
        heading: "Fast Delivery",
        description: "Nationwide",
        order: 2,
      },
      {
        heading: "Free Shipping",
        description: "On orders RKR 10000+",
        order: 3,
      },
      {
        heading: "Refund Policy",
        description: "10 Days Policy",
        order: 4,
      },
    ];

    for (const badge of badges) {
      const existingBadge = await strapi.db
        .query("api::shipping-badge.shipping-badge")
        .findOne({
          where: { heading: badge.heading },
        });

      if (!existingBadge) {
        await strapi.entityService.create(
          "api::shipping-badge.shipping-badge",
          {
            data: {
              ...badge,
              publishedAt: new Date(),
            },
          }
        );
        console.log(`Created shipping badge: ${badge.heading}`);
      } else {
        console.log(
          `Shipping badge "${badge.heading}" already exists, skipping...`
        );
      }
    }
  } catch (error) {
    console.error("Error seeding shipping badge data:", error);
  }
}

async function seedGenericData() {
  // Check if generic data seed has already run
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "generic-data-seed",
  });

  const seedHasRun = await pluginStore.get({ key: "seedHasRun" });

  if (seedHasRun) {
    console.log(
      "Generic data seed has already been imported. To reimport, clear your database first."
    );
    return;
  }

  try {
    await seedHeroSlider();
    await seedSpecialOffer();
    await seedShippingBadges();

    // Mark the seed as completed
    await pluginStore.set({ key: "seedHasRun", value: true });

    console.log("Generic data seed completed successfully!");
  } catch (error) {
    console.error("Error seeding generic data:", error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await seedGenericData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
