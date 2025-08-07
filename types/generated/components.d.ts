import type { Schema, Struct } from '@strapi/strapi';

export interface OrderOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_order_order_items';
  info: {
    description: 'Individual item in an order';
    displayName: 'Order Item';
    icon: 'shopping-cart';
  };
  attributes: {
    metadata: Schema.Attribute.JSON;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    productName: Schema.Attribute.String & Schema.Attribute.Required;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    selectedAttributes: Schema.Attribute.Component<
      'shared.product-attribute',
      true
    >;
    sku: Schema.Attribute.String;
    subtotal: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    unitPrice: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    description: 'Address information for shipping and billing';
    displayName: 'Address';
    icon: 'map-marker-alt';
  };
  attributes: {
    addressLine1: Schema.Attribute.String & Schema.Attribute.Required;
    addressLine2: Schema.Attribute.String;
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'United States'>;
    isDefault: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    postalCode: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    type: Schema.Attribute.Enumeration<['shipping', 'billing', 'both']> &
      Schema.Attribute.DefaultTo<'both'>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    description: 'Call to action button component';
    displayName: 'Button';
    icon: 'hand-pointer';
  };
  attributes: {
    icon: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    size: Schema.Attribute.Enumeration<['small', 'medium', 'large']> &
      Schema.Attribute.DefaultTo<'medium'>;
    style: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'outline', 'text']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
    target: Schema.Attribute.Enumeration<['_self', '_blank']> &
      Schema.Attribute.DefaultTo<'_self'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_infos';
  info: {
    description: 'Collection of social media links with custom images';
    displayName: 'Social Media Links';
    icon: 'share-alt';
  };
  attributes: {
    socialLinks: Schema.Attribute.Component<'shared.social-link', true>;
  };
}

export interface SharedDimensions extends Struct.ComponentSchema {
  collectionName: 'components_shared_dimensions';
  info: {
    description: 'Product or package dimensions';
    displayName: 'Dimensions';
  };
  attributes: {
    height: Schema.Attribute.Decimal;
    length: Schema.Attribute.Decimal;
    unit: Schema.Attribute.Enumeration<['in', 'cm', 'm', 'ft']> &
      Schema.Attribute.DefaultTo<'in'>;
    width: Schema.Attribute.Decimal;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedMetaInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_meta_infos';
  info: {
    description: 'Product metadata like SKU, weight, dimensions, etc.';
    displayName: 'Meta Info';
    icon: 'info-circle';
  };
  attributes: {
    barcode: Schema.Attribute.String;
    dimensionUnit: Schema.Attribute.Enumeration<['in', 'cm', 'm']> &
      Schema.Attribute.DefaultTo<'in'>;
    height: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    isShippable: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    length: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    sku: Schema.Attribute.String;
    weight: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    weightUnit: Schema.Attribute.Enumeration<['lb', 'oz', 'kg', 'g']> &
      Schema.Attribute.DefaultTo<'lb'>;
    width: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SharedPrice extends Struct.ComponentSchema {
  collectionName: 'components_shared_prices';
  info: {
    description: 'Price information including regular and sale price';
    displayName: 'Price';
    icon: 'dollar-sign';
  };
  attributes: {
    currency: Schema.Attribute.Enumeration<['PKR']> &
      Schema.Attribute.DefaultTo<'PKR'>;
    onSale: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    regularPrice: Schema.Attribute.Decimal &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface SharedProductAttribute extends Struct.ComponentSchema {
  collectionName: 'components_shared_product_attributes';
  info: {
    description: 'Product attributes like size, color, material, etc.';
    displayName: 'Product Attribute';
    icon: 'tag';
  };
  attributes: {
    additionalPrice: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    displayOrder: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'Search engine optimization metadata';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    canonicalURL: Schema.Attribute.String;
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaKeywords: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'index, follow'>;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
    structuredData: Schema.Attribute.JSON;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

export interface SharedSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_links';
  info: {
    description: 'Social media link with custom image and URL';
    displayName: 'Social Link';
    icon: 'link';
  };
  attributes: {
    altText: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    platform: Schema.Attribute.String & Schema.Attribute.Required;
    sortOrder: Schema.Attribute.Integer;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStockInfo extends Struct.ComponentSchema {
  collectionName: 'components_shared_stock_infos';
  info: {
    description: 'Product stock and inventory information';
    displayName: 'Stock Info';
    icon: 'boxes';
  };
  attributes: {
    backorderAllowed: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    inStock: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    lowStockThreshold: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    maxPurchaseQuantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    soldIndividually: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    stockQuantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    vendorSku: Schema.Attribute.String;
    vendorStockSync: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
  };
}

export interface WishlistWishlistItem extends Struct.ComponentSchema {
  collectionName: 'components_wishlist_wishlist_items';
  info: {
    description: 'Items in a wishlist with additional metadata';
    displayName: 'Wishlist Item';
  };
  attributes: {
    addedAt: Schema.Attribute.DateTime;
    note: Schema.Attribute.Text;
    priority: Schema.Attribute.Enumeration<['low', 'medium', 'high']> &
      Schema.Attribute.DefaultTo<'medium'>;
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    productVariant: Schema.Attribute.Relation<
      'oneToOne',
      'api::product-variant.product-variant'
    >;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'order.order-item': OrderOrderItem;
      'shared.address': SharedAddress;
      'shared.button': SharedButton;
      'shared.contact-info': SharedContactInfo;
      'shared.dimensions': SharedDimensions;
      'shared.media': SharedMedia;
      'shared.meta-info': SharedMetaInfo;
      'shared.price': SharedPrice;
      'shared.product-attribute': SharedProductAttribute;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
      'shared.social-link': SharedSocialLink;
      'shared.stock-info': SharedStockInfo;
      'wishlist.wishlist-item': WishlistWishlistItem;
    }
  }
}
