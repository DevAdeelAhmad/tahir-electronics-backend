# Frontend Developer Guide for Plant Perfect

Welcome, Frontend Developer! This guide provides a complete reference to the Strapi backend for the Plant Perfect e-commerce site. It details all the available content types (tables), their fields, and how to interact with them via the API.

## API Basics

- **Base URL**: The API is accessible at `/api`.
- **Populating Relations**: To get related data, use the `populate` parameter. For deep nesting, you can use `populate[relation][populate]=*`. Example: `/api/products?populate=*` or `/api/products?populate[categories][populate]=*`
- **Filtering, Sorting, and Pagination**: Strapi's standard query parameters for filtering, sorting, and pagination are available. Please refer to the [Strapi documentation on Query Engine](https://docs.strapi.io/dev-docs/api/query-engine) for detailed usage.

---

## Permissions & API Access

Permissions are defined for two roles: **Public** (unauthenticated users) and **Authenticated** (logged-in users).

### Public Role (`find` and `findOne` are generally allowed)

- **Can Read**: `Article`, `Blog-Category`, `Cart`, `Category`, `Customer`, `Inventory`, `Order`, `Order-Item`, `Page`, `Payment-Method`, `Product`, `Product-Variant`, `Review`, `Shipping-Method`, `Tag`, `About`, `Global`, `Site-Setting`.
- **Can Create**: `Cart`, `Contact-Request`, `Order`, `Order-Item`, `Review`, `Wishlist`.
- **Can Update**: `Cart`, `Wishlist`.
- **Cannot Delete**: Anything.
- **Hidden**: `Vendor` information is not available.

### Authenticated Role (In addition to public permissions)

- **Can Create**: `Customer` profile.
- **Can Update**: Their own `Customer` profile, `Review`, `User` account.
- **Can Delete**: Their own `Cart`, `Review`, `Wishlist`.

---

## Single Types

Single types are for content that only has one instance (e.g., a settings page).

### 1. About (`/api/about`)

Stores company information and story for the "About Us" page.

| Field Name       | Type        | Details                                                                    |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| title            | `string`    | **Required**. The main title for the about page.                           |
| subtitle         | `string`    | A subtitle to complement the main title.                                   |
| headerImage      | `media`     | A single image for the page header.                                        |
| companyHistory   | `richtext`  | The story of the company.                                                  |
| mission          | `richtext`  | Company mission statement.                                                 |
| vision           | `richtext`  | Company vision for the future.                                             |
| partnerLogos     | `media`     | (Multiple) Logos of partner companies.                                     |
| certifications   | `media`     | (Multiple) Images of any certifications.                                   |
| testimonials     | `component` | (Repeatable) **Component**: `shared.quote`.                                |
| blocks           | `dynamiczone` | **Components**: `shared.media`, `shared.quote`, `shared.rich-text`, `shared.slider`. |
| seo              | `component` | **Component**: `shared.seo`.                                               |

### 2. Global (`/api/global`)

Global settings used across the entire site.

| Field Name       | Type        | Details                               |
| ---------------- | ----------- | ------------------------------------- |
| siteName         | `string`    | **Required**. The name of the site.   |
| favicon          | `media`     | A single site favicon.                |
| siteDescription  | `text`      | **Required**. The site description.   |
| defaultSeo       | `component` | **Component**: `shared.seo`.          |

### 3. Site Setting (`/api/site-settings`)

Global site configuration for various services and navigation.

