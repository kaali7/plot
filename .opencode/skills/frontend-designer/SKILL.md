# 🧠 Skill: Frontend UI Designer Agent (Dark Purple System)

## 🎯 Purpose

An autonomous UI design and implementation agent responsible for generating a **visually consistent, modern, and emotionally expressive frontend** using a **dark-to-purple gradient theme**, rounded components, and structured card-based layouts.

This skill ensures that all UI elements align with a **premium storytelling aesthetic**, optimized for clarity, hierarchy, and user engagement.

---

## 🧩 Scope

### ✅ Includes

* Full UI design system (color, spacing, typography)
* React + Tailwind component styling
* Card-based UI (Character, Scene, Story)
* Rounded UI system (global consistency)
* Label/tag styling based on theme + emotion
* Layout design (grid, flex, spacing)
* Dark-mode optimized interfaces
* Reusable UI components

---

### ❌ Excludes

* Backend logic
* Data fetching logic
* Business rules
* Animation-heavy microinteractions (unless specified)

---

## 📥 Inputs

* Feature/module name (e.g., Character Card, Scene Builder)
* Data structure (fields to display)
* Theme preference (default: black → purple gradient)
* UI constraints (optional)

---

## 📤 Outputs

* Styled React components (Tailwind-based)
* Reusable UI elements
* Design tokens (colors, spacing, radius)
* Layout structure
* Visual hierarchy guidelines

---

## 🎨 Design System

### 1. Color Palette

Primary gradient:

```css
background: linear-gradient(
  90deg,
  #000000,
  #2a003f,
  #5a007a,
  #8a00c2
);
```

#### Core Colors

| Purpose    | Color                   |
| ---------- | ----------------------- |
| Background | Black (#000000)         |
| Primary    | Deep Purple (#5a007a)   |
| Accent     | Bright Purple (#8a00c2) |
| Surface    | Dark Violet (#1a001f)   |

---

### 2. Label / Tag Colors (Emotion-Based)

| Emotion           | Color              |
| ----------------- | ------------------ |
| Danger / Conflict | Deep Red / Crimson |
| Calm / Neutral    | Muted Purple       |
| Highlight         | Neon Purple        |
| Info              | Indigo             |

👉 Labels must always:

* Be **darker than background contrast**
* Use **soft rounded pills**
* Have **low opacity backgrounds**

---

### 3. Border Radius System (Strict Rule)

All UI elements MUST follow:

```css
border-radius: 16px; /* default */
border-radius: 20px; /* cards */
border-radius: 999px; /* pills/tags */
```

❗ No sharp edges allowed

---

### 4. Shadow & Depth

Use soft glow instead of harsh shadows:

```css
box-shadow: 0 0 20px rgba(138, 0, 194, 0.2);
```

---

### 5. Typography

* Headings → bold, large, high contrast
* Body → soft gray (#cfcfcf)
* Labels → small, uppercase, spaced

---

## 🧠 Decision Logic

### ✅ Use this skill when:

* Creating new UI components
* Designing new pages
* Improving visual consistency
* Building dashboards, cards, forms

---

### ❌ Ignore this skill when:

* Backend/API work
* Pure logic updates
* Testing or debugging

---

## ⚙️ Execution Steps

### 1. Analyze UI Requirement

* Identify:

  * Component type (card, form, modal, list)
  * Data density
  * User interaction level

---

### 2. Apply Theme System

* Use:

  * Dark base background
  * Purple gradients for highlights
  * Soft glowing accents

---

### 3. Structure Layout

* Use:

  * Grid for cards
  * Flex for alignment
* Maintain:

  * Proper spacing (8px system)

---

### 4. Build Component

Example: Character Card

```jsx
<div className="bg-[#1a001f] rounded-2xl p-4 shadow-[0_0_20px_rgba(138,0,194,0.2)]">
  <img className="rounded-xl mb-3" src="/character.jpg" />
  <h2 className="text-white text-lg font-semibold">Jerome Bell</h2>
  <p className="text-gray-400 text-sm">Main Character</p>

  <div className="flex gap-2 mt-2">
    <span className="px-3 py-1 text-xs rounded-full bg-purple-900 text-purple-300">
      Fear
    </span>
    <span className="px-3 py-1 text-xs rounded-full bg-red-900 text-red-300">
      Conflict
    </span>
  </div>

  <button className="mt-4 w-full bg-purple-700 hover:bg-purple-600 text-white py-2 rounded-xl">
    Follow
  </button>
</div>
```

---

### 5. Add Labels / Tags

* Use:

  * Emotion-based colors
  * Rounded pill shapes
  * Subtle backgrounds

---

### 6. Maintain Consistency

Ensure:

* Same spacing across components
* Same radius rules
* Same color hierarchy

---

### 7. Optimize UX

* Add:

  * Hover states
  * Focus states
* Ensure:

  * Readability in dark mode
  * Contrast accessibility

---

## 📏 Quality Standards

* No visual inconsistency
* No sharp edges
* No random colors outside palette
* Components must be reusable
* UI must feel cohesive and premium

---

## 🚨 Edge Cases

* Too many colors → reduce to palette
* Low contrast text → adjust brightness
* Overcrowded UI → increase spacing
* Misaligned components → enforce grid

---

## 🔁 Iteration Strategy

1. Generate base UI
2. Refine spacing + hierarchy
3. Improve color balance
4. Enhance readability
5. Optimize for reuse

---

## 🧪 Validation

* UI matches dark-purple theme
* All components use rounded design
* Labels follow emotion color system
* No visual clutter
* Works across screen sizes

---

## 🔗 Dependencies

* React (Vite)
* Tailwind CSS
* Existing component system

---

## 📚 References

* Dark UI design principles
* Component-driven design
* Modern SaaS dashboard patterns
