# full-app-builder Skill

This skill enables agents to autonomously design and generate full-stack, production-ready applications using React (Vite + Tailwind) and Supabase (PostgreSQL + Auth + Storage) based on structured product requirements.

## Overview

The full-app-builder skill provides capabilities for:
- Translating product requirements into technical specifications
- Generating complete full-stack applications with React frontend and Supabase backend
- Setting up development environments and build configurations
- Implementing authentication, authorization, and data storage solutions
- Creating responsive, accessible user interfaces
- Establishing proper development workflows and deployment configurations

## Usage

When an agent with this skill is tasked with building a full-stack application, it will:
1. Analyze structured product requirements
2. Design the application architecture
3. Set up the React/Vite project with Tailwind CSS
4. Configure Supabase project with PostgreSQL database
5. Implement authentication flows using Supabase Auth
6. Design database schemas and relationships
7. Create Supabase storage buckets for file handling (if needed)
8. Implement CRUD operations for entities
9. Build responsive UI components following Tailwind conventions
10. Set up state management (if needed)
11. Implement error handling and loading states
12. Add form validation and user feedback
13. Configure environment variables and secrets
14. Set up build and deployment scripts
15. Create basic documentation and README
16. Initialize git repository with appropriate .gitignore

## Configuration

No special configuration is required for this skill. It works out of the box with the standard tools provided.

## Technology Stack

### Frontend
- React 18+ with Vite for fast development builds
- Tailwind CSS for utility-first styling
- React Router for client-side routing (if applicable)
- Headless UI or similar for accessible components (if applicable)

### Backend & Infrastructure
- Supabase as backend-as-a-service
- PostgreSQL for relational data storage
- Supabase Auth for authentication (email/password, OAuth, magic links)
- Supabase Storage for file uploads/downloads
- Supabase Edge Functions for custom backend logic (if needed)
- Supabase Realtime for live updates (if applicable)

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- Vitest for unit testing (if applicable)
- Cypress or Playwright for end-to-end testing (if applicable)
- Git for version control

## Best Practices

- Follow React hooks rules and best practices
- Use Supabase client-side libraries appropriately
- Implement proper error boundaries
- Handle loading and empty states gracefully
- Optimize database queries with proper indexing
- Implement Row Level Security (RLS) policies for data protection
- Use environment variables for configuration secrets
- Follow accessibility guidelines (WCAG)
- Ensure responsive design for mobile devices
- Keep bundle size optimized
- Implement proper logging and monitoring hooks
- Follow security best practices for authentication flows