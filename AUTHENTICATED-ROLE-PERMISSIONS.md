# Authenticated Role Permissions for Plant Perfect E-commerce Site

## Collection Types Permissions

### Content Access Permissions

| Collection Type | find | findOne | create | update | delete |
| --------------- | ---- | ------- | ------ | ------ | ------ |
| Article         | ✅   | ✅      | ❌     | ❌     | ❌     |
| Blog-Category   | ✅   | ✅      | ❌     | ❌     | ❌     |
| Cart            | ✅   | ✅      | ✅     | ✅     | ✅     |
| Category        | ✅   | ✅      | ❌     | ❌     | ❌     |
| Contact-Request | ❌   | ❌      | ✅     | ❌     | ❌     |
| Customer        | ✅   | ✅      | ✅     | ✅     | ❌     |
| Inventory       | ✅   | ✅      | ❌     | ❌     | ❌     |
| Order           | ✅   | ✅      | ✅     | ❌     | ❌     |
| Order-Item      | ✅   | ✅      | ✅     | ❌     | ❌     |
| Page            | ✅   | ✅      | ❌     | ❌     | ❌     |
| Payment-Method  | ✅   | ✅      | ❌     | ❌     | ❌     |
| Product         | ✅   | ✅      | ❌     | ❌     | ❌     |
| Product-Variant | ✅   | ✅      | ❌     | ❌     | ❌     |
| Review          | ✅   | ✅      | ✅     | ✅     | ✅     |
| Shipping-Method | ✅   | ✅      | ❌     | ❌     | ❌     |
| Tag             | ✅   | ✅      | ❌     | ❌     | ❌     |
| Vendor          | ❌   | ❌      | ❌     | ❌     | ❌     |
| Wishlist        | ✅   | ✅      | ✅     | ✅     | ✅     |

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
| changePassword        | ✅      |

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
| create  | ❌      |
| update  | ✅      |
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

1. **Key Differences from Public Role**:

   - Authenticated users can delete their own carts and wishlists
   - Authenticated users can update and delete their own reviews
   - Authenticated users can update their own customer profile
   - Authenticated users can change their password
   - Authenticated users can update their user account

2. **Create Permissions**: Create permissions are granted for:

   - Orders (checkout)
   - Order Items (adding to cart)
   - Contact Requests (submitting contact forms)
   - Reviews (submitting product reviews)
   - Cart (creating shopping carts)
   - Wishlist (creating wishlists)
   - Customer (creating their customer profile)

3. **Update Permissions**: Update permissions are granted for:

   - Cart (modifying cart contents)
   - Wishlist (modifying wishlist items)
   - Customer (updating their own profile)
   - Reviews (editing their own reviews)
   - User (updating their account)

4. **Delete Permissions**: Delete permissions are limited to:

   - Cart (removing their shopping cart)
   - Wishlist (deleting their wishlists)
   - Reviews (removing their own reviews)

5. **Content Access**: Like public users, authenticated users have read-only access to all content and product information but cannot edit or create this content.

6. **Vendor Information Hidden**: Vendor information remains hidden from authenticated users, maintaining the drop shipping business model.

7. **Privacy and Security**: Authenticated users can only access and modify their own data, enforced through proper relation filters in the API.

This permission setup enhances the e-commerce experience for authenticated users while maintaining security and business model privacy. It allows users to manage their personal content (reviews, wishlists, profile) while protecting system-level and business operations data.
