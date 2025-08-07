# Plant Perfect Admin Panel Guide

Welcome to your Plant Perfect e-commerce website admin panel! This guide will walk you through all the basics of managing your online store without any technical jargon. 

## Getting Started

1. **Logging In**: 
   - Open your web browser and go to your admin panel URL (ask your developer for this)
   - Enter your email address and password
   - Click the "Login" button

2. **Dashboard Overview**:
   - The left sidebar contains all the sections you'll need to manage your store
   - The main area will display the content of whatever section you select

## Managing Your Products

### Adding a New Product

1. Go to "Content Manager" in the left sidebar
2. Click on "Product" under Collection Types
3. Click the "Create new entry" button in the top right
4. Fill in the product information:
   - **Name**: The name of the product
   - **Slug**: Automatically created from the name (this is the web address for the product)
   - **Short Description**: A brief summary that appears in product listings
   - **Description**: Detailed product information
   - **Price**: Set the price and any sale price
   - **Images**: Upload product images (click "Add more assets" to add multiple)
   - **Thumbnail**: Upload a small image that will appear in listings
   - **Categories**: Select which categories this product belongs to
   - **Vendor**: Select the supplier of this product
   - **Featured**: Toggle on if you want this product to appear in featured sections
   - **SEO**: Add information to help search engines find your product
5. When finished, click "Save" to save as a draft or "Publish" to make it live on your site

### Creating Product Variants

If your product comes in different options (like sizes, colors, etc.):

1. First, create your main product as above
2. Set "Has Variants" to Yes
3. Save or publish the product
4. Go to "Product Variant" in the Content Manager 
5. Click "Create new entry"
6. Fill in:
   - **Name**: Name of the variant (e.g. "Small", "Red", "5 lbs")
   - **SKU**: Your stock keeping unit code
   - **Price**: Price for this specific variant
   - **Product**: Select the main product this variant belongs to
   - **Attributes**: Add information about what makes this variant different
   - **Is Default**: Toggle on if this is the default option
7. Save or publish the variant
8. Repeat for each variant option

### Managing Inventory

1. Go to "Inventory" in the Content Manager
2. Click "Create new entry" or select an existing inventory item
3. Fill in:
   - **Quantity**: How many items you have in stock
   - **SKU**: Must match your product or variant SKU
   - **Product/Product Variant**: Select which product this inventory belongs to
   - **Status**: Choose between in stock, low stock, out of stock, etc.
4. Save your changes

### Managing Product Categories

1. Go to "Category" in the Content Manager
2. Click "Create new entry" to add a new category or select an existing one to edit
3. Fill in:
   - **Name**: Name of the category (e.g., "Mushroom Growing Kits")
   - **Slug**: Automatically created from the name
   - **Description**: Brief description of what products are in this category
   - **Parent Category**: If this is a subcategory, select its parent category
   - **Image**: Upload an image that represents this category
4. Save or publish when done

### Managing Tags

1. Go to "Tag" in the Content Manager
2. Click "Create new entry" to add a new tag or select an existing one to edit
3. Fill in:
   - **Name**: Name of the tag (e.g., "Organic", "Beginner-Friendly")
   - **Slug**: Automatically created from the name
   - **Description**: Brief description of what this tag represents
4. Save your changes
5. Use tags to help customers filter and find products more easily

### Managing Vendors

1. Go to "Vendor" in the Content Manager
2. Click "Create new entry" to add a new vendor or select an existing one to edit
3. Fill in:
   - **Name**: Vendor's company name (e.g., "Garden City Fungi")
   - **Description**: Information about this supplier
   - **Logo**: Upload the vendor's logo
   - **Contact Information**: Add email, phone number, website, etc.
   - **Products**: View or select products from this vendor
4. Save or publish when done

## Managing Orders

### Viewing Orders

1. Go to "Order" in the Content Manager
2. You'll see a list of all orders
3. Click on any order to view its details

### Processing an Order

1. Open the order you want to process
2. Update the "Status" field:
   - Pending: New order, not yet processed
   - Processing: You're working on the order
   - On-hold: Order is temporarily on hold
   - Completed: Order is fulfilled and shipped
   - Cancelled: Order has been cancelled
   - Refunded: Order has been refunded
   - Failed: Payment failed
3. Update "Payment Status" to reflect if payment was received
4. Add tracking information when shipped:
   - Enter the "Tracking Number"
   - Add the "Tracking URL"
   - Change "Shipping Status" to "Shipped"
5. Add any internal notes in "Admin Notes"
6. Click "Save" to update the order

### Managing Order Items

1. Go to "Order Item" in the Content Manager
2. View individual items within orders
3. This helps you track:
   - Which products are selling best
   - Item-specific information like quantities and prices
   - Any special options or customizations

