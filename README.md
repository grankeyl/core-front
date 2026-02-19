# Core Front

Telegram Mini App for managing digital gift portfolios, craft pools, DAO voting, and burns — built with Vue 3 and designed for the TON ecosystem.

## Tech Stack

- **Vue 3** — Composition API with `<script setup>`
- **TypeScript** — strict typing throughout
- **Vite 7** — dev server and build
- **Vue Router 4** — SPA routing
- **Pinia** — state management
- **SCSS** (sass-embedded) — scoped component styles
- **Chart.js** — portfolio charts
- **GSAP** — animations
- **Lottie** — animated illustrations
- **Telegram Mini App SDK** (`@twa-dev/sdk`) — native TG integration
- **TON Connect** (`@tonconnect/ui`, `@ton/core`) — wallet connection

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — main dashboard |
| `/profile` | Profile — portfolio, splits, burns, DAO, craft, transactions |
| `/burn` | Burn — gift burn lobby |
| `/burn/item/:id` | Burn Item — individual burn detail with parallax |
| `/craft-pools` | Craft Pools — gift category grid/list |
| `/craft-pools/gift/:slug` | Pools by Gift — browse pools within a category |
| `/craft-pools/pool/:id` | Pool Detail — members, progress, voting, bring gifts |
| `/craft-pools/create` | Create Pool — select gifts and create a new pool |
| `/craft-pools/my` | My Pools — user's active/crafting/completed pools |
| `/shared/:id` | Shared — public gift link |

## Project Structure

```
src/
├── api/            # API clients (gifts, dao, craft, funds, etc.)
├── assets/
│   ├── icons/      # SVG icons
│   ├── images/     # Static images by page
│   └── styles/     # Global SCSS (base, variables)
├── components/
│   └── common/     # Shared components (Header, Menu, Modal, Wallet)
├── hooks/          # Composables (useTonConnect)
├── localization/   # i18n strings
├── mocks/          # Mock data for development
├── router/         # Vue Router config
├── stores/         # Pinia stores
├── types/          # TypeScript interfaces
├── utils/          # Helpers (useApp, Telegram SDK wrappers)
└── views/          # Page components
    ├── Burn/
    ├── BurnItem/
    ├── CraftPoolCreate/
    ├── CraftPoolDetail/
    ├── CraftPools/
    ├── CraftPoolsByGift/
    ├── Home/
    ├── MyPools/
    ├── Profile/
    └── Shared/
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install

```bash
npm install
```

### Configure

Copy the example env file and fill in your values:

```bash
cp .env.example .env.development
```

| Variable | Description |
|----------|-------------|
| `VITE_APP_URL` | Public app URL |
| `VITE_APP_API_URL` | Backend API base URL |
| `VITE_APP_INIT_DATA` | Telegram Mini App init data (for local dev) |

### Run

```bash
npm run dev
```

The app starts at `http://localhost:6400` (Vite host mode).

### Build

```bash
npm run build
```

Output goes to `dist/`.

## Features

### Profile
Multi-section profile page with parallax scroll animation:
- **Split** — gift splits with price charts
- **Burns** — burn history and league standings
- **DAO** — active votes and governance
- **Craft** — user's craft pool participations
- **Portfolio** — owned gifts with burn flow
- **Transactions** — deposit/withdrawal history

### Craft Pools
Collaborative gift crafting system:
- Browse gift categories (grid/list view)
- Join or create pools (up to 4 members)
- Bring gifts as contributions
- Track pool progress and deadlines
- DAO voting on completed pools (sell, rent, other)
- Pool control for completed assets

### Burns
Gift burn mechanism with rewards:
- Select gifts to burn
- Progress tracking
- League-based rewards
- History with filters (sort, type, status)

### Wallet
TON Connect integration:
- Connect/disconnect TON wallet
- View balance
- Transaction signing

## License

Private — all rights reserved.