| Field Name             | Type        | Details                                                          |
| ---------------------- | ----------- | ---------------------------------------------------------------- |
| siteName               | `string`    | **Required**.                                                    |
| siteTagline            | `string`    |                                                                  |
| siteLogo               | `media`     | (Single)                                                         |
| favicon                | `media`     | (Single)                                                         |
| contactEmail           | `email`     |                                                                  |
| contactPhone           | `string`    |                                                                  |
| address                | `component` | **Component**: `shared.address`.                                 |
| socialMedia            | `component` | **Component**: `shared.contact-info`.                            |
| footerText             | `richtext`  |                                                                  |
| defaultSeo             | `component` | **Component**: `shared.seo`.                                     |
| googleAnalyticsId      | `string`    |                                                                  |
| facebookPixelId        | `string`    |                                                                  |
| currencyCode           | `string`    | Default: `USD`                                                   |
| currencySymbol         | `string`    | Default: `$`                                                     |
| enableQuickbooksSync   | `boolean`   | Default: `true`                                                  |
| enableStripePayments   | `boolean`   | Default: `true`                                                  |
| mainNavigation         | `json`      | JSON structure for the main site navigation.                     |
| footerNavigation       | `json`      | JSON structure for the footer navigation.                        |

---

## Collection Types

These are for content that can have multiple entries (e.g., products, articles).

### 1. Article (`/api/articles`)

Blog posts and articles.

| Field Name       | Type        | Details                                                                      |
| ---------------- | ----------- | ---------------------------------------------------------------------------- |
| title            | `string`    | **Required**.                                                                |
| slug             | `uid`       | **Required**. Auto-generated from `title`.                                   |
| description      | `text`      | Max length: 160 chars.                                                       |
| content          | `richtext`  |                                                                              |
| cover            | `media`     | (Single)                                                                     |
| author           | `relation`  | (Many-to-One) -> `plugin::users-permissions.user`.                           |
| category         | `relation`  | (Many-to-One) -> `api::blog-category.blog-category`. Inversed by `articles`. |
| tags             | `relation`  | (Many-to-Many) -> `api::tag.tag`. Inversed by `articles`.                    |
| publishDate      | `datetime`  |                                                                              |
| blocks           | `dynamiczone` | **Components**: `shared.media`, `shared.quote`, `shared.rich-text`, `shared.slider`. |
| seo              | `component` | **Component**: `shared.seo`.                                                 |
| featured         | `boolean`   | Default: `false`.                                                            |
| relatedProducts  | `relation`  | (Many-to-Many) -> `api::product.product`.                                    |

### 2. Blog Category (`/api/blog-categories`)

Categories for blog posts.

| Field Name       | Type       | Details                                                                    |
| ---------------- | ---------- | -------------------------------------------------------------------------- |
| name             | `string`   | **Required**.                                                              |
| slug             | `uid`      | **Required**. Auto-generated from `name`.                                  |
| description      | `text`     |                                                                            |
| articles         | `relation` | (One-to-Many) -> `api::article.article`. Mapped by `category`.             |
| parent           | `relation` | (Many-to-One) -> `api::blog-category.blog-category`. Inversed by `children`.|
| children         | `relation` | (One-to-Many) -> `api::blog-category.blog-category`. Mapped by `parent`.   |
| image            | `media`    | (Single)                                                                   |
| seo              | `component`| **Component**: `shared.seo`.                                               |

### 3. Cart (`/api/carts`)

Shopping carts for users.

| Field Name             | Type       | Details                                                         |
| ---------------------- | ---------- | --------------------------------------------------------------- |
| items                  | `json`     | Cart items with product IDs, variants, quantities, etc.         |
| customer               | `relation` | (One-to-One) -> `api::customer.customer`. Inversed by `cart`.   |
| sessionId              | `string`   | For anonymous users without accounts.                           |
| subtotal               | `decimal`  | Default: `0`.                                                   |
| total                  | `decimal`  | Default: `0`.                                                   |
| taxAmount              | `decimal`  | Default: `0`.                                                   |
| shippingAmount         | `decimal`  | Default: `0`.                                                   |
| discountAmount         | `decimal`  | Default: `0`.                                                   |
| lastUpdated            | `datetime` |                                                                 |
| checkoutStarted        | `boolean`  | Default: `false`.                                               |
| shippingMethod         | `relation` | (Many-to-One) -> `api::shipping-method.shipping-method`.        |
| paymentMethod          | `relation` | (Many-to-One) -> `api::payment-method.payment-method`.          |
| abandonedCartReminder  | `boolean`  | Default: `false`.                                               |
| notes                  | `text`     |                                                                 |
| couponCode             | `string`   |                                                                 |

