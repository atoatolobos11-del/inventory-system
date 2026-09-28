import {
  Backpack,
  Footprints,
  Glasses,
  Headphones,
  Package,
  Shirt,
  ShoppingBag,
  Sparkles,
  Speaker,
  Wallet,
  Watch,
} from 'lucide-react'

/** Maps mock-data icon keys to Lucide components (one source of truth). */
export const PRODUCT_ICONS = {
  shirt: Shirt,
  boots: Footprints,
  glasses: Glasses,
  watch: Watch,
  bag: ShoppingBag,
  scarf: Sparkles,
  wallet: Wallet,
  backpack: Backpack,
  headphones: Headphones,
  speaker: Speaker,
}

export default function ProductIcon({ name = 'package', size = 20, strokeWidth = 1.6, className }) {
  const Icon = PRODUCT_ICONS[name] ?? Package
  return <Icon size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />
}