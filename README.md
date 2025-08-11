# 🛍️ JumpStart Fashion - Modern E-commerce Platform

A professional e-commerce platform built with React, TypeScript, Supabase, and AI-powered recommendations.

## 🚀 Features

- **Modern UI/UX**: Built with React 18, TypeScript, and Tailwind CSS
- **AI-Powered Recommendations**: OpenAI integration for personalized product suggestions
- **Secure Authentication**: Supabase Auth with Row Level Security
- **Real-time Data**: Live updates with Supabase real-time subscriptions
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Mode**: Theme switching support
- **Shopping Cart**: Full cart functionality with local storage
- **Product Reviews**: User review and rating system
- **Search & Filter**: Advanced product filtering and search

## 🛠️ Technology Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript 5.8.3** - Type-safe development
- **Vite 5.4.19** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **React Router DOM** - Client-side routing
- **React Query** - Server state management

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with RLS security
- **Deno Edge Functions** - Serverless functions
- **OpenAI API** - AI recommendations

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** or **Bun**
- **Supabase CLI** (optional)

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd jumpstartfashion

# Install dependencies
npm install
# or using bun (recommended)
bun install

# Start development server
npm run dev
```

## 🗄️ Database Schema

### Core Tables
- **profiles** - User profile information
- **products** - Product catalog with categories
- **cart_items** - Shopping cart functionality
- **reviews** - Product reviews and ratings

### Security
- Row Level Security (RLS) enabled
- JWT-based authentication
- Protected API endpoints

## 🤖 AI Features

- **Smart Recommendations**: OpenAI-powered product suggestions
- **Personalization**: Based on user preferences and history
- **Category Filtering**: Intelligent product filtering

## 🎨 UI/UX

- **Responsive Design**: Mobile-first approach
- **Dark/Light Theme**: User preference support
- **Smooth Animations**: Tailwind CSS animations
- **Accessible Components**: ARIA-compliant UI

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Frontend | 🟢 Working | React app on port 8081 |
| Database | 🟢 Active | Supabase PostgreSQL |
| Authentication | 🟢 Ready | Supabase Auth with RLS |
| AI Function | 🟡 Ready | Needs deployment |
| UI Components | 🟢 Complete | Shadcn/ui integrated |
| Testing | � Complete | Vitest + Testing Library |
| Error Tracking | 🟢 Ready | Sentry integration |

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Type checking
npm run type-check

# Test coverage
npm run test:coverage
```

## 🚀 Production Deployment

### Quick Start Production Setup

1. **Add Sample Data**
   ```bash
   # Run the SQL script in Supabase Dashboard > SQL Editor
   # File: insert-sample-data-direct.sql
   ```

2. **Configure Environment**
   ```bash
   # Add your OpenAI API key to .env.local
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Deploy AI Function**
   - Go to Supabase Dashboard > Edge Functions
   - Create new function: `ai-recommendations`
   - Copy code from `supabase/functions/ai-recommendations/index.ts`

4. **Deploy Frontend**
   ```bash
   # Build for production
   npm run build
   
   # Deploy to Vercel
   vercel
   
   # Or deploy to Netlify
   # Upload dist/ folder
   ```

### Deployment Options
- **Vercel**: Recommended for React apps
- **Netlify**: Great for static sites
- **GitHub Pages**: Free hosting option

## 📋 Production Checklist

See `PRODUCTION_CHECKLIST.md` for detailed deployment steps and system health status.

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:ui      # Run tests with UI
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:seed      # Seed database with sample data
```
