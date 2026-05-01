# feature-builder Skill

This skill enables agents to autonomously add new features or modules to existing full-stack applications while maintaining system integrity and ensuring seamless integration.

## Overview

The feature-builder skill provides capabilities for:
- Understanding existing codebase structure and patterns
- Designing features that integrate seamlessly with current systems
- Implementing new functionality following established conventions
- Ensuring backward compatibility
- Writing comprehensive tests for new features
- Following best practices for full-stack development

## Usage

When an agent with this skill is tasked with adding a new feature, it will:
1. Analyze the existing application architecture
2. Review relevant documentation and code patterns
3. Design the feature implementation plan
4. Implement the feature following established conventions
5. Ensure proper integration with frontend, backend, and database layers
6. Write unit, integration, and end-to-end tests
7. Verify that existing functionality remains intact
8. Document the new feature appropriately

## Configuration

No special configuration is required for this skill. It works out of the box with the standard tools provided.

## Full-Stack Considerations

### Frontend (React/Vite + Tailwind)
- Component design following existing patterns
- State management consistency
- Styling adherence to Tailwind conventions
- Responsive design considerations
- Accessibility compliance

### Backend (Supabase)
- Database schema extensions
- API endpoint design (if using Supabase functions)
- Row Level Security policies
- Storage bucket configurations (if applicable)
- Authentication integration

### Integration Points
- Data flow between frontend and backend
- Proper error handling and loading states
- Authentication and authorization checks
- Real-time subscription handling (if applicable)
- File upload/download workflows (if applicable)

## Best Practices

- Maintain consistency with existing code style
- Follow the principle of least surprise
- Implement comprehensive error handling
- Write tests before or alongside implementation
- Consider performance implications
- Document assumptions and limitations
- Ensure proper cleanup of resources
- Follow security best practices