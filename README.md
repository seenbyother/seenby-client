# seenby-client

Seenby는 타인의 경험을 통해 나에 대한 새로운 인사이트를 제공하는 서비스입니다.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Biome
- npm

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```


## Scripts

```bash
npm run dev        # Start local development server
npm run build      # Type-check and create production build
npm run preview    # Preview production build locally
npm run typecheck  # Run TypeScript project checks
npm run lint       # Run Biome lint
npm run check      # Run Biome lint, format, and import checks without writing
npm run format     # Format files with Biome
npm run fix        # Apply Biome safe fixes and formatting
```

## Tooling Policy

Linting and formatting are managed by Biome. ESLint is not used in this project.

Tailwind CSS is configured through the Vite plugin and imported from `src/index.css`.
