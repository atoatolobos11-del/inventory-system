# ROOT CO.

Frontend-only inventory & sales dashboard. React + Vite + Tailwind CSS + Recharts + Lucide React,
served statically via Nginx in Docker.

No backend, database, or external API — dashboard data is centralized mock data in
`src/data/dashboardData.js`; the auth session and POS receipts persist to `localStorage`.

## Stack

- **React 18** + **Vite** — componentized UI and build tooling
- **Tailwind CSS** — all layout, spacing, typography, colors, borders, responsive behavior
- **Recharts** — area/line charts (olive line, very light fill, minimal axes)
- **Lucide React** — interface icons
- **Nginx** (Docker) — production static hosting

## Design tokens

| Token        | Value    | Usage                         |
| ------------ | -------- | ----------------------------- |
| `--sidebar`  | `#181818`| Dark left sidebar             |
| `--page-bg`  | `#F3F5ED`| Main dashboard background     |
| `--card`     | `#FFFFFF`| Cards                         |
| `--border`   | `#DEE0D9`| Card/control borders          |
| `--text`     | `#181818`| Primary text                  |
| `--muted`    | `#4D4E4A`| Secondary text                |
| `--olive`    | `#8C8D40`| Chart/accent color            |
| `--olive-light` | `#EDEED9` | Chart fill / soft accent   |

Tokens are defined in `tailwind.config.js` (used as `bg-page-bg`, `border-line`,
`text-olive`, etc.) and mirrored in `src/index.css`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build + preview:

```bash
npm run build
npm run preview    # http://localhost:4173
```

## Run with Docker

```bash
docker build -t inventory360 .
docker run -d -p 8080:80 --name inventory360-app inventory360
```

Open http://localhost:8080

The Docker image is multi-stage: `node:20-alpine` builds the Vite bundle, then
`nginx:1.27-alpine` serves the static `dist/` with an SPA fallback
(`try_files $uri $uri/ /index.html;`) so future routes work without 404s.

## Project structure

```
src/
├── assets/                    # (reserved for product assets)
├── components/
│   ├── auth/                  # AuthPage (login / register)
│   ├── charts/                # OutletSalesChart, MonthlySalesChart, ChartTooltip
│   ├── dashboard/             # OverviewCard, SalesCard, TransferCard,
│   │                          # PurchaseOrdersCard, Metric, FilterControls, Modals
│   ├── inventory/             # InventoryPage (stock KPIs + per-location table)
│   ├── layout/                # Sidebar, Header, DashboardLayout
│   ├── products/              # ProductIcon, StockBadge (mock product thumbnails)
│   └── sell/                  # SellPage (point of sale + receipts)
├── data/dashboardData.js      # All mock data + formatters + product catalog
├── lib/
│   ├── auth.jsx               # Mock auth (localStorage)
│   ├── cn.js                  # className helper
│   ├── navIcons.js            # Sidebar icon map
│   ├── posStore.js            # POS transaction persistence (localStorage)
│   └── useHashRoute.js        # Hash-based routing
├── App.jsx
├── main.jsx
└── index.css
```

## Interactions (frontend-only)

- Sidebar navigation with active state, collapsible on desktop, drawer on mobile
- Period filter: Today / This Week / This Month (updates chart + KPI data)
- Outlet dropdown: All Outlets / Main Store / Downtown Store / Texas Warehouse
- `+ SHOW MORE RETAIL METRICS` toggles extra metrics
- `View Transfer` → details modal
- `View Dispatched Orders` → orders modal
- Sidebar collapse preference persisted to `localStorage`

### Sell (POS) page

- Searchable, category-filterable product catalog; tap a tile to add to the sale
- Cart with quantity steppers, remove, clear; stock-aware (can't oversell)
- Optional customer reference + Card/Cash payment method
- Checkout applies 8.25% sales tax and shows a receipt modal
- Completed sales persist to `localStorage` and appear under Recent Transactions

### Inventory page

- KPI row: SKUs, units on hand, low stock, out of stock (aggregated from the catalog)
- Amber alert banner when items drop below reorder level
- Search (name/SKU) + status and category filter chips
- Per-location stock table (Main / Downtown / Texas) with color-coded counts and
  availability badges, plus incoming purchase-order units