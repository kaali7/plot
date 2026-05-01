# Code Quality Rules

## TypeScript Usage
1. Use strict TypeScript settings as defined in `tsconfig.json`
2. Prefer interfaces for object shapes, types for unions/intersections
3. Avoid `any` type; use `unknown` when type is truly uncertain
4. Enable `noImplicitAny`, `strictNullChecks`, and `strictFunctionTypes`
5. Use JSDoc comments for complex functions and exported APIs

## React Best Practices
1. Use functional components with hooks; avoid class components
2. Extract complex logic into custom hooks
3. Use React.memo() for performance optimization when beneficial
4. Split large components into smaller, focused components
5. Use proper key props for dynamic lists
6. Handle loading and error states in data-fetching components

## Styling Guidelines
1. Use Tailwind CSS utility classes for styling
2. Follow the existing color palette from Dark Purple System
3. Maintain consistent spacing using Tailwind's spacing scale
4. Use responsive prefixes (sm:, md:, lg:, xl:) for adaptive design
5. Extract repeated utility classes into @apply directives only when necessary
6. Ensure proper color contrast for accessibility

## Naming Conventions
1. Components: PascalCase (e.g., `UnifiedStoryOverview`)
2. Functions and variables: camelCase (e.g., `saveOverviewData`)
3. Constants: UPPER_SNAKE_CASE (e.g., `MAX_CHARACTER_LIMIT`)
4. Files: PascalCase for components (e.g., `UnifiedStoryOverview.tsx`), camelCase for utilities (e.g., `characterUtils.ts`)
5. Events: camelCase with prefix (e.g., `onOverviewChange`, `onSaveClick`)
6. Boolean variables: Start with `is`, `has`, `can`, `should` (e.g., `isEditing`, `hasUnsavedChanges`)

## Error Handling
1. Handle Supabase operation errors with try/catch or error boundaries
2. Display user-friendly error messages; log technical details for debugging
3. Validate form inputs before submission
4. Use TypeScript to prevent null/undefined errors where possible
5. Implement retry logic for transient network failures when appropriate

## Performance Considerations
1. Lazy-load routes and non-critical components
2. Optimize image sizes and use appropriate formats
3. Minimize re-renders by using useMemo and useCallback appropriately
4. Virtualize long lists (when implementing)
5. Debounce expensive operations (search, auto-save)
6. Monitor bundle size and avoid large dependencies

## Security Practices
1. Never expose Supabase service role key in client-side code
2. Validate and sanitize user input before storing in database
3. Use Supabase row-level security (RLS) for data protection
4. Implement proper authentication checks for protected routes
5. Escape dynamic content to prevent XSS when using dangerouslySetInnerHTML
6. Use HTTPS in production; ensure environment variables are not committed

## Code Organization
1. Group related imports: React, third-party, internal
2. Alphabetize imports within each group
3. Keep files focused and under reasonable size (aim for <300 lines)
4. Export only what needs to be public; use default exports sparingly
5. Use barrel exports (index.ts) judiciously to avoid circular dependencies
6. Place constants and enums near where they're used or in dedicated files

## Commenting and Documentation
1. Write self-documenting code; use comments for why, not what
2. Document complex algorithms or non-obvious business logic
3. Use TODO comments with GitHub usernames for tracking: `TODO: @username - explanation`
4. Remove commented-out code; use version control for history
5. Document public APIs with JSDoc/TSDoc
6. Keep README files updated with setup and usage instructions