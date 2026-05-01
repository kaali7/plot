# Tech Stack – Plot

## 1. Overview

Plot is a full-stack web application designed to handle structured storytelling workflows, including multi-entity relationships (stories, characters, scenes, conflicts, resources) and rich interactive UI components.

The tech stack is chosen to ensure:

* Fast development (MVP → scalable product)
* Strong relational data handling
* Clean UI/UX for complex forms and interactions
* Easy deployment and global access

---

## 2. Frontend

### Core Framework

* **React.js (Vite)**

  * Fast build and development environment
  * Component-based architecture
  * Ideal for dynamic UI (scenes, characters, forms)

---

### Styling

* **Tailwind CSS**

  * Utility-first styling
  * Rapid UI development
  * Consistent design system

---

### UI Components

* Custom reusable components:

  * `Card`, `Tabs`, `Modal`, `Accordion`
  * `CharacterCard`, `SceneCard`, `DialogueRow`

---

### State Management

* React Hooks (`useState`, `useEffect`)
* Context API (for global story state)
* Optional (future): Zustand / Redux Toolkit

---

### Form Handling

* **React Hook Form**

  * Efficient form state management
  * Validation support

---

### Rich Text Editor

* **TipTap Editor**

  * Used in Writing Mode
  * Supports structured + freeform writing

---

## 3. Backend (BaaS)

### Platform

* **Supabase**

Provides:

* Authentication (login/signup)
* PostgreSQL database
* Storage (images, resources)
* Row Level Security (RLS)

---

## 4. Database

### Type

* **PostgreSQL (via Supabase)**

### Why PostgreSQL?

* Strong relational support
* Ideal for structured storytelling data:

  * Stories → Characters → Scenes → Resources

---

### Core Entities

* Stories
* Characters
* Conflicts
* World Settings
* Scenes
* Scene Dialogues
* Relationships (Character ↔ Character)
* Resources

---

### Key Features

* Foreign key relationships
* Indexed queries for performance
* JSON fields (optional for flexible data)

---

## 5. Storage

* **Supabase Storage**

Used for:

* Character images
* Scene visuals
* Resource media

---

## 6. Deployment

### Hosting Platform

* **Vercel**

Features:

* Fast deployment
* Automatic CI/CD from GitHub
* Global CDN
* Preview deployments

---

## 7. API & Data Layer

* Supabase client SDK (frontend integration)
* RESTful interaction via Supabase APIs

---

### Future Upgrade:

* FastAPI layer for:

  * AI processing
  * Complex business logic

---

## 8. Advanced Features (Future Ready)

### AI Integration

* OpenAI / Gemini APIs

  * Scene generation
  * Character creation
  * Writing assistance

---

### Drag & Drop

* **dnd-kit**

  * Scene reordering
  * Character arrangement

---

### Visualization (Optional)

* Graph view for character relationships

---

## 9. Performance Optimization

* Lazy loading components
* Code splitting (Vite)
* Memoization (`React.memo`, `useMemo`)
* Optimized database queries

---

## 10. Security

* Supabase Authentication
* Row Level Security (RLS)
* Secure environment variables
* Role-based access (future)

---

## 11. Developer Experience

* Git + GitHub for version control
* ESLint + Prettier for clean code
* Modular folder structure

---

## 12. Why This Stack?

| Layer      | Technology   | Reason                  |
| ---------- | ------------ | ----------------------- |
| Frontend   | React + Vite | Fast, scalable UI       |
| Styling    | Tailwind CSS | Rapid design system     |
| Backend    | Supabase     | All-in-one BaaS         |
| Database   | PostgreSQL   | Strong relational model |
| Editor     | TipTap       | Writing-focused UX      |
| Deployment | Vercel       | Simple, fast hosting    |

---

## 13. Scalability Plan

* Phase 1: MVP with Supabase (no custom backend)
* Phase 2: Add AI API layer
* Phase 3: Optimize performance + caching
* Phase 4: Multi-user collaboration system

---

## ✅ Final Outcome

This tech stack enables Plot to function as a:

* Structured storytelling engine
* Interactive writing workspace
* Scalable SaaS-ready application

Supporting the full flow:
**Idea → Structure → Scene → Writing → Output**
