# SatyaCheck - Fact Verification Platform

## Overview
SatyaCheck is a fact verification platform built with React, TypeScript, and Vite. The frontend uses Shadcn UI components with Tailwind CSS styling. The project was imported from Lovable.

## Project Structure
- `src/` - React frontend source code
  - `components/` - Reusable UI components
  - `contexts/` - React context providers
  - `hooks/` - Custom React hooks
  - `lib/` - Utility functions
  - `pages/` - Page components
  - `services/` - API services
- `backend/` - Python Django backend (not currently configured for Replit)
- `public/` - Static assets

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI**: Shadcn UI, Radix UI primitives, Tailwind CSS
- **State**: TanStack React Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation

## Running the Project
The project runs via `npm run dev` which starts the Vite development server on port 5000.

## Recent Changes
- 2026-01-04: Imported from Lovable to Replit
- Updated Vite config to use port 5000 with allowed hosts for Replit proxy
