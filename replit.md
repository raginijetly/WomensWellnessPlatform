# HerFitness - Women's Fitness Platform

## Overview

HerFitness is a comprehensive women's fitness platform that provides personalized fitness, nutrition, and wellness guidance tailored to women's unique physiological needs and menstrual cycles. The application combines cycle tracking with customized workout and nutrition recommendations, creating a holistic approach to women's health and fitness.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Authentication**: Passport.js with local strategy and session-based auth
- **Session Storage**: Memory store (development) with PostgreSQL session store capability
- **Password Security**: Node.js crypto module with scrypt hashing

### Database Layer
- **Primary Database**: PostgreSQL (configured via Neon serverless)
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless with WebSocket support

## Key Components

### Authentication System
- Session-based authentication using Passport.js
- Password hashing with salt using Node.js scrypt
- Protected routes with automatic redirects
- User registration with email validation
- Onboarding flow for new users

### User Onboarding
- Multi-step onboarding process collecting:
  - Age and personal information
  - Menstrual cycle data and regularity
  - Fitness level and goals
  - Health conditions and symptoms
  - Dietary preferences and restrictions
  - Life stage information

### Cycle Tracking
- Menstrual cycle phase calculation
- Progress tracking with visual indicators
- Symptom logging with rich UI components
- Historical data visualization
- Cycle-based recommendations

### Feature Modules
- **Symptoms Logging**: Comprehensive symptom tracking with calendar integration
- **Workout Recommendations**: Cycle-phase appropriate fitness routines (placeholder)
- **Nutrition Guidance**: Personalized meal plans and dietary advice (placeholder)
- **Information Hub**: Educational content and articles (placeholder)

## Data Flow

### User Authentication Flow
1. User registers/logs in via auth pages
2. Passport.js validates credentials and creates session
3. Protected routes check authentication status
4. Unauthenticated users redirected to login
5. New users directed to onboarding flow

### Onboarding Data Flow
1. Multi-step form collects user health data
2. Form validation using Zod schemas
3. Data submitted to backend for storage
4. User profile marked as onboarded
5. Redirect to main application

### Application State Management
1. TanStack Query manages server state
2. React Hook Form handles form state
3. React Context provides authentication state
4. Local storage for client-side preferences

## External Dependencies

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESLint/Prettier**: Code formatting and linting (implicit)

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

### Backend Dependencies
- **Express.js**: Web application framework
- **Passport.js**: Authentication middleware
- **Express-session**: Session management
- **Connect-pg-simple**: PostgreSQL session store

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database ORM
- **WebSocket**: Real-time database connections

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite dev server with HMR

### Production Build
1. `npm run build`: Compiles client with Vite and server with esbuild
2. Static assets served from `dist/public`
3. Server bundle in `dist/index.js`
4. Environment variables for database connection

### Replit Configuration
- Autoscale deployment target
- Parallel workflow execution
- Runtime error overlay for development
- Cartographer integration for debugging

## Changelog
```
Changelog:
- June 14, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```