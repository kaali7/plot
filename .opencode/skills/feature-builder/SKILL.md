# 🧠 Skill: Feature Builder Agent (React + Supabase)

## 🎯 Purpose

An autonomous development agent responsible for **adding new features or modules** to an existing full-stack application without breaking system integrity.

This skill ensures that every new feature aligns with:
→ Existing architecture
→ Database schema
→ UI/UX patterns
→ Security (RLS)
→ Performance standards

---

## 🧩 Scope

### ✅ Includes

* Feature-level frontend + backend development
* Database schema extension (Supabase)
* UI component creation (aligned with design system)
* API/data layer updates
* Integration with existing modules
* Form creation & validation
* State management updates
* RLS policy updates (if needed)
* Reusability-first component design

---

### ❌ Excludes

* Full app generation (handled by Full App Builder)
* Large-scale refactoring of existing system
* DevOps/infrastructure changes
* AI model training (only integration)

---

## 📥 Inputs

* Feature description (mandatory)
* Affected entities (e.g., Story, Character, Scene)
* UI requirements (optional)
* Data requirements (fields, relationships)
* Existing project structure
* Constraints (if any)

---

## 📤 Outputs

* New/updated database schema (SQL or Supabase config)
* React components (modular)
* Updated pages/routes
* API/data integration logic
* Updated RLS policies (if required)
* Reusable UI elements
* Integration-ready feature module

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* Adding new feature/module
* Enhancing existing functionality
* Extending database schema
* Introducing new UI workflows
* Integrating new APIs or services

---

### ❌ Ignore this skill when:

* Fixing bugs → use Testing + Fixer
* Building full app from scratch → use Full App Builder
* Minor UI tweaks (no logic involved)

---

## ⚙️ Execution Steps

### 1. Feature Analysis

* Parse feature request
* Identify:

  * Affected modules
  * Required data changes
  * UI complexity level

---

### 2. Impact Mapping

Check:

* Which tables are affected?
* Does it require:

  * New table?
  * New fields?
  * Relationship updates?

---

### 3. Database Update (Supabase)

* Extend schema safely:

```sql
ALTER TABLE characters ADD COLUMN backstory TEXT;
```

* Or create new entity:

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  story_id UUID REFERENCES stories(id),
  content TEXT
);
```

---

### 4. RLS Policy Update

* Ensure:

```sql
-- Users access only their own data
```

* Validate no security leaks

---

### 5. Frontend Module Creation

Follow feature-based structure:

```id="o3w5g6"
/features/<feature-name>
  components/
  hooks/
  services/
  index.ts
```

---

### 6. UI Development

* Use existing design system:

  * Card
  * Modal
  * Tabs
* Maintain consistency with:

  * Tailwind styles
  * Component patterns

---

### 7. Form Handling

* Use React Hook Form
* Add validation rules
* Handle edge cases

---

### 8. Data Integration

* Use Supabase client
* Abstract logic into service layer:

```js
getNotesByStory(storyId)
createNote(data)
```

---

### 9. State Management Update

* Update:

  * Context API
  * Hooks
* Avoid unnecessary re-renders

---

### 10. Integration Testing (with Testing Skill)

* Validate:

  * Feature works in isolation
  * Works within full system
  * No regression introduced

---

## 📏 Quality Standards

* Zero breaking changes
* Backward compatibility maintained
* Clean modular code
* Reusable components
* Minimal duplication
* Secure RLS policies
* Optimized DB queries

---

## 🚨 Edge Cases

* Feature conflicts with existing schema
* Duplicate data structures
* Missing relationships
* UI inconsistency
* Unauthorized access due to RLS gaps
* Performance degradation

---

## 🔁 Iteration Strategy

1. Build minimal working feature
2. Validate integration
3. Optimize UI/UX
4. Refactor for reusability
5. Run full test suite

---

## 🧪 Validation

* Feature works end-to-end
* Database updates are correct
* UI matches system design
* No existing feature is broken
* Security rules enforced
* Performance remains stable

---

## 🔗 Dependencies

* React (Vite)
* Tailwind CSS
* Supabase
* React Hook Form
* Existing component library

---

## 📚 References

* Feature-driven architecture
* Atomic design principles
* Supabase schema best practices
* Clean code & modularity principles
