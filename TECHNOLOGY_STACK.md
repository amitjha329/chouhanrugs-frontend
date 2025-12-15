# Technology Stack - Chouhan Rugs E-commerce Platform

This document provides a comprehensive overview of all technologies, frameworks, libraries, and tools used in the Chouhan Rugs e-commerce platform.

## Table of Contents
- [Core Framework & Runtime](#core-framework--runtime)
- [Frontend Technologies](#frontend-technologies)
- [Backend Technologies](#backend-technologies)
- [Database & Storage](#database--storage)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Processing](#payment-processing)
- [Search & Analytics](#search--analytics)
- [Styling & UI Components](#styling--ui-components)
- [Development Tools & Configuration](#development-tools--configuration)
- [Deployment & Build Tools](#deployment--build-tools)
- [Email & Communication](#email--communication)
- [Security & Performance](#security--performance)
- [Type Safety & Code Quality](#type-safety--code-quality)

---

## Core Framework & Runtime

### **Next.js 15.3.4**
- **Purpose**: React-based full-stack framework
- **Features Used**:
  - App Router with server components
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes for backend functionality
  - Image optimization
  - Built-in performance optimizations
  - Turbopack for faster development builds

### **React 19.1.0**
- **Purpose**: Frontend library for building user interfaces
- **Features Used**:
  - Functional components with hooks
  - Server components
  - Concurrent features
  - Suspense for code splitting

### **Node.js**
- **Purpose**: JavaScript runtime for server-side operations
- **Usage**: API routes, server actions, middleware

---

## Frontend Technologies

### **React DOM 19.1.0**
- **Purpose**: React renderer for web applications
- **Usage**: Component rendering and DOM manipulation

### **React Icons 5.5.0**
- **Purpose**: Icon library
- **Usage**: Consistent iconography throughout the application

### **React Multi Carousel 2.8.6**
- **Purpose**: Responsive carousel component
- **Usage**: Product image galleries, featured products display

### **React Aria Components 1.9.0**
- **Purpose**: Accessible UI primitives
- **Usage**: Building accessible form components and interactions

### **Headless UI 2.2.4**
- **Purpose**: Unstyled, accessible UI components
- **Usage**: Modal dialogs, dropdowns, radio groups, transitions

---

## Backend Technologies

### **MongoDB 6.16.0**
- **Purpose**: NoSQL database
- **Usage**: 
  - Product catalog management
  - User data storage
  - Order management
  - Session storage
  - Cart data persistence

### **MongoDB Adapter (@auth/mongodb-adapter 3.9.1)**
- **Purpose**: NextAuth.js integration with MongoDB
- **Usage**: User authentication data management

### **Server Actions**
- **Purpose**: Server-side functions callable from client components
- **Usage**: Database operations, payment processing, email sending

---

## Database & Storage

### **Client Promise**
- **Purpose**: MongoDB connection management
- **Features**:
  - Connection pooling
  - Environment-based configuration
  - Global connection caching in development

### **Data Models**
Comprehensive TypeScript interfaces for:
- Product data
- User profiles
- Order management
- Cart items
- Categories
- Shipping information
- Payment gateway configurations

---

## Authentication & Authorization

### **NextAuth.js 5.0.0-beta.25**
- **Purpose**: Authentication library for Next.js
- **Features**:
  - JWT sessions
  - OAuth providers (Google)
  - Custom credential provider
  - WebAuthn support
  - Custom authentication adapter

### **Google OAuth**
- **Purpose**: Social authentication
- **Configuration**: Client ID/Secret based authentication

### **Custom Authentication**
- **Purpose**: Email/OTP based authentication
- **Features**: Token-based verification system

### **JOSE 6.0.11**
- **Purpose**: JSON Web Token utilities
- **Usage**: JWT token handling and verification

---

## Payment Processing

### **Stripe Integration**
- **Libraries**: 
  - `@stripe/stripe-js 7.3.1`
  - `@stripe/react-stripe-js 3.7.0`
  - `stripe 18.2.0`
- **Features**:
  - Payment intents
  - Card processing
  - Multi-currency support
  - Secure payment forms

### **Razorpay Integration**
- **Library**: `razorpay 2.9.6`
- **Features**:
  - Indian payment processing
  - UPI, cards, net banking support
  - Order creation and verification
  - Webhook handling

### **PayPal Integration**
- **Libraries**:
  - `@paypal/paypal-js 8.2.0`
  - `@paypal/react-paypal-js 8.8.3`
- **Features**:
  - PayPal buttons
  - Order creation and capture
  - Client token generation

---

## Search & Analytics

### **Algolia Search**
- **Libraries**:
  - `algoliasearch 5.25.0`
  - `instantsearch.js 4.78.3`
  - `react-instantsearch 7.15.8`
  - `react-instantsearch-core 7.15.8`
- **Features**:
  - Product search
  - Autocomplete functionality
  - Search suggestions
  - Query suggestions
  - Recent searches
  - Faceted search

### **Algolia Autocomplete**
- **Libraries**: Multiple autocomplete packages
- **Features**:
  - Real-time search suggestions
  - Recent searches
  - Query suggestions

---

## Styling & UI Components

### **Tailwind CSS 3.4.17**
- **Purpose**: Utility-first CSS framework
- **Configuration**: Custom theme with brand colors
- **Features**:
  - Responsive design
  - Custom color palette
  - Component variants

### **DaisyUI 4.12.24**
- **Purpose**: Tailwind CSS component library
- **Features**:
  - Pre-built components
  - Custom theme configuration
  - Consistent design system

### **Fluid Tailwind 1.0.4**
- **Purpose**: Fluid typography and spacing
- **Usage**: Responsive text sizing and spacing

### **Sass 1.89.0**
- **Purpose**: CSS preprocessor
- **Usage**: Advanced styling capabilities, variables, mixins

### **PostCSS & Autoprefixer**
- **Purpose**: CSS post-processing
- **Features**: 
  - Vendor prefixing
  - CSS optimization

---

## Development Tools & Configuration

### **TypeScript 5.8.3**
- **Purpose**: Type-safe JavaScript
- **Configuration**: Strict type checking, path mapping
- **Features**: 
  - Strong typing
  - IntelliSense support
  - Compile-time error checking

### **ESLint 9.27.0**
- **Purpose**: Code linting and formatting
- **Configuration**: Next.js recommended rules

### **PNPM**
- **Purpose**: Package manager
- **Features**: 
  - Efficient disk space usage
  - Fast installations
  - Strict dependency management

---

## Deployment & Build Tools

### **Sharp 0.34.2**
- **Purpose**: Image processing
- **Usage**: Image optimization and resizing

### **Turbopack**
- **Purpose**: Next.js build tool
- **Features**: Fast development builds and optimizations

### **Webpack Configuration**
- **Purpose**: Custom build configuration
- **Features**: Canvas externals, Handlebars aliases

---

## Email & Communication

### **Nodemailer 6.10.1**
- **Purpose**: Email sending functionality
- **Features**: SMTP configuration, template support

### **Handlebars Templates**
- **Libraries**: 
  - `nodemailer-express-handlebars 7.0.0`
  - Custom handlebars configuration
- **Usage**: Email template rendering

### **Pug 3.0.3**
- **Purpose**: Template engine
- **Usage**: Email template rendering

---

## Security & Performance

### **Content Security Policy (CSP)**
- **Implementation**: Comprehensive CSP headers
- **Features**: 
  - Script source restrictions
  - Frame protection
  - XSS prevention

### **Security Headers**
- **Headers Implemented**:
  - X-Frame-Options: SAMEORIGIN
  - X-Content-Type-Options: nosniff
  - X-DNS-Prefetch-Control: on
  - Referrer-Policy: origin-when-cross-origin
  - Permissions-Policy: geolocation=()

### **Image Security**
- **Configuration**: Remote pattern restrictions
- **Allowed Domains**: Specific trusted domains only

---

## Type Safety & Code Quality

### **Type Definitions**
Comprehensive TypeScript interfaces for:
- Product models
- User data structures
- Order management
- Payment processing
- API responses
- Database schemas

### **Global Type Definitions**
- **File**: `global.d.ts`
- **Purpose**: Global type declarations and augmentations

---

## Package Manager Configuration

### **PNPM Configuration**
- **Built Dependencies**: Specific packages for optimization
- **Shameful Hoisting**: Disabled for strict dependency management

### **Type Overrides**
- **React Types**: Using release candidate versions for latest features
- **Purpose**: Ensuring compatibility with React 19 features

---

## Environment Configuration

### **Environment Variables**
- MongoDB connection strings
- Payment gateway credentials
- Email service configuration
- Algolia search credentials
- OAuth client credentials

### **Multi-Environment Support**
- Development environment optimizations
- Production security enhancements
- Staging environment configurations

---

## Additional Utilities

### **Utility Libraries**
- **clsx 2.1.1**: Conditional CSS class names
- **convert 5.12.0**: Unit conversions
- **node-fpe 2.0.4**: Format-preserving encryption
- **react-select-country-list 2.2.3**: Country selection components

### **Build Optimizations**
- **Memory Optimizations**: Webpack memory optimization flags
- **Bundle Analysis**: Package size optimization
- **Tree Shaking**: Unused code elimination

---

## Summary

This e-commerce platform leverages a modern, scalable technology stack built around Next.js 15 and React 19, with a strong emphasis on:

- **Performance**: Server-side rendering, image optimization, and efficient bundling
- **Type Safety**: Comprehensive TypeScript implementation
- **User Experience**: Responsive design, fast search, and smooth interactions
- **Security**: Content Security Policy, secure authentication, and data protection
- **Scalability**: Modular architecture, efficient database operations, and optimized builds
- **Payment Processing**: Multiple payment gateways for global commerce
- **Search & Discovery**: Advanced search capabilities with Algolia
- **Developer Experience**: Modern tooling, strict linting, and comprehensive type checking

The stack is designed to handle enterprise-level e-commerce requirements while maintaining developer productivity and code quality.
