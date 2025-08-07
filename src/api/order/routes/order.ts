/**
 * order router.
 */

import { factories } from "@strapi/strapi";

export default {
  routes: [
    // Standard CRUD routes for orders
    {
      method: "GET",
      path: "/orders",
      handler: "order.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/orders/:id",
      handler: "order.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/orders",
      handler: "order.create",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/orders/:id",
      handler: "order.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/orders/:id",
      handler: "order.delete",
      config: {
        policies: [],
      },
    },

    // Custom payment routes
    {
      method: "POST",
      path: "/orders/create-order-payment-intent",
      handler: "order.createOrderPaymentIntent",
      config: {
        auth: false, // or true if you require auth
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/orders/confirm-payment",
      handler: "order.confirmPayment",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/orders/payment-status/:paymentIntentId",
      handler: "order.getPaymentStatus",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/stripe-webhook",
      handler: "order.handleWebhook",
      config: {
        policies: [],
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/orders/refund-payment",
      handler: "order.refundPayment",
      config: {
        policies: [],
        auth: {
          scope: ["authenticated"],
        },
      },
    },
    {
      method: "GET",
      path: "/orders/order-number/:orderNumber",
      handler: "order.findByOrderNumber",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
