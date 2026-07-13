<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Audio Player Project AI Guidelines

## Project Overview
This is a Next.js (App Router) web application functioning as an Audio Player.

## Technology Stack
- **Core**: Next.js 16+, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`)
- **Animations**: GSAP (`gsap`, `@gsap/react`)
- **Icons**: Lucide React
- **Custom Scrollbars**: OverlayScrollbars (`overlayscrollbars-react`)

## Architecture & Directory Structure
This project uses a feature-driven architecture alongside the Next.js App Router:

- `app/`: Next.js App Router pages, layouts, and routing logic.
- `features/`: Feature-based modules containing domain-specific logic, components, and Redux slices. Key features include `Auth`, `LeftSidebar`, `RightSidebar`, `Player`, `Playlist`, `Songs`, etc.
- `components/`: Shared, reusable UI components.
- `store/`: Central Redux store configuration and middlewares.
- `slices/`: Additional global Redux slices.
- `hooks/`: Custom React hooks (including `globalHooks.ts`).
- `contexts/`: React contexts for localized state.
- `providers/`: Global app providers (e.g., Redux provider).
- `lib/`: Integrations and wrappers for external libraries.
- `utils/`: Helper functions.
- `types/`: Global TypeScript interfaces and types.
- `schemas/`: Data validation schemas.
- `styles/`: Global CSS/styling.

## AI Assistant Instructions
1. **Redux & State**: When managing state, use Redux Toolkit. Co-locate slices inside `features/[FeatureName]/` when they belong to a specific domain, otherwise place them in `slices/`. Always register new slices in `store/store.ts`.
2. **Components**: Follow a functional component architecture. Place domain-specific components in their respective `features/` folders and generic ones in `components/`.
3. **Styling**: Use Tailwind CSS for all styling needs.
4. **Animations**: Rely on GSAP with `@gsap/react` hooks for complex animations.
5. **Types**: Ensure strict TypeScript typings across the app. Use the `types/` folder for global definitions.
