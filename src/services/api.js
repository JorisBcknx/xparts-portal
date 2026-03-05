// SAP Commerce OCC API Configuration
export const API_CONFIG = {
  baseUrl: 'https://chemical.volvomack.demo.hybris.com',
  baseSite: 'chemical',
  occVersion: 'v2',
  language: 'en',
  currency: 'USD',

  // Constructed endpoints
  get apiBase() {
    return `${this.baseUrl}/occ/${this.occVersion}/${this.baseSite}`;
  },

  get searchEndpoint() {
    return `${this.apiBase}/products/search`;
  },

  get productEndpoint() {
    return `${this.apiBase}/products`;
  }
};

// API Service Functions
export const searchProducts = async (query, options = {}) => {
  try {
    const params = new URLSearchParams({
      query: query,
      fields: options.fields || 'FULL',
      currentPage: options.page || 0,
      pageSize: options.pageSize || 20,
      lang: API_CONFIG.language,
      curr: API_CONFIG.currency
    });

    const response = await fetch(`${API_CONFIG.searchEndpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      products: data.products || [],
      pagination: data.pagination || {},
      facets: data.facets || [],
      breadcrumbs: data.breadcrumbs || [],
      total: data.pagination?.totalResults || 0
    };
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
};

export const getProductByCode = async (code) => {
  try {
    const response = await fetch(
      `${API_CONFIG.productEndpoint}/${code}?fields=FULL&lang=${API_CONFIG.language}&curr=${API_CONFIG.currency}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Product API Error:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryCode, options = {}) => {
  try {
    const params = new URLSearchParams({
      query: `:relevance:category:${categoryCode}`,
      fields: options.fields || 'FULL',
      currentPage: options.page || 0,
      pageSize: options.pageSize || 20,
      lang: API_CONFIG.language,
      curr: API_CONFIG.currency
    });

    const response = await fetch(`${API_CONFIG.searchEndpoint}?${params}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Category API Error:', error);
    throw error;
  }
};

// Get related/complementary products
export const getRelatedProducts = async (productCode) => {
  try {
    const response = await fetch(
      `${API_CONFIG.productEndpoint}/${productCode}?fields=FULL&lang=${API_CONFIG.language}&curr=${API_CONFIG.currency}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.productReferences || [];
  } catch (error) {
    console.error('Related Products API Error:', error);
    return [];
  }
};

// Get random products from a category for "You might also need"
export const getSuggestedProducts = async (count = 6) => {
  try {
    const response = await searchProducts('', {
      pageSize: 20,
      fields: 'BASIC'
    });

    // Shuffle and return limited count
    const shuffled = response.products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  } catch (error) {
    console.error('Suggested Products API Error:', error);
    return [];
  }
};

// Transform OCC product format to internal format
export const transformOCCProduct = (occProduct) => {
  return {
    code: occProduct.code,
    name: occProduct.name?.replace(/<[^>]*>/g, '') || '', // Remove HTML tags
    description: occProduct.description || '',
    categories: occProduct.categories?.map(cat => cat.name).join(', ') || 'Uncategorized',
    price: {
      value: occProduct.price?.value || 0,
      formattedValue: occProduct.price?.formattedValue || '$0.00'
    },
    priceFormatted: occProduct.price?.formattedValue || '$0.00',
    stock: occProduct.stock?.stockLevel || 0,
    stockStatus: occProduct.stock?.stockLevelStatus || 'outOfStock',
    image: occProduct.images?.[0]?.url
      ? `${API_CONFIG.baseUrl}${occProduct.images[0].url}`
      : '/assets/products/placeholder.jpg',
    url: occProduct.url || '',
    purchasable: occProduct.purchasable !== false,
    manufacturer: 'Mack Trucks', // From category context
    unit: occProduct.sapUnit?.name || 'unit'
  };
};

const api = {
  API_CONFIG,
  searchProducts,
  getProductByCode,
  getProductsByCategory,
  getRelatedProducts,
  getSuggestedProducts,
  transformOCCProduct
};

export default api;
