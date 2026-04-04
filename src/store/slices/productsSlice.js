import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { products as productData } from '../../data/products';

// Load products from localStorage or use default data
const loadProductsFromStorage = () => {
  const stored = localStorage.getItem('admin_products');
  if (stored) {
    return JSON.parse(stored);
  }
  return productData;
};

// Save products to localStorage
const saveProductsToStorage = (products) => {
  localStorage.setItem('admin_products', JSON.stringify(products));
};

// Default categories with placeholder images
const DEFAULT_CATEGORIES = [
  { id: 'almonds', name: 'Almonds', icon: '🥜', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&h=500&fit=crop', gradient: 'from-amber-600 to-orange-600' },
  { id: 'cashews', name: 'Cashews', icon: '🌰', image: 'https://images.unsplash.com/photo-1558231332-9cbdd5174ea8?w=500&h=500&fit=crop', gradient: 'from-amber-600 to-orange-600' },
  { id: 'pistachios', name: 'Pistachios', icon: '🫘', image: 'https://images.unsplash.com/photo-1543233630-10499d63c480?w=500&h=500&fit=crop', gradient: 'from-amber-600 to-orange-600' },
  { id: 'walnuts', name: 'Walnuts', icon: '🍂', image: 'https://images.unsplash.com/photo-1589667820091-5df63adcc97a?w=500&h=500&fit=crop', gradient: 'from-amber-600 to-orange-600' },
  { id: 'mixed-nuts', name: 'Mixed Nuts', icon: '🍇', image: 'https://images.unsplash.com/photo-1623428454614-abaf00244e52?w=500&h=500&fit=crop', gradient: 'from-amber-600 to-orange-600' },
];

const loadCategoriesFromStorage = () => {
  const stored = localStorage.getItem('dry_fruits_categories');
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_CATEGORIES;
};

const saveCategoriesToStorage = (categories) => {
  localStorage.setItem('dry_fruits_categories', JSON.stringify(categories));
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => resolve(loadProductsFromStorage()), 500);
    });
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  categories: loadCategoriesFromStorage(),
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
  minPrice: 0,
  maxPrice: 1000,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setPriceRange: (state, action) => {
      const { min, max } = action.payload;
      state.minPrice = min;
      state.maxPrice = max;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // Admin CRUD operations
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: Date.now(), // Generate unique ID
        rating: 4.5,
        reviews: 0,
        isFeatured: false,
      };
      state.products.push(newProduct);
      // Update featured products
      state.featuredProducts = state.products.slice(0, 6);
      saveProductsToStorage(state.products);
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload };
        // Update featured products
        state.featuredProducts = state.products.slice(0, 6);
        saveProductsToStorage(state.products);
      }
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      // Update featured products
      state.featuredProducts = state.products.slice(0, 6);
      saveProductsToStorage(state.products);
    },
    addCategory: (state, action) => {
      const { name, image } = action.payload;
      const newCategory = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        image: image || '',
        icon: '📁',
        gradient: 'from-amber-600 to-orange-600',
      };
      // Prevent duplicate IDs
      if (!state.categories.find(c => c.id === newCategory.id)) {
        state.categories.push(newCategory);
        saveCategoriesToStorage(state.categories);
      }
    },
    updateCategory: (state, action) => {
      const { id, name, image } = action.payload;
      const categoryIndex = state.categories.findIndex(c => c.id === id);
      if (categoryIndex !== -1) {
        const oldName = state.categories[categoryIndex].name;
        state.categories[categoryIndex].name = name;
        if (image) state.categories[categoryIndex].image = image;
        
        // Also update products with the old category name to the new name
        state.products.forEach(p => {
          if (p.category === oldName) {
            p.category = name;
          }
        });
        saveProductsToStorage(state.products);
        saveCategoriesToStorage(state.categories);
      }
    },
    deleteCategory: (state, action) => {
      const id = action.payload;
      state.categories = state.categories.filter(c => c.id !== id);
      saveCategoriesToStorage(state.categories);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.featuredProducts = action.payload.slice(0, 6);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setPriceRange,
  setSortBy,
  addProduct,
  updateProduct,
  deleteProduct,
  addCategory,
  updateCategory,
  deleteCategory
} = productsSlice.actions;

// Selectors
export const selectFilteredProducts = (state) => {
  let filtered = [...state.products.products];

  // Filter by category
  if (state.products.selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === state.products.selectedCategory);
  }

  // Filter by search
  if (state.products.searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(state.products.searchQuery.toLowerCase())
    );
  }

  // Filter by price
  filtered = filtered.filter(p => 
    p.price >= state.products.minPrice && p.price <= state.products.maxPrice
  );

  // Sort
  switch (state.products.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return filtered;
};

export default productsSlice.reducer;
