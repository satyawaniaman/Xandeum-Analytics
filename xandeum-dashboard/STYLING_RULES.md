# Xandeum Dashboard Styling Rules

## Color Palette

### Backgrounds
- **Page background**: `bg-zinc-950`
- **Sidebar background**: `bg-zinc-900/50`
- **Card background**: `bg-zinc-900/50`
- **Header/Navbar background**: `bg-zinc-900/80 backdrop-blur-sm`
- **Input/Button muted**: `bg-zinc-800`

### Borders
- **Primary border**: `border-zinc-800`
- **Sidebar border**: `border-r border-zinc-800`
- **Card border**: `border border-zinc-800`

### Text Colors
- **Primary text**: `text-zinc-100`
- **Secondary text**: `text-zinc-400`
- **Muted text**: `text-zinc-500`
- **Success/Online**: `text-emerald-400`
- **Warning/Private**: `text-amber-400`
- **Error/Offline**: `text-red-400`

---

## Components

### Cards
```tsx
className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5"
```
- Use `rounded-xl` for all cards
- Padding: `p-5` for stat cards, `p-6` for content cards

### Card Title
```tsx
<h3 className="text-sm font-medium text-zinc-400">Label</h3>
```

### Card Value (Large)
```tsx
<p className="text-3xl font-bold mt-2 text-zinc-100">Value</p>
```

### Section Headers
```tsx
<h3 className="text-base font-semibold text-zinc-100 mb-2">Title</h3>
<p className="text-sm text-zinc-500 mb-8">Description</p>
```

---

## Layout

### Content Padding
- Page content: `px-6 py-6`
- Navbar height: `h-14`
- Section spacing: `mt-6` between sections

### Grid Layouts
- Stats grid: `grid gap-4 md:grid-cols-2 lg:grid-cols-4`
- Two column: `grid gap-4 md:grid-cols-2`

---

## Buttons

### Ghost Button (Navbar actions)
```tsx
className="h-8 w-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
```

### Badge/Tag
```tsx
className="font-mono font-medium text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded"
```

---

## Typography

### Page Title (in Navbar)
```tsx
<h1 className="text-lg font-semibold text-zinc-100">{title}</h1>
```

### Section Title
```tsx
<h3 className="text-base font-semibold text-zinc-100">{title}</h3>
```

### Label Text
```tsx
<span className="text-sm font-medium text-zinc-400">{label}</span>
```

---

## Sidebar Menu Items

### Active State
```tsx
variant="secondary" // Uses default shadcn styling
```

### Inactive State
```tsx
variant="ghost" // Uses default shadcn styling
```

### Group Labels
```tsx
<p className="text-sm font-medium text-muted-foreground px-4 pb-2">Label</p>
```
