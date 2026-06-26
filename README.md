
<h1 align="center">✂️ ClipWise Frontend</h1>

<p align="center">
  <strong>React 18 · Vite 6 · Tailwind CSS v4 · TypeScript</strong><br>
  A sleek, Vercel-inspired UI for summarizing YouTube videos with AI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React 18">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite 6">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind 4">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TS 5.9">
  <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query 5">
  <img src="https://img.shields.io/badge/Motion-12-0055FF?logo=framer&logoColor=white" alt="Motion 12">
</p>

---

## Table of Contents

- [Overview](#overview)
- [Built With](#built-with)
- [Project Structure](#project-structure)
- [Design System](#design-system)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Run](#run)
- [Component Library](#component-library)
- [Data Flow](#data-flow)
- [Docker](#docker)
- [Build](#build)

---

## Overview

ClipWise Frontend is a single-page application that lets users paste a YouTube URL and receive an AI-generated summary. Built with a Vercel-inspired design system — clean typography, a three-step surface ladder, soft shadows, and a cohesive dark/light mode.

Key capabilities:

- **YouTube URL input** with instant validation feedback
- **5 display formats**: Full Summary, Key Points, tl;dr, Q&A, Bullets — switch with a tab pill row
- **Real-time copy-to-clipboard** with toast feedback
- **History panel** showing past summaries with pagination
- **Dark/light/system theme** persisted to localStorage
- **Animated micro-interactions** via Motion 12 (layout transitions, entrance animations)
- **Optimistic state management** with TanStack Query 5

---

## Built With

| Category | Technology |
|---|---|
| Framework | React 18 |
| Bundler | Vite 6 (SWC) |
| Language | TypeScript (strict) |
| Routing | react-router-dom v7 |
| Server State | @tanstack/react-query v5 |
| HTTP Client | axios (centralized instance) |
| Styling | Tailwind CSS v4 |
| Animation | motion v12 |
| Icons | lucide-react |
| Toasts | sonner |
| Realtime | socket.io-client |

---

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root: QueryClient + ThemeProvider + Router
├── components/
│   ├── layout/
│   │   └── AppLayout.tsx             # Sticky header + theme toggle + content area
│   ├── ui/
│   │   ├── Badge.tsx                 # Pill badge (default / accent / outline)
│   │   ├── Button.tsx                # Button with variants + sizes + loading
│   │   ├── Card.tsx                  # Elevated card container
│   │   ├── Input.tsx                 # Form input with label + error
│   │   └── Spinner.tsx               # Shared animated loading spinner
│   ├── InputBar.tsx                  # YouTube URL input + submit button
│   ├── FormatSelector.tsx            # 5-format tab pill row
│   ├── SummaryCard.tsx               # Rendered summary with copy button
│   └── HistoryList.tsx               # Recent summaries list
├── contexts/
│   └── ThemeContext.tsx               # Light / dark / system theme context
├── lib/
│   ├── axios.ts                      # Centralized axios instance with base URL
│   └── query-keys.ts                 # TanStack Query key factory
├── pages/
│   └── Home.tsx                      # Single-page app with all sections
├── services/
│   └── summarize.service.ts          # API calls (object literal pattern)
├── styles/
│   └── globals.css                   # Tailwind v4 + design token system
└── types/
    └── index.ts                      # ApiResponse generic + shared types
```

---

## Design System

The UI follows a Vercel-inspired token system defined in Tailwind v4's `@theme` directive.

### Color Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `bg-canvas` | `#fff` | `#0a0a0b` | Page background |
| `bg-canvas-soft` | `#fafafa` | `#18181b` | Card / elevated surface |
| `bg-canvas-soft-2` | `#f4f4f5` | `#27272a` | Input / hover surface |
| `text-ink` | `#09090b` | `#fafafa` | Primary text (headings) |
| `text-body` | `#3f3f46` | `#a1a1aa` | Body text |
| `text-mute` | `#a1a1aa` | `#52525b` | Secondary / muted text |
| `border-hairline` | `#e4e4e7` | `#27272a` | Subtle borders |
| `border-hairline-strong` | `#d4d4d8` | `#3f3f46` | Stronger borders |
| `bg-primary` | `#09090b` | `#fafafa` | Primary button background |
| `text-on-primary` | `#fafafa` | `#09090b` | Primary button text |

### Shadow Ladder

Five levels of stacked multi-offset shadows (`shadow-level-1` through `shadow-level-5`) create a subtle elevation hierarchy from cards to modals.

### Typography

- **Sans**: Inter (headings & body) with heavy negative tracking on display sizes
- **Mono**: JetBrains Mono (code snippets)

### Dark Mode

A `.dark` class on `<html>` flips all canvas/ink/hairline tokens. The `ThemeContext` manages three states: `light`, `dark`, and `system` (syncs with `prefers-color-scheme`).

---

## Getting Started

### Installation

```bash
cd clip-wise-frontend
npm install
```

### Configuration

The app reads its API base URL from `VITE_API_BASE_URL`. Copy the example file:

```bash
cp .env.development .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | Backend API base URL |

### Run

```bash
npm run dev          # → http://localhost:3001
```

The frontend expects the backend to be running on `localhost:3000`.

---

## Component Library

All UI primitives follow the same conventions:

- **Named exports** (no default exports)
- **Variant/size prop system** (`Button`, `Badge`)
- **Consistent `className` merging** via template literals
- **Design tokens only** — no hardcoded colors or spacing

| Component | Props | Description |
|---|---|---|
| `Button` | `variant`, `size`, `loading` | Action button with loading spinner |
| `Badge` | `variant` | Pill-shaped label (`default`, `accent`, `outline`) |
| `Card` | — | Elevated container with shadow |
| `Input` | `label`, `error` | Form input with label & error state |
| `Spinner` | `size` | Animated loading spinner |
| `InputBar` | `onSubmit` | YouTube URL input with submit action |
| `FormatSelector` | `formats`, `selected`, `onChange` | Tab pill row for format switching |
| `SummaryCard` | `summary`, `format` | Renders summary content + copy button |
| `HistoryList` | — | Paginated list of past summaries |

---

## Data Flow

```
User pastes YouTube URL
  ↓ InputBar validates URL format
  ↓ summarize.service.ts sends POST /summarize
  ↓ TanStack Query caches + shows loading state (Spinner)
  ↓ SummaryCard renders the AI response
  ↓ User selects different format via FormatSelector
  ↓ POST /summarize/:id/generate { format }
  ↓ SummaryCard updates with new format content
  ↓ HistoryList polls GET /summarize for recent entries
```

All API calls go through a centralized axios instance (`lib/axios.ts`) that sets the base URL and default headers. TanStack Query manages caching, background refetching, and optimistic updates.

---

## Docker

```bash
docker build -t clipwise-frontend .
docker run -p 8080:80 clipwise-frontend
```

The production build is served via an nginx container (see `nginx.conf`) on port 80, mapped to host port 8080.

---

## Build

```bash
npm run build       # Output → dist/
```

The production build is optimized by Vite 6 (SWC minification, code splitting, CSS purging via Tailwind).
