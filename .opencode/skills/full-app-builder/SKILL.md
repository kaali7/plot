# 🧠 Skill: Full App Builder Agent (React + Supabase)

## 🎯 Purpose

An autonomous system design and code generation agent that builds **full-stack, production-ready applications** using **React (Vite + Tailwind)** and **Supabase (PostgreSQL + Auth + Storage)** based on structured product requirements.

This skill transforms a PRD (like *Plot*) into a **fully functional SaaS application**, including UI, database schema, relationships, and workflows.

---

## 🧩 Scope

### ✅ Includes

* Full frontend generation (React + Tailwind + component system)
* Supabase backend setup:

  * Database schema (PostgreSQL)
  * Relationships (FKs, joins)
  * Authentication
  * Row Level Security (RLS)
  * Storage integration
* Complex entity modeling (multi-relational data)
* Dynamic forms (React Hook Form)
* Modular UI architecture
* Feature-based folder structure
* End-to-end workflow mapping (Overview → Character → Scene → Writing)
* API/data integration via Supabase SDK
* Reusable component system
* Scalability-ready architecture

---

### ❌ Excludes

* DevOps infra (Kubernetes, AWS infra-level setup)
* Advanced AI model training (only integration-ready)
* Third-party billing systems (unless specified)

---

## 📥 Inputs

* PRD document (mandatory)
* Tech stack definition (React + Supabase)
* Feature breakdown (entities, flows)
* Deployment target (Vercel)

---

## 📤 Outputs

* Full project structure (frontend + backend config)
* Database schema (SQL)
* Supabase configuration (auth, RLS, storage)
* React components (modular)
* Pages & routes
* Forms & validation logic
* Data fetching layer
* Integration logic
* Scalable folder architecture

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* Building a new full-stack app from scratch
* Converting PRD → working product
* Designing relational systems (like storytelling, CRM, dashboards)
* Need scalable SaaS architecture

---

### ❌ Ignore this skill when:

* Small feature addition
* Bug fixing
* Minor UI tweaks
* Single API creation

---

## ⚙️ Execution Steps

### 1. PRD Parsing & Domain Modeling

Extract:

* Core entities:

  * Stories
  * Characters
  * Scenes
  * Conflicts
  * Resources
* Relationships:

  * Story → Characters
  * Story → Scenes
  * Character ↔ Character (relationships)
  * Scene ↔ Characters
  * Resources ↔ All entities

---

### 2. Database Design (Supabase)

Generate:

* Tables with:

  * Proper normalization
  * Foreign keys
  * Indexing

Example:

```sql
stories (id, title, theme, description)
characters (id, story_id, name, role, description)
scenes (id, story_id, title, type, order)
relationships (character_id, related_character_id, type)
resources (id, entity_type, entity_id, url, notes)
```

---

### 3. Supabase Configuration

* Enable:

  * Auth (email/password)
* Define:

  * RLS policies:

    * Users can access only their stories
* Setup:

  * Storage buckets for media

---

### 4. Frontend Architecture

Create structure:

```id="t8v2bm"
/src
  /features
    /story
    /character
    /scene
    /resource
  /components
  /hooks
  /services (supabase client)
  /pages
```

---

### 5. Component System Design

Reusable components:

* Card
* Modal
* Tabs
* Accordion
* Form Inputs
* Tag Inputs
* Dialogue Row

---

### 6. Feature Implementation

#### Overview Page

* Combined UI:

  * Basic Info
  * Conflict Builder
  * World Setting
  * Resources

---

#### Character Module

* Grid UI
* Add/Edit character modal
* Relationship system

---

#### Scene Builder

* Collapsible scene cards
* Reordering system
* Dialogue system

---

#### Writing Mode

* Integrate TipTap editor
* Pull structured data → narrative view

---

### 7. Data Integration Layer

* Supabase client usage:

  * CRUD operations
  * Real-time updates (optional)
* Abstract into services

---

### 8. Form Handling

* Use React Hook Form
* Validation:

  * Required fields
  * Type checks

---

### 9. State Management

* Context API for:

  * Active story
  * Global data
* Optimize with memoization

---

### 10. Performance Optimization

* Lazy load heavy components
* Split routes
* Optimize queries

---

### 11. Deployment (Vercel)

* Configure environment variables
* Ensure build compatibility
* Validate production API calls

---

## 📏 Quality Standards

* Clean modular architecture
* No duplicated logic
* Reusable components
* Scalable schema design
* Secure RLS policies
* Optimized queries
* Maintainable folder structure

---

## 🚨 Edge Cases

* Empty state (no stories)
* Large number of scenes/characters
* Broken relationships
* Missing resources
* Unauthorized access (RLS failure)
* Partial data loading
* Form submission failures

---

## 🔁 Iteration Strategy

1. Generate MVP structure
2. Validate relationships
3. Improve UI/UX modularity
4. Optimize performance
5. Add advanced features (AI, collaboration)

---

## 🧪 Validation

* User can:

  * Create story
  * Add characters
  * Build scenes
  * Attach resources
* Relationships are consistent
* Data persists correctly
* UI updates reflect DB state
* Auth works with RLS

---

## 🔗 Dependencies

* React (Vite)
* Tailwind CSS
* Supabase
* React Hook Form
* TipTap Editor
* dnd-kit (optional)

---

## 📚 References

* Relational database design best practices
* Component-driven frontend architecture
* Supabase RLS guidelines
* Clean code principles
