# Dry Fruits E-Commerce Store

A modern, responsive e-commerce website for premium dry fruits built with React, Redux Toolkit, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19.2.4-blue)
![Vite](https://img.shields.io/badge/Vite-8.0.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38bdf8)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764abc)

## 🌟 Features

### Customer Features
- **Product Catalog** - Browse premium dry fruits with categories (Almonds, Cashews, Pistachios, Walnuts, Raisins, Mixed Nuts, Dried Fruits)
- **Product Details** - Detailed product pages with ratings, reviews, calories, and allergen information
- **Shopping Cart** - Add/remove items, update quantities
- **Wishlist** - Save favorite products for later
- **User Authentication** - Login, Sign Up, Forgot Password, OTP Verification, Reset Password
- **User Profile** - Manage profile information
- **Order History** - View past orders
- **Checkout Process** - Complete purchase flow
- **Search & Filter** - Find products easily

### Admin Features
- **Admin Dashboard** - Overview of store performance
- **Product Management** - Add, edit, delete products
- **Category Management** - Manage product categories
- **Inventory Management** - Track stock levels
- **Order Management** - View and manage customer orders
- **Customer Management** - View customer information
- **Settings** - Configure store settings

## 🛠️ Tech Stack

| Technology | Version | Description |
|------------|---------|-------------|
| React | 19.2.4 | UI framework |
| Vite | 8.0.0 | Build tool |
| Redux Toolkit | 2.11.2 | State management |
| React Router DOM | 7.13.1 | Navigation |
| Tailwind CSS | 3.4.19 | Styling |
| Framer Motion | 12.36.0 | Animations |
| Swiper | 12.1.2 | Carousels/Sliders |
| React Icons | 5.6.0 | Icon library |

## 📁 Project Structure

```
dry-fruits-store/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Toast.jsx
│   ├── data/
│   │   └── products.js
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── MainLayout.jsx
│   ├── pages/
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MyOrders.jsx
│   │   ├── MyProfile.jsx
│   │   ├── OTPVerification.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Products.jsx
│   │   ├── ProfileDashboard.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Settings.jsx
│   │   ├── SignUp.jsx
│   │   ├── Wishlist.jsx
│   │   └── admin/
│   │       ├── AddEditProduct.jsx
│   │       ├── AdminCategory.jsx
│   │       ├── AdminCustomers.jsx
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminInventory.jsx
│   │       ├── AdminLogin.jsx
│   │       ├── AdminOrders.jsx
│   │       └── AdminSettings.jsx
│   ├── store/
│   │   ├── index.js
│   │   └── slices/
│   │       ├── authSlice.js
│   │       ├── cartSlice.js
│   │       ├── ordersSlice.js
│   │       ├── productsSlice.js
│   │       └── wishlistSlice.js
│   ├── utils/
│   │   └── jwt.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd dry-fruits-store
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎨 Design Highlights

- **Responsive Design** - Mobile-first approach with breakpoints for all devices
- **Modern UI** - Clean and elegant interface with smooth animations
- **Color Scheme** - Warm earthy tones reflecting premium dry fruits
- **Typography** - Clean, readable fonts for better user experience
- **Animations** - Smooth page transitions and micro-interactions using Framer Motion

## 📱 Available Routes

### Customer Routes
| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/products` | All products |
| `/products/:id` | Product details |
| `/cart` | Shopping cart |
| `/wishlist` | Wishlist |
| `/checkout` | Checkout page |
| `/login` | Login |
| `/signup` | Sign up |
| `/forgot-password` | Forgot password |
| `/otp-verification` | OTP verification |
| `/reset-password` | Reset password |
| `/profile` | User profile |
| `/my-orders` | Order history |
| `/settings` | User settings |

### Admin Routes
| Route | Description |
|-------|-------------|
| `/admin` | Admin dashboard |
| `/admin/login` | Admin login |
| `/admin/orders` | Manage orders |
| `/admin/customers` | Manage customers |
| `/admin/inventory` | Inventory management |
| `/admin/settings` | Store settings |
| `/admin/products` | Product management |
| `/admin/products/add` | Add product |
| `/admin/products/edit/:id` | Edit product |
| `/admin/categories` | Category management |

## 🔧 State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice** - User authentication state
- **cartSlice** - Shopping cart items
- **wishlistSlice** - Wishlist items
- **productsSlice** - Products data
- **ordersSlice** - Order history

## 📦 Product Categories

- **Almonds** - Premium California Almonds, Roasted Salted Almonds
- **Cashews** - Royal Cashew Premium
- **Pistachios** - Iranian Pistachios, Afghani Pistachios
- **Walnuts** - American Walnuts
- **Raisins** - Golden Raisins, Black Raisins
- **Mixed Nuts** - Deluxe Mixed Nuts
- **Dried Fruits** - Premium Apricots, Dried Cranberries, Premium Fig Dried

## 🔐 Authentication

The application includes:
- JWT-based authentication
- Protected routes for user and admin areas
- Session validation
- Password reset flow with OTP verification

## 🖼️ Screenshots

The application features:
- Hero section with featured products
- Product grid with filtering options
- Product detail pages with ratings
- Shopping cart with quantity controls
- User profile dashboard
- Admin dashboard with analytics

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ using React and modern web technologies.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

</div>
