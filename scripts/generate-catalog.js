const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const IMAGE_SOURCES_FILE = path.join(DATA_DIR, 'image-sources.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

// Department metadata & brand lists per architecture.md §3a
const DEPARTMENTS = {
  'Women': {
    tier: 'full',
    brands: ['Libas', 'Koskii', 'Varanga', 'W', 'Biba', 'AND', 'Global Desi', 'Zara', 'H&M'],
    categories: ['Ethnic Wear', 'Western Wear'],
    pricing: { minPrice: 1299, maxPrice: 4999, minDiscount: 20, maxDiscount: 60 }
  },
  'Men': {
    tier: 'full',
    brands: ["Levi's", 'U.S. Polo Assn.', 'Roadster', 'H&M', 'Zara'],
    categories: ['Topwear', 'Bottomwear', 'Outerwear'],
    pricing: { minPrice: 999, maxPrice: 3999, minDiscount: 25, maxDiscount: 65 }
  },
  'Kids': {
    tier: 'full',
    brands: ['H&M Kids', 'Mothercare', 'Allen Solly Junior'],
    categories: ['Boys Wear', 'Girls Wear'],
    pricing: { minPrice: 699, maxPrice: 2499, minDiscount: 15, maxDiscount: 50 }
  },
  'Footwear': {
    tier: 'full',
    brands: ['Puma', 'Bata', 'Metro', 'Crocs', 'Woodland'],
    categories: ['Casual', 'Sports', 'Formal', 'Heels'],
    pricing: { minPrice: 1499, maxPrice: 5999, minDiscount: 30, maxDiscount: 60 }
  },
  'Beauty': {
    tier: 'extended',
    brands: ['FoxTale', 'The Derma Co.', 'Lakmé', 'Maybelline'],
    categories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'],
    pricing: { minPrice: 399, maxPrice: 1999, minDiscount: 10, maxDiscount: 40 }
  },
  'Accessories': {
    tier: 'extended',
    brands: ['Fossil', 'Titan', 'Guess', 'GIVA'],
    categories: ['Bags', 'Jewellery', 'Watches', 'Eyewear'],
    pricing: { minPrice: 899, maxPrice: 6999, minDiscount: 20, maxDiscount: 50 }
  },
  'HomeLiving': {
    tier: 'extended',
    brands: ['Story@Home', 'Klotthe', 'Portico'],
    categories: ['Bedding', 'Decor', 'Lighting', 'Bath'],
    pricing: { minPrice: 799, maxPrice: 4599, minDiscount: 20, maxDiscount: 55 }
  }
};

// Map subcategory to garmentType
function resolveGarmentType(department, subcat) {
  if (['Beauty', 'Accessories', 'HomeLiving'].includes(department)) {
    return null;
  }
  const s = subcat.toLowerCase();
  if (s.includes('kurta set') || s.includes('kurta')) return 'kurta_set';
  if (s.includes('saree')) return 'saree';
  if (s.includes('dress') || s.includes('anarkali') || s.includes('lehenga') || s.includes('fusion')) return 'dress';
  if (s.includes('top')) return 'top';
  if (s.includes('jeans')) return 'jeans';
  if (s.includes('chinos') || s.includes('trousers') || s.includes('pants')) return 'pants';
  if (s.includes('shirt') && !s.includes('t-shirt')) return 'shirt';
  if (s.includes('t-shirt') || s.includes('hoodie')) return 'tshirt';
  if (s.includes('heels')) return 'heels';
  if (s.includes('sneakers') || s.includes('sports')) return 'sneakers';
  if (s.includes('flats') || s.includes('sandals')) return 'flats';
  if (s.includes('boots')) return 'boots';
  if (s.includes('formal shoes')) return 'formal_shoes';
  if (s.includes('jumpsuit')) return 'kidswear';
  return 'top';
}

// Map department & garment type to sizes per architecture.md §4
function resolveSizes(department, garmentType) {
  if (['Beauty', 'Accessories', 'HomeLiving'].includes(department)) {
    return undefined;
  }
  if (department === 'Footwear') {
    return ['6', '7', '8', '9', '10', '11'];
  }
  if (department === 'Kids') {
    return ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'];
  }
  return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
}

// Fabric or material description generator
function resolveMaterial(department, subcat) {
  const s = subcat.toLowerCase();
  if (department === 'Women') {
    if (s.includes('kurta') || s.includes('saree')) return '100% Chanderi Silk Blend';
    if (s.includes('jeans')) return 'Stretchable Denim Cotton';
    return 'Pure Breathable Cotton';
  }
  if (department === 'Men') {
    if (s.includes('shirt')) return '100% Premium Oxford Cotton';
    if (s.includes('jeans')) return 'Heavyweight Cotton Denim';
    return 'Soft Cotton Blend';
  }
  if (department === 'Kids') return 'Soft Organic Cotton';
  if (department === 'Footwear') {
    if (s.includes('boots') || s.includes('formal')) return 'Genuine Leather';
    if (s.includes('sneakers')) return 'Breathable Mesh & Rubber Sole';
    return 'Synthetic Leather';
  }
  if (department === 'Beauty') return 'Dermatologically Tested Formula';
  if (department === 'Accessories') {
    if (s.includes('watch') || s.includes('jewellery')) return 'Stainless Steel & Gold Plated';
    return 'Genuine Italian Leather';
  }
  if (department === 'HomeLiving') return '300 TC Microfiber Cotton';
  return 'Premium Fabric';
}

// Build specs matching Phase 1a
const SPECS = [];
function addSpecs(dept, count, subcategories, colors) {
  const prefixMap = { Women: 'w', Men: 'm', Kids: 'k', Footwear: 'f', Beauty: 'b', Accessories: 'a', HomeLiving: 'h' };
  const prefix = prefixMap[dept];
  for (let i = 1; i <= count; i++) {
    const subcat = subcategories[(i - 1) % subcategories.length];
    const color = colors[(i - 1) % colors.length];
    SPECS.push({
      id: `${prefix}${i}`,
      department: dept,
      subcategory: subcat,
      color: color
    });
  }
}

addSpecs('Women', 70, 
  ['kurta set', 'saree', 'ethnic dress', 'western dress', 'top', 'jeans', 'anarkali suit', 'fusion wear', 'lehenga choli', 'floral top'],
  ['Pink', 'Blue', 'Red', 'Yellow', 'Black', 'White', 'Green', 'Peach', 'Purple', 'Maroon']
);
addSpecs('Men', 60,
  ['casual shirt', 'formal shirt', 't-shirt', 'denim jeans', 'chinos', 'jacket', 'hoodie', 'printed shirt'],
  ['Black', 'Navy Blue', 'White', 'Grey', 'Olive Green', 'Beige', 'Maroon', 'Light Blue']
);
addSpecs('Kids', 50,
  ['boys t-shirt', 'boys shirt', 'boys jeans', 'girls dress', 'girls top', 'girls skirt', 'kids jumpsuit'],
  ['Yellow', 'Red', 'Blue', 'Pink', 'Green', 'White', 'Orange']
);
addSpecs('Footwear', 50,
  ['heels', 'running sneakers', 'casual flats', 'leather boots', 'formal shoes', 'sports shoes', 'sandals'],
  ['Black', 'Tan Brown', 'White', 'Beige', 'Red', 'Silver', 'Grey']
);
addSpecs('Beauty', 35,
  ['face serum', 'moisturizing cream', 'matte lipstick', 'perfume bottle', 'shampoo bottle', 'face wash', 'eye shadow palette'],
  ['Pink', 'Red', 'Clear', 'Gold', 'Nude', 'Rose']
);
addSpecs('Accessories', 35,
  ['leather handbag', 'tote bag', 'gold necklace', 'silver earrings', 'analog watch', 'sunglasses', 'leather belt'],
  ['Black', 'Brown', 'Gold', 'Silver', 'Rose Gold', 'Tan']
);
addSpecs('HomeLiving', 35,
  ['cotton bedsheet', 'cushion cover', 'table lamp', 'wall clock', 'bath towel', 'ceramic vase', 'scented candle'],
  ['White', 'Blue', 'Beige', 'Yellow', 'Grey', 'Green']
);

function generateCatalogue() {
  console.log('Generating Catalogue dataset (data/products.json)...');

  const products = SPECS.map((spec, idx) => {
    const deptInfo = DEPARTMENTS[spec.department];
    const brand = deptInfo.brands[idx % deptInfo.brands.length];
    const category = deptInfo.categories[idx % deptInfo.categories.length];
    const garmentType = resolveGarmentType(spec.department, spec.subcategory);
    const sizes = resolveSizes(spec.department, garmentType);
    const material = resolveMaterial(spec.department, spec.subcategory);

    // Title-case name matching image text fields exactly
    const formattedSubcat = spec.subcategory.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const name = `${spec.color} ${formattedSubcat}`;

    // Pricing & discount reconciliation
    // price between min and max
    const step = 100;
    const rawPrice = deptInfo.pricing.minPrice + ((idx * 17) % (deptInfo.pricing.maxPrice - deptInfo.pricing.minPrice));
    const price = Math.round(rawPrice / step) * step;
    
    // discount percentage
    const discount = deptInfo.pricing.minDiscount + ((idx * 7) % (deptInfo.pricing.maxDiscount - deptInfo.pricing.minDiscount));
    
    // Calculate sale price such that Math.round(((price - salePrice)/price)*100) === discount exactly!
    const salePrice = Math.round(price * (1 - discount / 100));

    // Rating between 3.8 and 4.7
    const rating = Number((3.8 + ((idx * 13) % 10) / 10).toFixed(1));
    const reviewCount = 45 + ((idx * 37) % 850);

    const product = {
      id: spec.id,
      department: spec.department,
      quickCheckTier: deptInfo.tier,
      brand: brand,
      name: name,
      category: category,
      subcategory: spec.subcategory,
      garmentType: garmentType,
      price: price,
      salePrice: salePrice,
      discount: discount,
      colorVariants: [
        { name: spec.color, image: `/products/${spec.id}.jpg` }
      ],
      sizes: sizes,
      rating: rating,
      reviewCount: reviewCount,
      image: `/products/${spec.id}.jpg`,
      fabricOrMaterial: material
    };

    return product;
  });

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Successfully generated ${products.length} products in data/products.json`);

  // Validate discount reconciliation math
  let reconcileErrors = 0;
  products.forEach(p => {
    const calcDiscount = Math.round(((p.price - p.salePrice) / p.price) * 100);
    if (calcDiscount !== p.discount) {
      console.error(`Discount mismatch for ${p.id}: declared ${p.discount}%, calculated ${calcDiscount}%`);
      reconcileErrors++;
    }
  });

  if (reconcileErrors === 0) {
    console.log('✓ All 335 products pass discount reconciliation math perfectly!');
  } else {
    console.error(`❌ ${reconcileErrors} products failed discount reconciliation.`);
    process.exit(1);
  }
}

generateCatalogue();
