/**
 *  order controller
 */

import { factories } from "@strapi/strapi";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface OrderItem {
  productId: string | number; // Support both documentId (string) and legacy numeric ID
  quantity: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country?: string;
}

interface ShippingMethod {
  cost: number;
  name?: string;
}

interface CreateOrderPaymentIntentRequest {
  orderItems: OrderItem[];
  customerInfo: CustomerInfo;
  shippingAddress: Address;
  billingAddress: Address;
  shippingMethod?: ShippingMethod;
  paymentMethod?: string;
}

interface EnrichedOrderItem {
  productId: string | number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// Define the price component structure
interface PriceComponent {
  regularPrice: number;
  salePrice?: number;
  onSale: boolean;
  discountPercentage?: number;
  currency: string;
}

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    // Enhanced payment intent with order details - CARD PAYMENTS ONLY
    async createOrderPaymentIntent(ctx: any) {
      console.log("✅ Hit createOrderPaymentIntent route");
      try {
        const user = ctx.state.user;
        const {
          orderItems,
          customerInfo,
          shippingAddress,
          billingAddress,
          shippingMethod,
        }: CreateOrderPaymentIntentRequest = ctx.request.body;

        // Validate required fields
        if (
          !orderItems ||
          !Array.isArray(orderItems) ||
          orderItems.length === 0
        ) {
          return ctx.badRequest("Order items are required");
        }

        if (
          !customerInfo ||
          !customerInfo.firstName ||
          !customerInfo.lastName ||
          !customerInfo.email
        ) {
          return ctx.badRequest(
            "Customer information (firstName, lastName, email) is required"
          );
        }

        if (
          !shippingAddress ||
          !shippingAddress.addressLine1 ||
          !shippingAddress.city ||
          !shippingAddress.state ||
          !shippingAddress.postalCode
        ) {
          return ctx.badRequest("Complete shipping address is required");
        }

        if (
          !billingAddress ||
          !billingAddress.addressLine1 ||
          !billingAddress.city ||
          !billingAddress.state ||
          !billingAddress.postalCode
        ) {
          return ctx.badRequest("Complete billing address is required");
        }

        // Calculate order total
        let subtotal = 0;
        const enrichedItems: EnrichedOrderItem[] = [];

        for (const item of orderItems) {
          // Validate item structure
          if (!item.productId || !item.quantity || item.quantity <= 0) {
            return ctx.badRequest(
              `Invalid order item: productId and positive quantity are required`
            );
          }

          // Find product by documentId or legacy numeric ID
          let product;
          try {
            // First try to find by documentId (Strapi v5 approach)
            if (typeof item.productId === "string") {
              product = await strapi.db.query("api::product.product").findOne({
                where: { documentId: item.productId },
                populate: ["price", "stockInfo"],
              });
            } else {
              // Fallback for numeric ID (legacy support)
              product = await strapi.entityService.findOne(
                "api::product.product",
                item.productId,
                {
                  populate: ["price", "stockInfo"],
                }
              );
            }
          } catch (error) {
            console.error(`Error finding product ${item.productId}:`, error);
          }

          if (!product) {
            return ctx.badRequest(
              `Product with ID ${item.productId} not found`
            );
          }

          // Validate that the product has a price component
          const price = (product as any).price as PriceComponent;
          if (!price) {
            return ctx.badRequest(
              `Product with ID ${item.productId} is missing price information`
            );
          }

          // Validate price values
          if (!price.regularPrice || price.regularPrice <= 0) {
            return ctx.badRequest(
              `Product with ID ${item.productId} has invalid price information`
            );
          }

          // Calculate the current price based on sale status
          const currentPrice =
            price.onSale && price.salePrice && price.salePrice > 0
              ? price.salePrice
              : price.regularPrice;

          // Use Math.round to avoid floating point precision issues
          const itemTotal =
            Math.round(currentPrice * item.quantity * 100) / 100;
          subtotal += itemTotal;

          enrichedItems.push({
            productId: product.documentId || product.id, // Use documentId for Strapi v5, fallback to id
            name: (product as any).name,
            quantity: item.quantity,
            price: currentPrice,
            total: itemTotal,
          });
        }

        // Calculate shipping cost
        const shippingCost = shippingMethod?.cost || 0;
        const taxRate = 0.08; // 8% tax (customize based on location)

        // Round subtotal to avoid floating point precision issues
        subtotal = Math.round(subtotal * 100) / 100;

        // Calculate tax and total amounts with proper rounding
        const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
        const totalAmount =
          Math.round((subtotal + shippingCost + taxAmount) * 100) / 100;

        // Validate minimum amount (Stripe requires at least $0.50 USD)
        if (totalAmount < 0.5) {
          return ctx.badRequest("Order total must be at least $0.50");
        }

        // Create customer in Stripe if authenticated
        let stripeCustomerId: string | null = null;
        if (user && customerInfo?.email) {
          try {
            const stripeCustomer = await stripe.customers.create({
              email: customerInfo.email,
              name: `${customerInfo.firstName} ${customerInfo.lastName}`,
              phone: customerInfo.phone,
              address: {
                line1: billingAddress.addressLine1,
                line2: billingAddress.addressLine2,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.postalCode,
                country: billingAddress.country || "US",
              },
            });
            stripeCustomerId = stripeCustomer.id;
          } catch (error: any) {
            console.warn("Failed to create Stripe customer:", error.message);
          }
        }

        // Validate total amount before sending to Stripe
        const amountInCents = Math.round(totalAmount * 100);
        if (!Number.isInteger(amountInCents) || amountInCents <= 0) {
          return ctx.badRequest(
            `Invalid total amount: ${totalAmount}. Cannot process payment.`
          );
        }

        // Create payment intent with order metadata - CARD PAYMENTS ONLY
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents, // Amount in cents
          currency: "usd",
          customer: stripeCustomerId || undefined,
          automatic_payment_methods: {
            enabled: true, // ✅ Let PaymentElement handle method selection
          },
          metadata: {
            orderType: "ecommerce",
            userId: user?.id?.toString() || "guest",
            customerEmail: customerInfo.email,
            customerName: `${customerInfo.firstName} ${customerInfo.lastName}`,
            itemCount: enrichedItems.length.toString(),
            subtotal: subtotal.toString(),
            shipping: shippingCost.toString(),
            tax: taxAmount.toString(),
            total: totalAmount.toString(),
          },
          shipping: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            address: {
              line1: shippingAddress.addressLine1,
              line2: shippingAddress.addressLine2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postal_code: shippingAddress.postalCode,
              country: "US",
            },
          },
          description: `Order with ${enrichedItems.length} item(s) for ${customerInfo.firstName} ${customerInfo.lastName}`,
        });

        ctx.send({
          success: true,
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          orderSummary: {
            items: enrichedItems,
            subtotal,
            shipping: shippingCost,
            tax: taxAmount,
            total: totalAmount,
            currency: "USD",
          },
          customerInfo: {
            name: `${customerInfo.firstName} ${customerInfo.lastName}`,
            email: customerInfo.email,
          },
        });
      } catch (error: any) {
        console.error("Payment intent creation error:", error);

        // Handle specific Stripe errors
        if (error.type === "StripeCardError") {
          return ctx.badRequest(`Card error: ${error.message}`);
        } else if (error.type === "StripeInvalidRequestError") {
          return ctx.badRequest(`Invalid request: ${error.message}`);
        } else if (error.type === "StripeAPIError") {
          return ctx.internalServerError(
            "Payment service temporarily unavailable"
          );
        } else {
          return ctx.internalServerError(
            `Failed to create payment intent: ${error.message}`
          );
        }
      }
    },

    // Find order by order number
    async findByOrderNumber(ctx: any) {
      const { orderNumber } = ctx.params;

      try {
        if (!orderNumber) {
          return ctx.badRequest("Order number is required");
        }

        const orders = await strapi.entityService.findMany("api::order.order", {
          filters: { orderNumber },
          populate: {
            customer: true,
            items: {
              populate: {
                product: {
                  populate: ["images", "price"],
                },
              },
            },
            shippingAddress: true,
            billingAddress: true,
            paymentMethod: true,
            shippingMethod: true,
          },
        });

        if (!orders || orders.length === 0) {
          return ctx.notFound(`Order with number ${orderNumber} not found`);
        }

        // Return the first order (assuming orderNumber is unique)
        ctx.send({
          success: true,
          order: orders[0],
        });
      } catch (error: any) {
        console.error("Error fetching order by orderNumber:", error);
        return ctx.internalServerError(
          `Failed to fetch order: ${error.message}`
        );
      }
    },

    // Confirm payment and create order
    async confirmPayment(ctx: any) {
      try {
        const { paymentIntentId }: { paymentIntentId: string } =
          ctx.request.body;

        if (!paymentIntentId) {
          return ctx.badRequest("Payment intent ID is required");
        }

        // Retrieve payment intent from Stripe
        const paymentIntent =
          await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== "succeeded") {
          return ctx.badRequest("Payment has not been completed");
        }

        // Create order in database
        const orderData: any = {
          orderNumber: `ORD-${Date.now()}`,
          status: "processing",
          paymentStatus: "paid",
          transactionInvoiceId: paymentIntent.id,
          subtotal: parseFloat(paymentIntent.metadata.subtotal),
          shippingTotal: parseFloat(paymentIntent.metadata.shipping),
          taxTotal: parseFloat(paymentIntent.metadata.tax),
          total: parseFloat(paymentIntent.metadata.total),
          publishedAt: new Date(),
        };

        // Link to customer if user is authenticated
        if (paymentIntent.metadata.userId !== "guest") {
          const customer = await strapi.db
            .query("api::customer.customer")
            .findOne({
              where: { user: { id: parseInt(paymentIntent.metadata.userId) } },
            });
          if (customer) {
            orderData.customer = customer.id;
          }
        }

        const order = await strapi.entityService.create("api::order.order", {
          data: orderData,
        });

        ctx.send({
          success: true,
          order: {
            id: order.id,
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.total,
          },
          message: "Payment confirmed and order created successfully",
        });
      } catch (error: any) {
        console.error("Payment confirmation error:", error);
        ctx.throw(500, `Failed to confirm payment: ${error.message}`);
      }
    },

    // Get payment status
    async getPaymentStatus(ctx: any) {
      try {
        const { paymentIntentId }: { paymentIntentId: string } = ctx.params;

        const paymentIntent =
          await stripe.paymentIntents.retrieve(paymentIntentId);

        ctx.send({
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          created: paymentIntent.created,
          metadata: paymentIntent.metadata,
        });
      } catch (error: any) {
        console.error("Get payment status error:", error);
        ctx.throw(500, `Failed to get payment status: ${error.message}`);
      }
    },

    // Webhook handler for Stripe events
    async handleWebhook(ctx: any) {
      try {
        const sig = ctx.request.headers["stripe-signature"];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (!endpointSecret) {
          console.warn("Stripe webhook secret not configured");
          return ctx.send({ received: true });
        }

        let event: Stripe.Event;
        try {
          event = stripe.webhooks.constructEvent(
            ctx.request.body,
            sig,
            endpointSecret
          );
        } catch (err: any) {
          console.error("Webhook signature verification failed:", err.message);
          return ctx.badRequest("Invalid signature");
        }

        // Handle different event types
        switch (event.type) {
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("Payment succeeded:", paymentIntent.id);

            // Update order status if exists
            const order = await strapi.db.query("api::order.order").findOne({
              where: { transactionInvoiceId: paymentIntent.id },
            });

            if (order) {
              await strapi.entityService.update("api::order.order", order.id, {
                data: { paymentStatus: "paid", status: "processing" },
              });
            }
            break;
          }

          case "payment_intent.payment_failed": {
            const failedPayment = event.data.object as Stripe.PaymentIntent;
            console.log("Payment failed:", failedPayment.id);

            // Update order status
            const failedOrder = await strapi.db
              .query("api::order.order")
              .findOne({
                where: { transactionInvoiceId: failedPayment.id },
              });

            if (failedOrder) {
              await strapi.entityService.update(
                "api::order.order",
                failedOrder.id,
                {
                  data: { paymentStatus: "failed", status: "failed" },
                }
              );
            }
            break;
          }

          default:
            console.log(`Unhandled event type: ${event.type}`);
        }

        ctx.send({ received: true });
      } catch (error: any) {
        console.error("Webhook error:", error);
        ctx.throw(500, `Webhook error: ${error.message}`);
      }
    },

    // Refund payment
    async refundPayment(ctx: any) {
      try {
        const {
          paymentIntentId,
          amount,
          reason,
        }: {
          paymentIntentId: string;
          amount?: number;
          reason?: string;
        } = ctx.request.body;

        if (!paymentIntentId) {
          return ctx.badRequest("Payment intent ID is required");
        }

        const refundData: Stripe.RefundCreateParams = {
          payment_intent: paymentIntentId,
          reason:
            (reason as Stripe.RefundCreateParams.Reason) ||
            "requested_by_customer",
        };

        if (amount) {
          refundData.amount = amount * 100; // Convert to cents
        }

        const refund = await stripe.refunds.create(refundData);

        // Update order status
        const order = await strapi.db.query("api::order.order").findOne({
          where: { transactionInvoiceId: paymentIntentId },
        });

        if (order) {
          const charge = await stripe.charges.retrieve(refund.charge as string);
          const newStatus =
            refund.amount === charge.amount ? "refunded" : "partially_refunded";
          await strapi.entityService.update("api::order.order", order.id, {
            data: { paymentStatus: newStatus },
          });
        }

        ctx.send({
          success: true,
          refund: {
            id: refund.id,
            amount: refund.amount,
            status: refund.status,
          },
          message: "Refund processed successfully",
        });
      } catch (error: any) {
        console.error("Refund error:", error);
        ctx.throw(500, `Failed to process refund: ${error.message}`);
      }
    },
  })
);
