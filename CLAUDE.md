# 2D Garden Planner

## Overview
A web-based 2D garden planner that allows users to design and visualize garden layouts. Built with React and TypeScript.

## Tech Stack
- **Framework**: React 19
- **Language**: TypeScript (strict mode)
- **Styling**: TBD
- **Build Tool**: Vite
- **Package Manager**: npm

## Common Commands
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run preview` — preview production build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript compiler check

### Testing
- `npm test` — run all Jest unit/integration tests
- `npm run test:watch` — Jest in watch mode
- `npm run test:coverage` — Jest with coverage report
- `npm run test:e2e` — run all Playwright e2e tests (auto-starts dev server)
- `npm run test:e2e:ui` — Playwright with interactive UI
- `npm run test:e2e:debug` — Playwright in debug mode

### Test Conventions
- **Unit/integration tests**: Jest + React Testing Library, files in `src/**/__tests__/` or `*.test.tsx`
- **E2E tests**: Playwright, files in `e2e/*.spec.ts`
- E2E tests run against `http://localhost:5173` (Playwright starts the dev server automatically)
- Playwright is configured for Chromium, Firefox, and WebKit; run a single browser with `--project=chromium`

## Architecture

### Key Concepts
- **Canvas/Grid**: The garden layout is represented as a 2D grid where users place plants and elements
- **Plants**: Each plant has properties like size, spacing requirements, sunlight/water needs, and seasonal data
- **Garden Elements**: Non-plant items (paths, raised beds, water features, fences, etc.)
- **Layers**: Visual layers for soil, plants, structures, and labels

### Directory Structure
```
src/
  components/       # React UI components
    canvas/         # Garden canvas and grid rendering
    sidebar/        # Plant palette, tools, properties panel
    toolbar/        # Top-level tool controls
  hooks/            # Custom React hooks
  store/            # State management
  types/            # TypeScript interfaces and types
  utils/            # Pure utility functions (grid math, collision detection, etc.)
  data/             # Static plant data and garden element definitions
```

## Guidelines
- Use strict TypeScript — no `any` types
- Prefer functional components with hooks over class components
- Keep canvas/rendering logic separate from UI components
- Co-locate component styles with their component files
- All plant and garden element data should be typed with explicit interfaces
- Coordinate system: origin (0,0) at top-left, x increases right, y increases down
