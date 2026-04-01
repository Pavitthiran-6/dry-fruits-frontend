import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { validateAdminSession } from './store/slices/authSlice';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazy loading pages for performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const OTPVerification = lazy(() => import('./pages/OTPVerification'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const MyOrders = lazy(() => import('./pages/MyOrders'));
const Settings = lazy(() => import('./pages/Settings'));
const ProfileDashboard = lazy(() => import('./pages/ProfileDashboard'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AddEditProduct = lazy(() => import('./pages/admin/AddEditProduct'));
const AdminCategory = lazy(() => import('./pages/admin/AdminCategory'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

// Loading component
const LoadingSpinner = () => (
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 via-purple-50 to-orange-50">
    <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
  </div>
);

// Page wrapper with animation - slides from top
const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: -100 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -100 }}
    transition={{ duration: 0.4, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Admin Route Guard - wraps AdminLayout
const AdminRouteGuard = () => {
  const { isAdminAuthenticated, adminUser } = useSelector((state) => state.auth);

  // Check if admin user is authenticated
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout />;
};

// Wrapper component to use useLocation and scroll position
const AnimatedRoutes = () => {
  const location = useLocation();

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Restore scroll position when returning to home page
  useEffect(() => {
    if (location.pathname === '/') {
      const savedPosition = sessionStorage.getItem('scrollPosition');
      if (savedPosition) {
        setTimeout(() => {
          window.scrollTo({ top: parseInt(savedPosition, 10), behavior: 'smooth' });
        }, 100);
      }
    } else {
      // Save current scroll position when leaving home
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    }
  }, [location.pathname]);

  // Reset scroll position when navigating to other pages
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* User Routes - Using MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
          <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
          <Route path="/product/:id" element={<AnimatedPage><ProductDetails /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
          <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><SignUp /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPassword /></AnimatedPage>} />
          <Route path="/otp-verification" element={<AnimatedPage><OTPVerification /></AnimatedPage>} />
          <Route path="/reset-password" element={<AnimatedPage><ResetPassword /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><MyProfile /></AnimatedPage>} />
          <Route path="/profile-dashboard" element={<AnimatedPage><ProfileDashboard /></AnimatedPage>} />
          <Route path="/orders" element={<AnimatedPage><MyOrders /></AnimatedPage>} />
          <Route path="/settings" element={<AnimatedPage><Settings /></AnimatedPage>} />
        </Route>

        {/* Admin Login - Public route */}
        <Route path="/admin/login" element={<AnimatedPage><AdminLogin /></AnimatedPage>} />

        {/* Admin Routes - Using AdminLayout with protection */}
        <Route path="/admin" element={<AdminRouteGuard />}>
          <Route path="dashboard" element={<AnimatedPage><AdminDashboard /></AnimatedPage>} />
          <Route path="orders" element={<AnimatedPage><AdminOrders /></AnimatedPage>} />
          <Route path="customers" element={<AnimatedPage><AdminCustomers /></AnimatedPage>} />
          <Route path="inventory" element={<AnimatedPage><AdminInventory /></AnimatedPage>} />
          <Route path="category" element={<AnimatedPage><AdminCategory /></AnimatedPage>} />
          <Route path="settings" element={<AnimatedPage><AdminSettings /></AnimatedPage>} />
          <Route path="add-product" element={<AnimatedPage><AddEditProduct /></AnimatedPage>} />
          <Route path="edit-product/:id" element={<AnimatedPage><AddEditProduct /></AnimatedPage>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const dispatch = useDispatch();

  // Validate admin session on app load
  useEffect(() => {
    dispatch(validateAdminSession());
  }, [dispatch]);

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <AnimatedRoutes />
      </Suspense>
    </Router>
  );
}

export default App;
