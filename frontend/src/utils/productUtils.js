// Product utilities for stable data handling

export const PRODUCT_FALLBACK = {
  id: 0,
  name: "Product Unavailable",
  category: "Unknown",
  price: 0,
  description: "Product information not available",
  image: "/api/placeholder/300/300",
  stock: 0,
  rating: 0,
  reviews: 0
};

export const validateProduct = (product) => {
  if (!product || typeof product !== 'object') {
    return PRODUCT_FALLBACK;
  }
  
  let categoryName = "Unknown";
  if (product.category) {
    if (typeof product.category === 'object') {
      categoryName = product.category.name || "Unknown";
    } else {
      categoryName = String(product.category);
    }
  }
  
  return {
    id: product.id || 0,
    name: product.name || "Unknown Product",
    category: categoryName,
    price: Number(product.price) || 0,
    description: product.description || "No description available",
    image: product.image || product.imageUrl || "/api/placeholder/300/300",
    stock: Number(product.stock) || 0,
    rating: Number(product.rating) || 0,
    reviews: Number(product.reviews) || 0,
    brand: product.brand || "",
    manufacturer: product.manufacturer || "",
    modelNumber: product.modelNumber || "",
    specifications: product.specifications || {},
    features: product.features || []
  };
};

export const filterProducts = (products, filters) => {
  let filtered = [...products];
  
  if (filters.category && filters.category !== 'All Categories') {
    filtered = filtered.filter(p => p.category === filters.category);
  }
  
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-').map(Number);
    filtered = filtered.filter(p => p.price >= min && p.price <= max);
  }
  
  switch (filters.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // featured - keep original order
      break;
  }
  
  return filtered;
};