### 4. Category (`/api/categories`)

Product categories.

| Field Name       | Type        | Details                                                                    |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| name             | `string`    | **Required**.                                                              |
| slug             | `uid`       | **Required**. Auto-generated from `name`.                                  |
| description      | `text`      |                                                                            |
| image            | `media`     | (Single)                                                                   |
| parent           | `relation`  | (Many-to-One) -> `api::category.category`. Inversed by `children`.         |
| children         | `relation`  | (One-to-Many) -> `api::category.category`. Mapped by `parent`.             |
| products         | `relation`  | (Many-to-Many) -> `api::product.product`. Mapped by `categories`.          |
| displayOrder     | `integer`   | Default: `1`.                                                              |
| seo              | `component` | **Component**: `shared.seo`.                                               |
| featured         | `boolean`   | Default: `false`.                                                          |

### 5. Contact Request (`/api/contact-requests`)

Stores contact form submissions. **NOTE: `find` and `findOne` are not allowed for public or authenticated users.**

| Field Name      | Type          | Details                                                            |
| --------------- | ------------- | ------------------------------------------------------------------ |
| name            | `string`      | **Required**.                                                      |
| email           | `email`       | **Required**.                                                      |
| phone           | `string`      |                                                                    |
| subject         | `string`      |                                                                    |
| message         | `text`        | **Required**.                                                      |
| status          | `enumeration` | `new`, `in-progress`, `completed`. Default: `new`.                 |
| assignedTo      | `relation`    | (Many-to-One) -> `plugin::users-permissions.user`.                 |
| notes           | `richtext`    |                                                                    |
| ipAddress       | `string`      |                                                                    |
| userAgent       | `text`        |                                                                    |
| source          | `string`      |                                                                    |
| qboTicketId     | `string`      |                                                                    |
| qboSyncStatus   | `enumeration` | `pending`, `synced`, `failed`. Default: `pending`.                 |

### 6. Customer (`/api/customers`)

Customer information.

| Field Name               | Type        | Details                                                                  |
| ------------------------ | ----------- | ------------------------------------------------------------------------ |
| email                    | `email`     | **Required, Unique**.                                                    |
| firstName                | `string`    | **Required**.                                                            |
| lastName                 | `string`    | **Required**.                                                            |
| phone                    | `string`    |                                                                          |
| addresses                | `component` | (Repeatable) **Component**: `shared.address`.                            |
| defaultBillingAddress    | `integer`   | Default: `0`, Min: `0`. (Index of the address in the `addresses` array). |
| defaultShippingAddress   | `integer`   | Default: `0`, Min: `0`. (Index of the address in the `addresses` array). |
| orders                   | `relation`  | (One-to-Many) -> `api::order.order`. Mapped by `customer`.               |
| notes                    | `richtext`  |                                                                          |
| isActive                 | `boolean`   | Default: `true`.                                                         |
| totalSpent               | `decimal`   | Default: `0`, Min: `0`.                                                  |
| lastOrderDate            | `datetime`  |                                                                          |
| orderCount               | `integer`   | Default: `0`, Min: `0`.                                                  |
| user                     | `relation`  | (One-to-One) -> `plugin::users-permissions.user`.                        |
| cart                     | `relation`  | (One-to-One) -> `api::cart.cart`. Mapped by `customer`.                  |
| wishlists                | `relation`  | (One-to-Many) -> `api::wishlist.wishlist`. Mapped by `customer`.         |
| reviews                  | `relation`  | (One-to-Many) -> `api::review.review`. Mapped by `customer`.             |
| reviewCount              | `integer`   | Default: `0`, Min: `0`.                                                  |

### 7. Inventory (`/api/inventories`)

Stock levels for products and variants.

