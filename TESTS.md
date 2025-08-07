# Testing Tasks for Plant Perfect Admin Panel

## 1. Set Up Basic Content

### Task 1: Create Tags
1. Go to Content Manager → Tag → Create new entry
2. Create the following tags:
   - Name: Organic
     - Description: Certified organic products without synthetic fertilizers or pesticides
   - Name: Beginner-Friendly
     - Description: Perfect for people just starting their growing journey
   - Name: Advanced
     - Description: For experienced growers looking for a challenge
   - Name: Indoor
     - Description: Suitable for indoor growing environments
   - Name: Outdoor
     - Description: Designed for outdoor gardens and plots

### Task 2: Create Blog Categories
1. Go to Content Manager → Blog Category → Create new entry
2. Create the following categories:
   - Name: Growing Tips
     - Description: Helpful advice for successful growing
   - Name: Plant Care
     - Description: How to maintain healthy plants
   - Name: Recipes
     - Description: Delicious ways to use your harvest
   - Name: Company News
     - Description: Updates about Plant Perfect

### Task 3: Create Product Categories
1. Go to Content Manager → Category → Create new entry
2. Create the following categories:
   - Name: Mushroom Growing Kits
     - Description: Complete kits for growing gourmet mushrooms
   - Name: Soil Enhancers
     - Description: Products to improve your growing medium
   - Name: Seeds
     - Description: High-quality seeds for various plants
     - Create a subcategory:
       - Name: Vegetable Seeds
         - Parent Category: Seeds
   - Name: Tools
     - Description: Essential gardening and growing tools

### Task 4: Create Vendors
1. Go to Content Manager → Vendor → Create new entry
2. Create the following vendors:
   - Name: Garden City Fungi
     - Description: Specialist in mushroom cultivation supplies
   - Name: HortiRIGHT Co
     - Description: Premium soil and fertilizer producer
   - Name: Green Thumb Tools
     - Description: Quality gardening implements and accessories

## 2. Set Up E-commerce Infrastructure

### Task 5: Create Shipping Methods
1. Go to Content Manager → Shipping Method → Create new entry
2. Create the following shipping methods:
   - Name: Standard Shipping
     - Description: 5-7 business days delivery
     - Base Cost: 8.99
     - Estimated Delivery Time: 5-7 business days
   - Name: Express Shipping
     - Description: 2-3 business days delivery
     - Base Cost: 14.99
     - Estimated Delivery Time: 2-3 business days
   - Name: Free Local Pickup
     - Description: Pick up your order at our warehouse
     - Base Cost: 0
     - Estimated Delivery Time: Same day (during business hours)

### Task 6: Create Payment Methods
1. Go to Content Manager → Payment Method → Create new entry
2. Create the following payment methods:
   - Name: Credit Card
     - Code: credit_card
     - Description: Pay securely with Visa, Mastercard, American Express, or Discover
     - Is Active: Yes
   - Name: PayPal
     - Code: paypal
     - Description: Pay using your PayPal account
     - Is Active: Yes
   - Name: Shop Pay
     - Code: shop_pay
     - Description: Fast and secure checkout with Shop Pay
     - Is Active: Yes

## 3. Create Products and Variants

### Task 7: Create Basic Products
1. Go to Content Manager → Product → Create new entry
2. Create the following product:
   - Name: Shiitake Mushroom Growing Kit
   - Short Description: Grow delicious shiitake mushrooms at home with this easy-to-use kit
   - Description: [Add detailed growing instructions]
   - Price: 24.99
   - Categories: Mushroom Growing Kits
   - Vendor: Garden City Fungi
   - Tags: Beginner-Friendly, Indoor
   - Featured: Yes
   - SKU: MUSH-SHI-001
   - Has Variants: No
3. Create another product:
   - Name: Premium Organic Potting Soil
   - Short Description: Rich, nutrient-dense soil for all your container plants
   - Price: 19.99
   - Categories: Soil Enhancers
   - Vendor: HortiRIGHT Co
   - Tags: Organic, Indoor, Outdoor
   - Featured: Yes
   - SKU: SOIL-POT-001
   - Has Variants: Yes

### Task 8: Create Product Variants
1. Go to Content Manager → Product Variant → Create new entry
2. Create variants for the "Premium Organic Potting Soil":
   - Name: 5 Quart Bag
     - SKU: SOIL-POT-5QT
     - Price: 19.99
     - Product: Premium Organic Potting Soil
     - Is Default: Yes
   - Name: 10 Quart Bag
     - SKU: SOIL-POT-10QT
     - Price: 34.99
     - Product: Premium Organic Potting Soil
   - Name: 20 Quart Bag
     - SKU: SOIL-POT-20QT
     - Price: 59.99
     - Product: Premium Organic Potting Soil

### Task 9: Set Up Inventory
1. Go to Content Manager → Inventory → Create new entry
2. Create inventory for each product and variant:
   - SKU: MUSH-SHI-001
     - Quantity: 50
     - Product: Shiitake Mushroom Growing Kit
     - Status: in_stock
   - SKU: SOIL-POT-5QT
     - Quantity: 75
     - Product Variant: 5 Quart Bag
     - Status: in_stock
   - SKU: SOIL-POT-10QT
     - Quantity: 40
     - Product Variant: 10 Quart Bag
     - Status: in_stock
   - SKU: SOIL-POT-20QT
     - Quantity: 15
     - Product Variant: 20 Quart Bag
     - Status: low_stock