### QuickBooks Integration

When an order is processed:
1. The system will automatically sync with QuickBooks Online
2. You can see the sync status in the "QBO Sync Status" field
3. If synced successfully, you'll see the QuickBooks Invoice ID

## Managing Customers

1. Go to "Customer" in the Content Manager
2. View a list of all your customers
3. Click on a customer to view their details, including:
   - Contact information
   - Order history
   - Saved addresses
   - Wishlists
   - Reviews they've left

## Managing Your Website Content

### Creating Blog Articles

1. Go to "Article" in the Content Manager
2. Click "Create new entry"
3. Fill in:
   - **Title**: The headline of your article
   - **Content**: The main body of your article
   - **Category**: Choose which blog category this belongs to
   - **Featured Image**: Upload a cover image
   - **SEO**: Add information to help with search engines
4. Click "Save" as draft or "Publish" to make it live

### Managing Blog Categories

1. Go to "Blog Category" in the Content Manager
2. Click "Create new entry" to add a new category or select an existing one to edit
3. Fill in:
   - **Name**: Category name (e.g., "Growing Tips", "Company News")
   - **Slug**: Automatically created from the name
   - **Description**: What kind of articles go in this category
   - **Parent Category**: If this is a subcategory, select its parent
4. Save or publish when done

### Creating Static Pages

1. Go to "Page" in the Content Manager
2. Click "Create new entry"
3. Fill in:
   - **Title**: The page title
   - **Slug**: Automatically created from title
   - **Content**: The page content
   - **SEO**: Search engine information
4. Save or publish the page

### Updating Site-wide Settings

1. Go to "Site-Setting" in the Content Manager
2. Update global site information like:
   - Store name
   - Contact information
   - Social media links
   - Business hours
   - Privacy policy
   - Terms and conditions
3. Click "Save" to update the settings

### Updating About and Global Information

1. Go to "About" or "Global" under Single Types
2. Update the information as needed
3. Click "Save" to update the information on your site

## Managing Customer Interactions

### Managing Reviews

1. Go to "Review" in the Content Manager
2. You'll see all product reviews submitted by customers
3. Click on a review to:
   - Read the full review
   - See the rating (1-5 stars)
   - Change the status (pending, approved, rejected, spam)
   - Add an admin response to the review
4. Save your changes

### Managing Contact Requests

1. Go to "Contact Request" in the Content Manager
2. View a list of all contact form submissions
3. Click on any entry to:
   - Read the full message
   - Update the status
   - Add internal notes
   - Assign to a team member
4. Save your changes

## Setting Up Your Store

### Adding Payment Methods

1. Go to "Payment Method" in the Content Manager
2. Click "Create new entry"
3. Fill in:
   - **Name**: Name of the payment method (e.g., "Credit Card", "PayPal")
   - **Description**: Instructions for the customer
   - **Logo**: Upload an image for the payment method
   - **Is Active**: Toggle on to make this payment method available

### Adding Shipping Methods

1. Go to "Shipping Method" in the Content Manager
2. Click "Create new entry"
3. Fill in:
   - **Name**: Name of shipping method (e.g., "Standard Shipping", "Express")
   - **Description**: Brief description of the shipping option
   - **Base Cost**: How much this shipping method costs
   - **Estimated Delivery Time**: How long shipping usually takes

## Understanding Customer Shopping Features

### Shopping Carts

1. Go to "Cart" in the Content Manager
2. View active shopping carts that customers have created
3. You can see:
   - Which items are in each cart
   - The total value
   - If the checkout process was started but not completed

### Wishlists

1. Go to "Wishlist" in the Content Manager
2. View customer wishlists
3. You can see which products customers are saving for later purchase

## Tips and Best Practices

1. **Save vs. Publish**: Use "Save" to store your work as a draft (not visible to customers). Use "Publish" when you're ready for the content to be visible on your website.

2. **Images**: 
   - Use high-quality images
   - Keep file sizes reasonable (under 1MB if possible)
   - Try to use consistent image dimensions for a professional look

3. **Content Organization**:
   - Keep product descriptions clear and thorough
   - Use categories consistently
   - Add tags to help customers find products

4. **Regular Maintenance**:
   - Check orders daily
   - Update inventory regularly
   - Respond to customer reviews promptly

5. **Order Processing Workflow**:
   - Process new orders as soon as possible
   - Update order status at each step
   - Add tracking information when shipping
   - Mark orders as completed when fulfilled

6. **Customer Communication**:
   - Respond to contact requests within 24 hours
   - Address negative reviews professionally
   - Use admin notes to keep track of customer interactions