| Field Name          | Type          | Details                                                                    |
| ------------------- | ------------- | -------------------------------------------------------------------------- |
| quantity            | `integer`     | **Required**. Default: `0`.                                                |
| sku                 | `string`      | **Unique**.                                                                |
| productVariant      | `relation`    | (One-to-One) -> `api::product-variant.product-variant`. Inversed by `inventory`. |
| product             | `relation`    | (One-to-One) -> `api::product.product`.                                    |
| lowStockThreshold   | `integer`     | Default: `5`.                                                              |
| location            | `string`      | Physical location of the inventory.                                        |
| status              | `enumeration` | `in_stock`, `low_stock`, `out_of_stock`, `discontinued`, `backorder`. Default: `in_stock`. |
| lastUpdated         | `datetime`    |                                                                            |
| reservedQuantity    | `integer`     | Default: `0`. Quantity reserved for pending orders.                        |
| availableQuantity   | `integer`     | Calculated as `quantity - reservedQuantity`.                               |
| qboItemId           | `string`      | QuickBooks Online Item ID.                                                 |
| qboSyncStatus       | `enumeration` | `pending`, `synced`, `failed`. Default: `pending`.                         |

### 8. Order (`/api/orders`)

Customer orders.

| Field Name           | Type          | Details                                                                      |
| -------------------- | ------------- | ---------------------------------------------------------------------------- |
| orderNumber          | `string`      | **Required, Unique**.                                                        |
| customer             | `relation`    | (Many-to-One) -> `api::customer.customer`. Inversed by `orders`.             |
| items                | `relation`    | (One-to-Many) -> `api::order-item.order-item`. Mapped by `order`.            |
| status               | `enumeration` | **Required**. `pending`, `processing`, `on-hold`, `completed`, `cancelled`, `refunded`, `failed`. Default: `pending`. |
| shippingAddress      | `component`   | **Required**. **Component**: `shared.address`.                               |
| billingAddress       | `component`   | **Required**. **Component**: `shared.address`.                               |
| paymentMethod        | `relation`    | (Many-to-One) -> `api::payment-method.payment-method`.                       |
| shippingMethod       | `relation`    | (Many-to-One) -> `api::shipping-method.shipping-method`.                     |
| paymentStatus        | `enumeration` | `pending`, `paid`, `failed`, `refunded`, `partially_refunded`. Default: `pending`. |
| transactionInvoiceId | `string`      |                                                                              |
| subtotal             | `decimal`     | **Required**. Min: `0`.                                                      |
| shippingTotal        | `decimal`     | Default: `0`, Min: `0`.                                                      |
| taxTotal             | `decimal`     | Default: `0`, Min: `0`.                                                      |
| discountTotal        | `decimal`     | Default: `0`, Min: `0`.                                                      |
| total                | `decimal`     | **Required**. Min: `0`.                                                      |
| currency             | `string`      | Default: `USD`.                                                              |
| customerNotes        | `text`        |                                                                              |
| adminNotes           | `text`        |                                                                              |
| qboInvoiceId         | `string`      |                                                                              |
| qboSyncStatus        | `enumeration` | `pending`, `synced`, `failed`. Default: `pending`.                           |
| orderDate            | `datetime`    | **Required**.                                                                |
| trackingNumber       | `string`      |                                                                              |
| trackingUrl          | `string`      |                                                                              |
| shippingStatus       | `enumeration` | `pending`, `shipped`, `delivered`, `returned`. Default: `pending`.           |

### 9. Order Item (`/api/order-items`)

Individual items within an order.

