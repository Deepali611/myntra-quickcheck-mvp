import productsData from '../data/products.json' with { type: 'json' };

/**
 * Catalogue Data Module
 * Reads local static products.json dataset
 */
export function getAllProducts() {
  return productsData || [];
}

export function getProduct(id) {
  if (!id) return null;
  const products = getAllProducts();
  return products.find(p => p.id === id) || null;
}

export function getProductsByDepartment(department) {
  if (!department) return [];
  const deptLower = department.toLowerCase();
  return getAllProducts().filter(p => p.department.toLowerCase() === deptLower);
}

export function getCategory(department, category) {
  const deptProducts = getProductsByDepartment(department);
  if (!category || (Array.isArray(category) && category.length === 0)) {
    return deptProducts;
  }
  const catString = Array.isArray(category) ? category.join(' ') : category;
  const catLower = catString.toLowerCase();
  
  return deptProducts.filter(p => 
    p.category.toLowerCase().includes(catLower) ||
    p.subcategory.toLowerCase().includes(catLower)
  );
}

export function searchProducts(query) {
  if (!query || typeof query !== 'string' || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  return getAllProducts().filter(p => 
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.department.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q)
  );
}

export function getRelatedProducts(productId, limit = 6) {
  const target = getProduct(productId);
  if (!target) return [];
  
  const all = getAllProducts();
  const sameDepartmentAndSubcat = all.filter(p => 
    p.id !== target.id && 
    p.department === target.department && 
    p.subcategory === target.subcategory
  );

  if (sameDepartmentAndSubcat.length >= limit) {
    return sameDepartmentAndSubcat.slice(0, limit);
  }

  const sameDepartment = all.filter(p => 
    p.id !== target.id && 
    p.department === target.department
  );

  return sameDepartment.slice(0, limit);
}
