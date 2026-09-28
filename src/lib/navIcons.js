import {
  ChartColumn,
  Globe,
  HandCoins,
  Home,
  Package,
  Settings,
  Users,
  Warehouse,
} from 'lucide-react'

/** Maps sidebar section icon keys to Lucide components (one source of truth). */
export const NAV_ICONS = {
  home: Home,
  sell: HandCoins,
  reporting: ChartColumn,
  catalog: Package,
  inventory: Warehouse,
  customers: Users,
  setup: Settings,
  ecommerce: Globe,
}