## 4. Create Website Content

### Task 10: Create Blog Articles
1. Go to Content Manager → Article → Create new entry
2. Create the following articles:
   - Title: 5 Tips for Growing Perfect Mushrooms Indoors
     - Category: Growing Tips
     - Tags: Beginner-Friendly, Indoor
     - Content: [Add helpful mushroom growing content]
     - Related Products: Shiitake Mushroom Growing Kit
   - Title: The Benefits of Organic Soil for Your Garden
     - Category: Plant Care
     - Tags: Organic, Outdoor
     - Content: [Add informative content about organic soil]
     - Related Products: Premium Organic Potting Soil

### Task 11: Create Static Pages
1. Go to Content Manager → Page → Create new entry
2. Create the following pages:
   - Title: About Us
     - Content: [Add company history and mission]
   - Title: Shipping & Returns
     - Content: [Add your shipping and return policies]
   - Title: FAQ
     - Content: [Add frequently asked questions]
   - Title: Contact Us
     - Content: [Add contact form and information]

### Task 12: Update Single Types
1. Go to Content Manager → About (Single Type)
2. Update with company information and story
3. Go to Content Manager → Global (Single Type)
4. Update with site-wide information
5. Go to Content Manager → Site Settings (Single Type)
6. Update with:
   - Store Name: Plant Perfect
   - Contact Email: info@plantperfect.com
   - Phone: (555) 123-4567
   - Address: 123 Garden Way, Green City, ST 12345

## 5. Simulate Customer Activity

### Task 13: Create Customers
1. Go to Content Manager → Customer → Create new entry
2. Create the following customers:
   - Email: jane.smith@example.com
     - First Name: Jane
     - Last Name: Smith
     - Phone: (555) 987-6543
   - Email: john.doe@example.com
     - First Name: John
     - Last Name: Doe
     - Phone: (555) 234-5678

### Task 14: Create Customer Reviews
1. Go to Content Manager → Review → Create new entry
2. Create the following reviews:
   - Title: Amazing Results!
     - Content: I've never had such success growing mushrooms before. Highly recommend!
     - Rating: 5
     - Product: Shiitake Mushroom Growing Kit
     - Customer: Jane Smith
     - Status: approved
   - Title: Good soil but pricey
     - Content: The soil quality is excellent, but I wish it came in larger sizes for better value.
     - Rating: 4
     - Product: Premium Organic Potting Soil
     - Customer: John Doe
     - Status: approved

### Task 15: Create Wishlists
1. Go to Content Manager → Wishlist → Create new entry
2. Create the following wishlists:
   - Name: Garden Supplies
     - Customer: Jane Smith
     - Products: Shiitake Mushroom Growing Kit, Premium Organic Potting Soil

### Task 16: Create Contact Requests
1. Go to Content Manager → Contact Request → Create new entry
2. Create the following contact requests:
   - Name: Mark Johnson
     - Email: mark.johnson@example.com
     - Subject: Question about shipping
     - Message: Do you ship to Canada? If so, what are the costs?
     - Status: new
   - Name: Sarah Williams
     - Email: sarah.williams@example.com
     - Subject: Wholesale inquiry
     - Message: I'm interested in purchasing your products for my garden center. Do you offer wholesale pricing?
     - Status: in-progress

## 6. Simulate Order Processing

### Task 17: Create Orders and Order Items
1. Go to Content Manager → Order → Create new entry
2. Create the following order:
   - Order Number: ORD-2023-0001
   - Customer: Jane Smith
   - Status: processing
   - Payment Status: paid
   - Subtotal: 24.99
   - Shipping Total: 8.99
   - Tax Total: 3.40
   - Total: 37.38
   - Order Date: [Today's date]
3. Go to Content Manager → Order Item → Create new entry
4. Create the following order item:
   - Quantity: 1
   - Unit Price: 24.99
   - Total Price: 24.99
   - Order: ORD-2023-0001
   - Product: Shiitake Mushroom Growing Kit
   - Product Name: Shiitake Mushroom Growing Kit
5. Go back to the order and verify the order item appears

### Task 18: Process the Order
1. Go to Content Manager → Order → Select ORD-2023-0001
2. Update the status to "completed"
3. Add tracking information:
   - Tracking Number: 1Z999AA10123456784
   - Tracking URL: https://www.ups.com/track?tracknum=1Z999AA10123456784
   - Shipping Status: shipped
4. Save the changes

## 7. Check Integration Features

### Task 19: Verify Relationships
1. Go to Content Manager → Product → Shiitake Mushroom Growing Kit
2. Check that the reviews appear correctly
3. Go to Content Manager → Customer → Jane Smith
4. Verify that her order, review, and wishlist appear correctly

### Task 20: Test Admin Guide
1. Open your ADMIN-GUIDE.md file
2. Follow several procedures to ensure they are accurate and complete
3. Make any necessary updates based on your experience with the testing tasks