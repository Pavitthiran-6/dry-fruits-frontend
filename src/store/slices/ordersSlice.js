import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Load orders from localStorage
const loadOrdersFromStorage = () => {
  try {
    const storedOrders = localStorage.getItem('userOrders');
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};

// Save orders to localStorage
const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem('userOrders', JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState }) => {
    // Get current user from state
    const state = getState();
    const user = state.auth.user;

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `ORD-${Date.now()}`,
          userId: user?.email || 'guest',
          userName: user?.name || 'Guest',
          ...orderData,
          status: 'Processing',
          createdAt: new Date().toISOString(),
          date: new Date().toLocaleDateString('en-GB'),
        });
      }, 1000);
    });
  }
);

const initialState = {
  orders: loadOrdersFromStorage(),
  currentOrder: null,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
        // Save to localStorage
        saveOrdersToStorage(state.orders);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCurrentOrder, clearCurrentOrder } = ordersSlice.actions;

export default ordersSlice.reducer;
