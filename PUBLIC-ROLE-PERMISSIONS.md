# Public Role Permissions for Plant Perfect E-commerce Site

## Collection Types Permissions

### Content Access Permissions

| Collection Type | find | findOne | create | update | delete |
| --------------- | ---- | ------- | ------ | ------ | ------ |
| Article         | ✅   | ✅      | ❌     | ❌     | ❌     |
| Blog-Category   | ✅   | ✅      | ❌     | ❌     | ❌     |
| Cart            | ✅   | ✅      | ✅     | ✅     | ❌     |
| Category        | ✅   | ✅      | ❌     | ❌     | ❌     |
| Contact-Request | ❌   | ❌      | ✅     | ❌     | ❌     |
| Customer        | ✅   | ✅      | ❌     | ❌     | ❌     |
| Inventory       | ✅   | ✅      | ❌     | ❌     | ❌     |
| Order           | ✅   | ✅      | ✅     | ❌     | ❌     |
| Order-Item      | ✅   | ✅      | ✅     | ❌     | ❌     |
| Page            | ✅   | ✅      | ❌     | ❌     | ❌     |
| Payment-Method  | ✅   | ✅      | ❌     | ❌     | ❌     |
| Product         | ✅   | ✅      | ❌     | ❌     | ❌     |
| Product-Variant | ✅   | ✅      | ❌     | ❌     | ❌     |
| Review          | ✅   | ✅      | ✅     | ❌     | ❌     |
| Shipping-Method | ✅   | ✅      | ❌     | ❌     | ❌     |
| Tag             | ✅   | ✅      | ❌     | ❌     | ❌     |
| Vendor          | ❌   | ❌      | ❌     | ❌     | ❌     |
| Wishlist        | ✅   | ✅      | ✅     | ✅     | ❌     |

## Single Types Permissions

| Single Type  | find | update |
| ------------ | ---- | ------ |
| About        | ✅   | ❌     |
| Global       | ✅   | ❌     |
| Site-Setting | ✅   | ❌     |

## Plugin Permissions

### Content-Type Builder Plugin

| Action          | Allowed |
| --------------- | ------- |
| getComponent    | ❌      |
| getComponents   | ❌      |
| getContentType  | ❌      |
| getContentTypes | ❌      |

### Users-Permissions Plugin

#### AUTH

| Action                | Allowed |
| --------------------- | ------- |
| callback              | ✅      |
| connect               | ✅      |
| forgotPassword        | ✅      |
| resetPassword         | ✅      |
| emailConfirmation     | ✅      |
| sendEmailConfirmation | ✅      |
| register              | ✅      |
| changePassword        | ❌      |

#### PERMISSIONS

| Action         | Allowed |
| -------------- | ------- |
| getPermissions | ❌      |

#### ROLE

| Action     | Allowed |
| ---------- | ------- |
| find       | ✅      |
| findOne    | ✅      |
| createRole | ❌      |
| updateRole | ❌      |
| deleteRole | ❌      |

#### USER

| Action  | Allowed |
| ------- | ------- |
| find    | ✅      |
| findOne | ✅      |
| me      | ✅      |
| create  | ✅      |
| update  | ❌      |
| destroy | ❌      |
| count   | ❌      |

## Upload Plugin (if applicable)

| Action  | Allowed |
| ------- | ------- |
| upload  | ✅      |
| findOne | ✅      |
| find    | ✅      |

## Email Plugin (if applicable)

| Action | Allowed |
| ------ | ------- |
| send   | ❌      |

## Summary Notes

1. **Read-Only for Most Collections**: Most collections are set to read-only (find/findOne) for public users, allowing them to browse products, articles, categories, etc.

2. **Create Permissions**: Create permissions are only granted for:

   - Orders (guest checkout)
   - Order Items (adding to cart)
   - Contact Requests (submitting contact forms)
   - Reviews (submitting product reviews)
   - Cart (creating shopping carts)
   - Wishlist (creating wishlists)

3. **Update Permissions**: Update permissions are limited to:

   - Cart (modifying cart contents)
   - Wishlist (modifying wishlist items)

4. **Authentication Flow**: The permissions enable a complete authentication flow including registration, login, and password reset.

5. **User Management**: Public users can view basic user information but cannot modify user accounts.

6. **Admin-Only Areas**: Content structure management, user permissions, and all deletion operations are restricted to admin users only.

This permission setup provides a secure but functional e-commerce experience for public (unauthenticated) users.
