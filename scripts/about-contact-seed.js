"use strict";

async function seedAboutPage() {
  try {
    console.log("Creating about page content...");

    const aboutData = {
      title: "Empowering Comfort Through Innovation",
      subtitle:
        "At Tahir Electronics, we are dedicated to bringing energy-efficient solutions that brighten lives and power homes with trust and reliability.",
      companyHistory: {
        text: "Tahir Electronics started with a clear vision and a passion for delivering quality electrical products to every household.",
        points: [
          "Established with a focus on durable, affordable appliances",
          "Grew from a local shop to a trusted nationwide brand",
          "Expanded our product range from fans to lighting, solar, and more",
          "Earned customer loyalty through consistent service and quality",
          "Continuously evolved with changing technology and user needs",
        ],
      },
      mission: {
        text: "To enhance everyday comfort with high-performance, energy-efficient products backed by excellent customer service.",
        points: [
          "Prioritize customer satisfaction and long-term value",
          "Maintain high standards of quality, safety, and durability",
          "Offer eco-conscious alternatives like solar fans and LED lighting",
          "Evolve through innovation and continuous improvement",
          "Foster honest and lasting relationships with customers and partners",
        ],
      },
      vision: {
        text: "To be the most trusted provider of smart, sustainable, and innovative home solutions in Pakistan and beyond.",
        points: [
          "Deliver reliable and energy-saving products for modern living",
          "Promote renewable energy through solar-powered innovations",
          "Lead with cutting-edge designs and functional excellence",
          "Grow as a household name across urban and rural markets",
          "Uphold a legacy built on trust, innovation, and quality",
        ],
      },
    };

    const existingAbout = await strapi.db.query("api::about.about").findOne({
      where: { title: aboutData.title },
    });

    if (!existingAbout) {
      await strapi.entityService.create("api::about.about", {
        data: {
          ...aboutData,
          publishedAt: new Date(),
        },
      });
      console.log("Created about page content");
    } else {
      console.log("About page content already exists, skipping...");
    }
  } catch (error) {
    console.error("Error seeding about page data:", error);
  }
}

async function seedContactPage() {
  try {
    console.log("Creating contact page content...");

    const contactData = {
      title: "Contact",
      subtitle:
        "Get in touch with Tahir Electronics — we'd love to hear from you.",
      businessAddress: "Main Bazaar Pattoki, Punjab, Pakistan",
      businessEmail: "tahirelectronics@gmail.com",
      businessPhone: "+92123456789",
      contactFormSettings: {
        showNameField: true,
        showPhoneField: false,
        showSubjectField: true,
        requireSubject: false,
        placeholders: {
          name: "Example Doe",
          email: "example@example.com",
          subject: "Your subject",
          message: "Your message here...",
        },
      },
    };

    const existingContact = await strapi.db
      .query("api::contact.contact")
      .findOne({
        where: { businessEmail: contactData.businessEmail },
      });

    if (!existingContact) {
      await strapi.entityService.create("api::contact.contact", {
        data: {
          ...contactData,
          publishedAt: new Date(),
        },
      });
      console.log("Created contact page content");
    } else {
      console.log("Contact page content already exists, skipping...");
    }
  } catch (error) {
    console.error("Error seeding contact page data:", error);
  }
}

async function seedAboutContactData() {
  // Check if about/contact seed has already run
  const pluginStore = strapi.store({
    environment: strapi.config.environment,
    type: "type",
    name: "about-contact-seed",
  });

  const seedHasRun = await pluginStore.get({ key: "seedHasRun" });

  if (seedHasRun) {
    console.log(
      "About and Contact pages seed has already been imported. To reimport, clear your database first."
    );
    return;
  }

  try {
    await seedAboutPage();
    await seedContactPage();

    // Mark the seed as completed
    await pluginStore.set({ key: "seedHasRun", value: true });

    console.log("About and Contact pages seed completed successfully!");
  } catch (error) {
    console.error("Error seeding about and contact data:", error);
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await seedAboutContactData();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
