# Brand Collection Guide

## Overview

The **Brand** collection has been added to your Tahir Electronics backend to manage electronics brands and manufacturers. This collection provides a centralized way to organize products by their brands and create brand-focused features in your frontend.

## Schema Details

### Fields

| Field         | Type     | Required | Description                                         |
| ------------- | -------- | -------- | --------------------------------------------------- |
| `name`        | String   | ✅ Yes   | Brand name (e.g., "Samsung", "Apple")               |
| `slug`        | UID      | ✅ Yes   | URL-friendly identifier (auto-generated from name)  |
| `description` | Text     | ❌ No    | Brief description of the brand (max 500 characters) |
| `image`       | Media    | ❌ No    | Brand logo or image (images only)                   |
| `products`    | Relation | ❌ No    | One-to-many relationship with products              |

### Validation Rules

- **Name**: Unique, max 100 characters
- **Slug**: Unique, auto-generated from name
- **Description**: Max 500 characters
- **Image**: Images only (JPG, PNG, WebP, etc.)

## API Endpoints

### REST API

```bash
# Get all brands
GET /api/brands

# Get single brand by ID
GET /api/brands/:id

# Get brand by slug
GET /api/brands?filters[slug][$eq]=samsung

# Create new brand (Admin only)
POST /api/brands

# Update brand (Admin only)
PUT /api/brands/:id

# Delete brand (Admin only)
DELETE /api/brands/:id
```

### Query Examples

```javascript
// Get all published brands
fetch("/api/brands");

// Get brand with products
fetch("/api/brands?populate=products");

// Get brand with image
fetch("/api/brands?populate=image");

// Get brand with both products and image
fetch("/api/brands?populate[products]=*&populate[image]=*");

// Search brands by name
fetch("/api/brands?filters[name][$containsi]=samsung");

// Get brands sorted by name
fetch("/api/brands?sort=name:asc");
```

## Product Relationship

### In Product Schema

Products now have a `brand` field that creates a many-to-one relationship:

```json
{
  "brand": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "api::brand.brand",
    "inversedBy": "products"
  }
}
```

### Usage Examples

```javascript
// Get product with brand information
fetch("/api/products/:id?populate=brand");

// Get all products for a specific brand
fetch("/api/products?filters[brand][slug][$eq]=samsung");

// Get products with brand and category
fetch("/api/products?populate[brand]=*&populate[categories]=*");
```

## Permissions

### Public Role

- ✅ `find` - Can list all brands
- ✅ `findOne` - Can view individual brands

### Authenticated Role

- ✅ `find` - Can list all brands
- ✅ `findOne` - Can view individual brands

### Admin Role

- ✅ Full CRUD access through admin panel

## Sample Data

### Seeding Brands

Use the provided seeding script to add sample electronics brands:

```bash
npm run seed:brands
```

This creates 12 popular electronics brands including:

- Samsung
- Apple
- Sony
- LG
- HP
- Dell
- Xiaomi
- Canon
- Panasonic
- Bose
- Nintendo
- Microsoft

## Frontend Integration

### Brand Listing Page

```javascript
// components/BrandList.js
import { useState, useEffect } from "react";

export default function BrandList() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("/api/brands?populate=image")
      .then((res) => res.json())
      .then((data) => setBrands(data.data));
  }, []);

  return (
    <div className="brand-grid">
      {brands.map((brand) => (
        <div key={brand.id} className="brand-card">
          {brand.attributes.image?.data && (
            <img
              src={brand.attributes.image.data.attributes.url}
              alt={brand.attributes.name}
            />
          )}
          <h3>{brand.attributes.name}</h3>
          <p>{brand.attributes.description}</p>
          <a href={`/brands/${brand.attributes.slug}`}>View Products</a>
        </div>
      ))}
    </div>
  );
}
```

### Brand Product Page

```javascript
// pages/brands/[slug].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function BrandPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (slug) {
      // Get brand info
      fetch(`/api/brands?filters[slug][$eq]=${slug}&populate=image`)
        .then((res) => res.json())
        .then((data) => setBrand(data.data[0]));

      // Get brand products
      fetch(`/api/products?filters[brand][slug][$eq]=${slug}&populate=*`)
        .then((res) => res.json())
        .then((data) => setProducts(data.data));
    }
  }, [slug]);

  if (!brand) return <div>Loading...</div>;

  return (
    <div>
      <div className="brand-header">
        {brand.attributes.image?.data && (
          <img
            src={brand.attributes.image.data.attributes.url}
            alt={brand.attributes.name}
          />
        )}
        <h1>{brand.attributes.name}</h1>
        <p>{brand.attributes.description}</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

### Product Filters

```javascript
// components/ProductFilters.js
export default function ProductFilters({ onFilterChange }) {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data.data));
  }, []);

  return (
    <div className="filters">
      <select onChange={(e) => onFilterChange("brand", e.target.value)}>
        <option value="">All Brands</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.attributes.slug}>
            {brand.attributes.name}
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Admin Panel Usage

### Adding Brands

1. **Access Admin Panel**: `http://localhost:1337/admin`
2. **Navigate to Content Manager** → **Brands**
3. **Click "Create new entry"**
4. **Fill in the form**:
   - Name: Brand name (required)
   - Slug: Auto-generated, but can be customized
   - Description: Brief brand description
   - Image: Upload brand logo
5. **Save & Publish**

### Managing Brand-Product Relationships

1. **Edit a Product** in the admin panel
2. **Select Brand** from the dropdown in the brand field
3. **Save** the product

OR

1. **Edit a Brand** in the admin panel
2. **View Related Products** in the products relation field
3. **Add/Remove Products** as needed

## Best Practices

### 1. Brand Images

- Use consistent image sizes (recommended: 200x200px)
- Use transparent PNG for logos
- Optimize images for web (keep file sizes small)

### 2. Brand Descriptions

- Keep descriptions concise (under 200 characters)
- Focus on what makes the brand unique
- Include key product categories

### 3. SEO Optimization

- Use brand names exactly as they appear officially
- Create SEO-friendly slugs
- Consider brand keywords for search

### 4. Data Consistency

- Always associate products with appropriate brands
- Maintain consistent brand naming
- Regular data audits to ensure accuracy

## Troubleshooting

### Common Issues

1. **Brand not appearing in product dropdown**

   - Ensure brand is published
   - Check brand permissions
   - Refresh admin panel

2. **Products not showing brand relationship**

   - Verify relationship is saved in product
   - Check API populate parameters
   - Ensure brand is published

3. **Brand images not loading**
   - Verify image upload was successful
   - Check file permissions
   - Ensure correct image URL in API response

### Debugging API Calls

```bash
# Test brand API
curl http://localhost:1337/api/brands

# Test with population
curl "http://localhost:1337/api/brands?populate=*"

# Test product-brand relationship
curl "http://localhost:1337/api/products?populate=brand"
```

## Migration Notes

If you have existing products without brands:

1. **Backup your database** before making changes
2. **Create brands** for your existing products
3. **Update products** to associate with brands
4. **Test thoroughly** before deploying to production

---

## Quick Commands

```bash
# Start development server
npm run develop

# Seed sample brands
npm run seed:brands

# Clean all data (preserves schema)
npm run clean:store

# Set up fresh database
npm run setup:database

# Configure permissions
npm run configure:permissions
```

Your brand collection is now ready to enhance your Tahir Electronics store! 📱✨