| Field Name      | Type       | Details                                                              |
| --------------- | ---------- | -------------------------------------------------------------------- |
| quantity        | `integer`  | **Required**. Min: `1`.                                              |
| unitPrice       | `decimal`  | **Required**.                                                        |
| totalPrice      | `decimal`  | **Required**.                                                        |
| order           | `relation` | (Many-to-One) -> `api::order.order`. Inversed by `items`.            |
| product         | `relation` | (Many-to-One) -> `api::product.product`.                             |
| variant         | `relation` | (Many-to-One) -> `api::product-variant.product-variant`.             |
| metadata        | `json`     | Additional information like selected options, customizations, etc.   |
| sku             | `string`   |                                                                      |
| productName     | `string`   | **Required**. Stored name at time of order for historical purposes.  |
| variantName     | `string`   | Stored variant name at time of order for historical purposes.        |
| discounts       | `json`     | Any discounts applied to this item.                                  |
| taxRate         | `decimal`  | Tax rate applied to this item.                                       |
| taxAmount       | `decimal`  | Total tax amount for this item.                                      |

### 10. Page (`/api/pages`)

Static pages like Home, About, Contact, etc.

| Field Name         | Type          | Details                                                                      |
| ------------------ | ------------- | ---------------------------------------------------------------------------- |
| title              | `string`      | **Required**.                                                                |
| slug               | `uid`         | **Required**. Auto-generated from `title`.                                   |
| shortDescription   | `text`        | Max length: 160 chars.                                                       |
| content            | `richtext`    |                                                                              |
| featuredImage      | `media`       | (Single)                                                                     |
| blocks             | `dynamiczone` | **Components**: `shared.media`, `shared.quote`, `shared.rich-text`, `shared.slider`, `shared.button`. |
| seo                | `component`   | **Component**: `shared.seo`.                                                 |
| layout             | `enumeration` | `default`, `full-width`, `sidebar-right`, `sidebar-left`. Default: `default`.|
| isHomePage         | `boolean`     | Default: `false`.                                                            |
| showInNavigation   | `boolean`     | Default: `true`.                                                             |
| navigationOrder    | `integer`     | Default: `1`.                                                                |

### 11. Payment Method (`/api/payment-methods`)

Payment options and configuration.

| Field Name                 | Type          | Details                                                                 |
| -------------------------- | ------------- | ----------------------------------------------------------------------- |
| name                       | `string`      | **Required**.                                                           |
| code                       | `string`      | **Required, Unique**.                                                   |
| description                | `text`        |                                                                         |
| isActive                   | `boolean`     | Default: `true`.                                                        |
| logo                       | `media`       | (Single)                                                                |
| instructions               | `richtext`    | Instructions for customers when using this payment method.              |
| processingFee              | `decimal`     | Fee charged for using this payment method (percentage or fixed amount). |
| isFeePercentage            | `boolean`     | Default: `true`. Whether the fee is a percentage or fixed amount.       |
| minimumOrderAmount         | `decimal`     | Minimum order amount required to use this payment method.               |
| stripePaymentMethodTypes   | `json`        | Stripe payment method types supported (card, alipay, etc.).             |
| providerSettings           | `json`        | **Private**. Configuration settings for the payment provider.           |
| displayOrder               | `integer`     | Default: `1`.                                                           |

### 12. Product (`/api/products`)

E-commerce products.

