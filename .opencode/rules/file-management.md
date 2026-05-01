# File Management Rules

## Source Code Organization
1. React components: `plot-app\src\components\` or `plot-app\src\pages\`
2. Styles: Use Tailwind CSS utility classes primarily; custom CSS in `plot-app\src\styles\` if absolutely necessary
3. Assets: Images, icons, and media in `plot-app\public\` or `plot-app\src\assets\`
4. Utilities: Helper functions, constants, and types in `plot-app\src\lib\` or `plot-app\src\utils\`
5. Routes: Application routing in `plot-app\src\routes\`

## Specification Documents
1. All feature specifications must be stored in `.opencode\spec\` folder
2. Specification files should use `.md` extension
3. Specification naming convention: `feature-name.md` or `feature-name-spec.md`
4. Specifications must include: purpose, user stories, acceptance criteria, and technical considerations
5. Update specifications whenever significant changes are made to implemented features

## Database Migrations
1. Migration files: `supabase\migrations\YYYYMMDDHHSSSS_description.sql`
2. Each migration must be self-contained and reversible where possible
3. Include both `UP` and `DOWN` sections for reversible migrations
4. Test migrations on a development database before applying to production
5. Never modify existing migration files; create new ones for changes

## Documentation
1. User-facing documentation: `plan\docs\` or `plot-app\public\docs\`
2. Developer documentation: `plan\developer\` or inline JSDoc/TSDoc comments
3. Architecture diagrams: `plan\architecture\` (prefer SVG or Mermaid syntax)
4. API documentation: Generate from code or maintain in `plan\api\`

## Configuration Files
1. Root-level configuration: `.opencode\`, `supabase\`, `plan\`
2. Application configuration: `plot-app\` (vite.config.ts, tailwind.config.ts, etc.)
3. Environment variables: `.env` (never committed) and `.env.example` (committed)
4. Keep configuration files minimal and well-documented