'use strict';

module.exports = (plugin) => {
  /**
   * Custom controller to change a user's password.
   */
  plugin.controllers.user.changePassword = async (ctx) => {
    // 1. Get the authenticated user from the request context.
    // The user object is attached to `ctx.state` by Strapi's authentication middleware.
    const user = ctx.state.user;
    if (!user) {
      return ctx.badRequest('No user found. Please authenticate.');
    }

    // 2. Get the new and current passwords from the request body.
    const { currentPassword, password, passwordConfirmation } = ctx.request.body;

    // 3. Validate the input from the request body.
    if (!currentPassword || !password || !passwordConfirmation) {
      return ctx.badRequest('All fields (currentPassword, password, passwordConfirmation) are required.');
    }
    if (password !== passwordConfirmation) {
      return ctx.badRequest('Passwords do not match.');
    }

    // 4. Fetch the full user data from the database.
    const userFromDb = await strapi.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
    });

    if (!userFromDb) {
      return ctx.badRequest('User not found.');
    }

    // 5. Use the plugin's service to validate the current password.
    const validPassword = await strapi.plugins['users-permissions'].services.user.validatePassword(
      currentPassword,
      userFromDb.password
    );

    if (!validPassword) {
      return ctx.badRequest('Invalid current password.');
    }

    // 6. Use the plugin's service to update the user with the new password.
    // The service will handle hashing the new password automatically.
    await strapi.plugins['users-permissions'].services.user.edit(user.id, {
      password,
    });

    // 7. Send a success response.
    ctx.send({
      ok: true,
      message: 'Password updated successfully.',
    });
  };

  /**
   * Add the custom route to the content-api router.
   */
  plugin.routes['content-api'].routes.push({
    method: 'POST',
    path: '/users/change-password',
    handler: 'user.changePassword',
    config: {
      // We don't need to specify policies here, as the default 'global::is-authenticated'
      // policy will apply, or Strapi's built-in authentication will protect the route.
      prefix: '',
    },
  });

  return plugin;
}; 