| Field Name       | Type        | Details                                                                    |
| ---------------- | ----------- | -------------------------------------------------------------------------- |
| name             | `string`    | **Required**.                                                              |
| slug             | `uid`       | **Required**. Auto-generated from `name`.                                  |
| shortDescription | `text`      | Max length: 160 chars.                                                     |
| description      | `richtext`  |                                                                            |
| price            | `component` | **Required**. **Component**: `shared.price`.                               |
| images           | `media`     | (Multiple)                                                                 |
| thumbnail        | `media`     | (Single)                                                                   |
| categories       | `relation`  | (Many-to-Many) -> `api::category.category`. Inversed by `products`.        |
| vendor           | `relation`  | (Many-to-One) -> `api::vendor.vendor`. Inversed by `products`.             |
| attributes       | `component` | (Repeatable) **Component**: `shared.product-attribute`.                    |
| metaInfo         | `component` | **Component**: `shared.meta-info`.                                         |
| stockInfo        | `component` | **Component**: `shared.stock-info`.                                        |
| featured         | `boolean`   | Default: `false`.                                                          |
| relatedProducts  | `relation`  | (Many-to-Many) -> `api::product.product`. Inversed by `relatedProducts`.   |
| seo              | `component` | **Component**: `shared.seo`.                                               |
| blocks           | `dynamiczone` | **Components**: `shared.media`, `shared.quote`, `shared.rich-text`, `shared.slider`. |
| variants         | `relation`  | (One-to-Many) -> `api::product-variant.product-variant`. Mapped by `product`. |
| hasVariants      | `boolean`   | Default: `false`.                                                          |
| sku              | `string`    | **Unique**.                                                                |
| items            | `relation`  | (One-to-Many) -> `api::order-item.order-item`. Mapped by `product`.        |
| reviews          | `relation`  | (One-to-Many) -> `api::review.review`. Mapped by `product`.                |
| wishlists        | `relation`  | (Many-to-Many) -> `api::wishlist.wishlist`. Mapped by `products`.          |
| averageRating    | `decimal`   | Min: `0`, Max: `5`.                                                        |
| reviewCount      | `integer`   | Default: `0`.                                                              |
| tags             | `relation`  | (Many-to-Many) -> `api::tag.tag`. Inversed by `products`.                  |
| qboId            | `string`    |                                                                            |

### 13. Product Variant (`/api/product-variants`)

Different options/sizes/prices for products.

| Field Name       | Type        | Details                                                                     |
| ---------------- | ----------- | --------------------------------------------------------------------------- |
| name             | `string`    | **Required**.                                                               |
| sku              | `string`    | **Unique**.                                                                 |
| price            | `decimal`   | **Required**.                                                               |
| compareAtPrice   | `decimal`   |                                                                             |
| product          | `relation`  | (Many-to-One) -> `api::product.product`. Inversed by `variants`.            |
| attributes       | `json`      | Color, size, etc. as key-value pairs.                                       |
| weight           | `decimal`   |                                                                             |
| dimensions       | `component` | **Component**: `shared.dimensions`.                                         |
| images           | `media`     | (Multiple)                                                                  |
| isDefault        | `boolean`   | Default: `false`.                                                           |
| inventory        | `relation`  | (One-to-One) -> `api::inventory.inventory`. Mapped by `productVariant`.     |

### 14. Review (`/api/reviews`)

Product reviews and ratings.

| Field Name           | Type          | Details                                                              |
| -------------------- | ------------- | -------------------------------------------------------------------- |
| title                | `string`      |                                                                      |
| content              | `text`        | **Required**.                                                        |
| rating               | `integer`     | **Required**. Min: `1`, Max: `5`.                                    |
| product              | `relation`    | (Many-to-One) -> `api::product.product`. Inversed by `reviews`.       |

---

## Custom Endpoints

These are custom routes created to handle specific application logic that goes beyond standard CRUD operations.

### 1. Create Payment Intent

- **Method**: `POST`
- **Path**: `/api/orders/payment-intent`
- **Description**: Creates a Stripe Payment Intent to initiate a secure payment transaction. The frontend will use the `clientSecret` returned from this endpoint to confirm the payment with Stripe.
- **Authentication**: Not required.
- **Request Body**:

  ```json
  {
    "amount": 1999
  }
  ```

| Field  | Type    | Details                                                                           |
| ------ | ------- | --------------------------------------------------------------------------------- |
| amount | `integer` | **Required**. The total amount for the order in the smallest currency unit (e.g., cents for USD). |

- **Success Response (`200 OK`)**:

  ```json
  {
    "clientSecret": "pi_3L...._secret_eT...."
  }
  ```

- **Error Response (`500 Internal Server Error`)**:

  ```json
  {
    "error": {
      "message": "There was a problem creating the payment intent."
    }
  }
  ```
**Security Note**: For production, the backend should not trust the `amount` sent from the client. The request should contain item identifiers (like SKUs or product IDs) and quantities. The backend must then fetch the prices from the database and calculate the total amount securely on the server.