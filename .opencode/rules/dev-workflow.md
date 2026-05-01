# Development Workflow Rules

## General Principles
1. All source code modifications must be made in the `plot-app\` directory
2. Database operations must use Supabase with environment variables from `.env`
3. UI implementation must follow the Dark Purple System design guidelines
4. All changes must maintain backward compatibility where specified

## Package Management
1. Install new dependencies using `npm install <package>` in `plot-app\` directory
2. Save exact versions with `npm install --save-exact <package>` for production dependencies
3. Development dependencies should use `npm install --save-dev <package>`
4. Regularly audit dependencies with `npm audit` and update when safe

## Build Process
1. Development server: `npm run dev` (executed in `plot-app\`)
2. Production build: `npm run build` (executed in `plot-app\`)
3. Preview build: `npm run preview` (executed in `plot-app\`)
4. TypeScript checking: `npx tsc --noEmit` (can be run from root)

## Database Operations
1. All schema changes must be documented in SQL migration files
2. Migration files must be placed in `supabase\migrations\` with timestamp prefix
3. Apply migrations manually via Supabase SQL editor
4. Never modify production schema directly without migration

## Environment Variables
1. Never commit `.env` file to version control
2. Keep `.env.example` with required variable names (without values)
3. Required variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
4. Supabase service role key should never be exposed to client-side code

## Git Workflow
1. Create descriptive branch names: `feature/`, `bugfix/`, `docs/`
2. Write clear commit messages following conventional commits format
3. Pull latest changes before starting work
4. Resolve merge conflicts promptly