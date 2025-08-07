"use strict";

/**
 * Script to configure role permissions for Plant Perfect e-commerce site
 * This script sets up permissions for Public and Authenticated roles
 * based on the detailed permission specifications.
 */

async function setupPermissions() {
  console.log("🚀 Starting permission configuration...");

  try {
    // Get the roles
    const publicRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({
        where: { type: "public" },
      });

    const authenticatedRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({
        where: { type: "authenticated" },
      });

    if (!publicRole || !authenticatedRole) {
      throw new Error("Could not find Public or Authenticated roles");
    }

    console.log(
      `📋 Found roles - Public: ${publicRole.id}, Authenticated: ${authenticatedRole.id}`
    );

    // Define collection type permissions for Public role
    const publicCollectionPermissions = {
      "api::article.article": ["find", "findOne"],
      "api::blog-category.blog-category": ["find", "findOne"],
      "api::brand.brand": ["find", "findOne"],
      "api::cart.cart": ["find", "findOne", "create", "update"],
      "api::category.category": ["find", "findOne"],
      "api::contact-request.contact-request": ["create"],
      "api::customer.customer": ["find", "findOne", "create"],
      "api::inventory.inventory": ["find", "findOne"],
      "api::order.order": ["find", "findOne", "create"],
      "api::order-item.order-item": ["find", "findOne", "create"],
      "api::page.page": ["find", "findOne"],
      "api::payment-method.payment-method": ["find", "findOne"],
      "api::product.product": ["find", "findOne"],
      "api::product-variant.product-variant": ["find", "findOne"],
      "api::review.review": ["find", "findOne", "create"],
      "api::shipping-method.shipping-method": ["find", "findOne"],
      "api::tag.tag": ["find", "findOne"],
      "api::wishlist.wishlist": ["find", "findOne", "create", "update"],
    };

    // Define collection type permissions for Authenticated role
    const authenticatedCollectionPermissions = {
      "api::article.article": ["find", "findOne"],
      "api::blog-category.blog-category": ["find", "findOne"],
      "api::brand.brand": ["find", "findOne"],
      "api::cart.cart": ["find", "findOne", "create", "update", "delete"],
      "api::category.category": ["find", "findOne"],
      "api::contact-request.contact-request": ["create"],
      "api::customer.customer": ["find", "findOne", "create", "update"],
      "api::inventory.inventory": ["find", "findOne"],
      "api::order.order": ["find", "findOne", "create"],
      "api::order-item.order-item": ["find", "findOne", "create"],
      "api::page.page": ["find", "findOne"],
      "api::payment-method.payment-method": ["find", "findOne"],
      "api::product.product": ["find", "findOne"],
      "api::product-variant.product-variant": ["find", "findOne"],
      "api::review.review": ["find", "findOne", "create", "update", "delete"],
      "api::shipping-method.shipping-method": ["find", "findOne"],
      "api::tag.tag": ["find", "findOne"],
      "api::wishlist.wishlist": [
        "find",
        "findOne",
        "create",
        "update",
        "delete",
      ],
    };

    // Define single type permissions (same for both roles)
    const singleTypePermissions = {
      "api::about.about": ["find"],
      "api::global.global": ["find"],
      "api::site-setting.site-setting": ["find"],
    };

    // Define plugin permissions for Public role
    const publicPluginPermissions = {
      "plugin::users-permissions.auth": [
        "callback",
        "connect",
        "forgotPassword",
        "resetPassword",
        "emailConfirmation",
        "sendEmailConfirmation",
        "register",
      ],
      "plugin::users-permissions.role": ["find", "findOne"],
      "plugin::users-permissions.user": ["find", "findOne", "me", "create"],
      "plugin::upload.content-api": ["upload", "findOne", "find"],
    };

    // Define plugin permissions for Authenticated role
    const authenticatedPluginPermissions = {
      "plugin::users-permissions.auth": [
        "callback",
        "connect",
        "forgotPassword",
        "resetPassword",
        "emailConfirmation",
        "sendEmailConfirmation",
        "register",
        "changePassword",
      ],
      "plugin::users-permissions.role": ["find", "findOne"],
      "plugin::users-permissions.user": ["find", "findOne", "me", "update"],
      "plugin::upload.content-api": ["upload", "findOne", "find"],
    };

    // Function to set permissions for a role
    async function setRolePermissions(
      roleId,
      collectionPermissions,
      singlePermissions,
      pluginPermissions
    ) {
      const permissions = {};

      // Add collection type permissions
      for (const [contentType, actions] of Object.entries(
        collectionPermissions
      )) {
        for (const action of actions) {
          permissions[`${contentType}.${action}`] = { enabled: true };
        }
      }

      // Add single type permissions
      for (const [contentType, actions] of Object.entries(singlePermissions)) {
        for (const action of actions) {
          permissions[`${contentType}.${action}`] = { enabled: true };
        }
      }

      // Add plugin permissions
      for (const [plugin, actions] of Object.entries(pluginPermissions)) {
        for (const action of actions) {
          permissions[`${plugin}.${action}`] = { enabled: true };
        }
      }

      // Update role permissions
      await strapi.query("plugin::users-permissions.role").update({
        where: { id: roleId },
        data: { permissions },
      });
    }

    // Configure Public role permissions
    console.log("🔓 Configuring Public role permissions...");
    await setRolePermissions(
      publicRole.id,
      publicCollectionPermissions,
      singleTypePermissions,
      publicPluginPermissions
    );

    // Configure Authenticated role permissions
    console.log("🔐 Configuring Authenticated role permissions...");
    await setRolePermissions(
      authenticatedRole.id,
      authenticatedCollectionPermissions,
      singleTypePermissions,
      authenticatedPluginPermissions
    );

    console.log("✅ Permission configuration completed successfully!");
    console.log("📝 Summary:");
    console.log(
      "   - Public role: Read access to content, create orders/carts/reviews/wishlists/contacts"
    );
    console.log(
      "   - Authenticated role: Additional delete permissions for own carts/reviews/wishlists"
    );
    console.log("   - Vendor information remains hidden from both roles");
    console.log("   - All authentication flows configured");
  } catch (error) {
    console.error("❌ Error configuring permissions:", error);
    throw error;
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = "error";

  await setupPermissions();
  await app.destroy();

  process.exit(0);
}

// Export the function so it can be used by other scripts
module.exports = setupPermissions;

// Only run if this script is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
