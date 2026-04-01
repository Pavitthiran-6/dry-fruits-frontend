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
  categories: [
    { id: 1, name: 'Almonds', icon: '🥜', gradient: 'from-amber-700 to-amber-500' },
    { id: 2, name: 'Cashews', icon: '🌰', gradient: 'from-yellow-700 to-yellow-500' },
    { id: 3, name: 'Pistachios', icon: '🥜', gradient: 'from-green-500 to-green-300' },
    { id: 4, name: 'Walnuts', icon: '🌰', gradient: 'from-amber-800 to-amber-600' },
    { id: 5, name: 'Mixed Nuts', icon: '🎁', gradient: 'from-orange-500 to-amber-300' },
  ],
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  sortBy: 'featured',
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
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // Admin CRUD operations
    addProduct: (state, action) => {
      const newProduct = {
        ...action.payload,
        id: Date.now(), // Generate unique ID
        rating: 0,
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
      const newCategory = {
        id: Date.now(),
        name: action.payload,
        icon: '📁',
        gradient: 'from-purple-500 to-pink-500',
      };
      state.categories.push(newCategory);
    },
    updateCategory: (state, action) => {
      const { oldName, newName } = action.payload;
      const categoryIndex = state.categories.findIndex(c => c.name === oldName);
      if (categoryIndex !== -1) {
        state.categories[categoryIndex].name = newName;
      }
      // Also update products with the old category name
      state.products.forEach(p => {
        if (p.category === oldName) {
          p.category = newName;
        }
      });
      // Update featured products
      state.featuredProducts = state.products.slice(0, 6);
      saveProductsToStorage(state.products);
    },
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.name !== action.payload);
      // Update featured products after category deletion
      state.featuredProducts = state.products.slice(0, 6);
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
