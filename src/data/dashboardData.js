/* ---------------------------------------------------------------------------
   Centralized mock data for the ROOT CO. dashboard.
   All dashboard information lives here — no backend, no persistence.
--------------------------------------------------------------------------- */

export const formatCurrency = (value, options = {}) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(value)

export const formatCurrencyShort = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

export const formatNumber = (value, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)

/* ---------------------------------------------------------------------------
   POS + stock helpers
--------------------------------------------------------------------------- */
export const POS_TAX_RATE = 0.0825

/** Total units across every location for a catalog product. */
export function stockTotal(product) {
  const stock = product?.stock ?? {}
  return Object.values(stock).reduce((sum, count) => sum + Number(count || 0), 0)
}

/** Overall availability status: 'ok' | 'low' | 'out'. */
export function stockStatus(product) {
  const total = stockTotal(product)
  if (total === 0) return 'out'
  if (total < (product?.reorderLevel ?? 0)) return 'low'
  return 'ok'
}

/** Parse a quantity string like "24 pcs" -> 24. */
export function parseQty(value = '') {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

/* ---------------------------------------------------------------------------
   Monthly overview — All Outlets chart (rising trend, 1 Apr → 30 Apr)
--------------------------------------------------------------------------- */
const outletSalesMonth = [
  { date: '1 Apr', value: 6400 },
  { date: '3 Apr', value: 6550 },
  { date: '5 Apr', value: 6210 },
  { date: '7 Apr', value: 6830 },
  { date: '9 Apr', value: 7140 },
  { date: '11 Apr', value: 7460 },
  { date: '13 Apr', value: 7290 },
  { date: '15 Apr', value: 7820 },
  { date: '17 Apr', value: 8150 },
  { date: '19 Apr', value: 7890 },
  { date: '21 Apr', value: 8430 },
  { date: '23 Apr', value: 8720 },
  { date: '25 Apr', value: 9060 },
  { date: '27 Apr', value: 8810 },
  { date: '29 Apr', value: 9340 },
  { date: '30 Apr', value: 9850 },
]

const outletSalesWeek = [
  { date: 'Mon', value: 1680 },
  { date: 'Tue', value: 2140 },
  { date: 'Wed', value: 1940 },
  { date: 'Thu', value: 2380 },
  { date: 'Fri', value: 2860 },
  { date: 'Sat', value: 3090 },
  { date: 'Sun', value: 2740 },
]

const outletSalesToday = [
  { date: '9 AM', value: 180 },
  { date: '10 AM', value: 410 },
  { date: '11 AM', value: 620 },
  { date: '12 PM', value: 540 },
  { date: '1 PM', value: 780 },
  { date: '2 PM', value: 920 },
  { date: '3 PM', value: 1110 },
  { date: '4 PM', value: 1260 },
  { date: '5 PM', value: 1180 },
]

/* ---------------------------------------------------------------------------
   Your Sales this Month — large area chart.
   Values follow the reference shape: 0, 3500, 1500, 2200, 5500, 5500, ...
--------------------------------------------------------------------------- */
const salesMonth = [
  { date: '1 Apr', value: 0 },
  { date: '2 Apr', value: 3500 },
  { date: '3 Apr', value: 1500 },
  { date: '4 Apr', value: 2200 },
  { date: '5 Apr', value: 5500 },
  { date: '6 Apr', value: 5500 },
  { date: '8 Apr', value: 8500 },
  { date: '10 Apr', value: 8500 },
  { date: '12 Apr', value: 8500 },
  { date: '14 Apr', value: 9800 },
  { date: '16 Apr', value: 6000 },
  { date: '18 Apr', value: 4700 },
  { date: '20 Apr', value: 6000 },
  { date: '22 Apr', value: 6800 },
  { date: '24 Apr', value: 7300 },
  { date: '27 Apr', value: 8000 },
  { date: '30 Apr', value: 5600 },
]

const salesWeek = [
  { date: 'Mon', value: 1200 },
  { date: 'Tue', value: 2100 },
  { date: 'Wed', value: 1800 },
  { date: 'Thu', value: 3200 },
  { date: 'Fri', value: 4100 },
  { date: 'Sat', value: 5200 },
  { date: 'Sun', value: 4800 },
]

const salesToday = [
  { date: '9 AM', value: 0 },
  { date: '10 AM', value: 420 },
  { date: '11 AM', value: 900 },
  { date: '12 PM', value: 700 },
  { date: '1 PM', value: 1500 },
  { date: '2 PM', value: 2200 },
  { date: '3 PM', value: 2600 },
  { date: '4 PM', value: 3200 },
  { date: '5 PM', value: 2900 },
]

/* ---------------------------------------------------------------------------
   Per-period KPIs + copy (Today / This Week / This Month)
--------------------------------------------------------------------------- */
export const periods = {
  Today: {
    id: 'Today',
    overviewTitle: 'This day your stores have sold',
    overviewValue: 812.64,
    overviewSupport: "That's $96.20 more than this time yesterday!",
    averageSaleValue: 45.9,
    averageItemsPerSale: 3.1,
    rightSupport: '0.4 more than yesterday',
    outletSales: outletSalesToday,
    sales: salesToday,
    salesTitle: 'Your Sales Today',
    retailMetrics: {
      unitsSold: 38,
      refunds: 41.2,
      grossRevenue: 853.84,
      netRevenue: 812.64,
    },
    targets: {
      targetLabel: 'Your Sales Target',
      targetValue: 1200.0,
      targetAction: 'Set a sales target',
      averageLabel: 'Average Sales Target',
      averageValue: 58.2,
      averageSupport: '$12.10 less than last week',
      itemsLabel: 'Average Items per Sale',
      itemsValue: 8,
      itemsSupport: '0.4 more than last week',
    },
  },
  'This Week': {
    id: 'This Week',
    overviewTitle: 'This week your stores have sold',
    overviewValue: 2430.55,
    overviewSupport: "That's $382.10 more than this time last week!",
    averageSaleValue: 52.1,
    averageItemsPerSale: 2.6,
    rightSupport: '0.3 more than last week',
    outletSales: outletSalesWeek,
    sales: salesWeek,
    salesTitle: 'Your Sales this Week',
    retailMetrics: {
      unitsSold: 191,
      refunds: 204.6,
      grossRevenue: 2635.15,
      netRevenue: 2430.55,
    },
    targets: {
      targetLabel: 'Weekly Sales Target',
      targetValue: 3500.0,
      targetAction: 'Set a sales target',
      averageLabel: 'Average Sales Target',
      averageValue: 59.8,
      averageSupport: '$6.40 less than last week',
      itemsLabel: 'Average Items per Sale',
      itemsValue: 8,
      itemsSupport: '0.1 more than last week',
    },
  },
  'This Month': {
    id: 'This Month',
    overviewTitle: 'This month your stores have sold',
    overviewValue: 8619.86,
    overviewSupport: "That's $1,780.24 more than this time last month!",
    averageSaleValue: 48.68,
    averageItemsPerSale: 2.8,
    rightSupport: '0.95 items than last month',
    outletSales: outletSalesMonth,
    sales: salesMonth,
    salesTitle: 'Your Sales this Month',
    retailMetrics: {
      unitsSold: 412,
      refunds: 218.4,
      grossRevenue: 9210.16,
      netRevenue: 8991.76,
    },
    targets: {
      targetLabel: 'Your Sales Target',
      targetValue: 800.8,
      targetAction: 'Set a sales target',
      averageLabel: 'Average Sales Target',
      averageValue: 61.34,
      averageSupport: '$20.95 less than last month',
      itemsLabel: 'Average Items per Sale',
      itemsValue: 8,
      itemsSupport: '0.08 more than last month',
    },
  },
}

export const OUTLETS = [
  { id: 'all', label: 'All Outlets' },
  { id: 'main', label: 'Main Store' },
  { id: 'downtown', label: 'Downtown Store' },
  { id: 'texas', label: 'Texas Warehouse' },
]

/* ---------------------------------------------------------------------------
   Locations / categories — shared by the Sell (POS) and Inventory pages
--------------------------------------------------------------------------- */
export const LOCATIONS = ['Main Store', 'Downtown Store', 'Texas Warehouse']

export const CATEGORIES = ['Apparel', 'Footwear', 'Accessories', 'Electronics']

/** Badge tones for the three availability states. */
export const STOCK_STATUS = {
  ok: { label: 'In Stock', badge: 'bg-olive-light text-sidebar' },
  low: { label: 'Low Stock', badge: 'bg-[#F7EDD2] text-[#7A5B12]' },
  out: { label: 'Out of Stock', badge: 'bg-[#FBEFED] text-[#9A2B22]' },
}

/* ---------------------------------------------------------------------------
   Product catalog — one source of truth for Sell (POS) and Inventory.
   `stock` maps a location name to units on hand; `reorderLevel` drives the
   low-stock threshold per product.
--------------------------------------------------------------------------- */
export const PRODUCTS = [
  {
    id: 'P-0001',
    sku: 'I360-0001',
    name: 'Essential Hoodie',
    category: 'Apparel',
    icon: 'shirt',
    price: 58.0,
    reorderLevel: 15,
    stock: { 'Main Store': 26, 'Downtown Store': 9, 'Texas Warehouse': 44 },
    updated: 'Apr 28, 2024',
  },
  {
    id: 'P-0002',
    sku: 'I360-0002',
    name: 'Classic Denim Jacket',
    category: 'Apparel',
    icon: 'shirt',
    price: 92.0,
    reorderLevel: 15,
    stock: { 'Main Store': 4, 'Downtown Store': 3, 'Texas Warehouse': 6 },
    updated: 'Apr 25, 2024',
  },
  {
    id: 'P-0003',
    sku: 'I360-0003',
    name: 'Plain Cotton Tee',
    category: 'Apparel',
    icon: 'shirt',
    price: 24.0,
    reorderLevel: 25,
    stock: { 'Main Store': 48, 'Downtown Store': 22, 'Texas Warehouse': 0 },
    updated: 'Apr 27, 2024',
  },
  {
    id: 'P-0004',
    sku: 'I360-0004',
    name: 'Merino Crew Sweater',
    category: 'Apparel',
    icon: 'shirt',
    price: 76.0,
    reorderLevel: 12,
    stock: { 'Main Store': 21, 'Downtown Store': 9, 'Texas Warehouse': 18 },
    updated: 'Apr 22, 2024',
  },
  {
    id: 'P-0005',
    sku: 'I360-0005',
    name: 'Leather Chelsea Boots',
    category: 'Footwear',
    icon: 'boots',
    price: 148.0,
    reorderLevel: 8,
    stock: { 'Main Store': 6, 'Downtown Store': 11, 'Texas Warehouse': 26 },
    updated: 'Apr 28, 2024',
  },
  {
    id: 'P-0006',
    sku: 'I360-0006',
    name: 'Canvas Low-Top Sneakers',
    category: 'Footwear',
    icon: 'boots',
    price: 74.0,
    reorderLevel: 12,
    stock: { 'Main Store': 18, 'Downtown Store': 4, 'Texas Warehouse': 30 },
    updated: 'Apr 26, 2024',
  },
  {
    id: 'P-0007',
    sku: 'I360-0007',
    name: 'Aviator Sunglasses',
    category: 'Accessories',
    icon: 'glasses',
    price: 86.0,
    reorderLevel: 10,
    stock: { 'Main Store': 12, 'Downtown Store': 15, 'Texas Warehouse': 38 },
    updated: 'Apr 23, 2024',
  },
  {
    id: 'P-0008',
    sku: 'I360-0008',
    name: 'Minimalist Steel Watch',
    category: 'Accessories',
    icon: 'watch',
    price: 129.0,
    reorderLevel: 6,
    stock: { 'Main Store': 9, 'Downtown Store': 5, 'Texas Warehouse': 17 },
    updated: 'Apr 27, 2024',
  },
  {
    id: 'P-0009',
    sku: 'I360-0009',
    name: 'Canvas Tote Bag',
    category: 'Accessories',
    icon: 'bag',
    price: 45.0,
    reorderLevel: 20,
    stock: { 'Main Store': 32, 'Downtown Store': 18, 'Texas Warehouse': 0 },
    updated: 'Apr 21, 2024',
  },
  {
    id: 'P-0010',
    sku: 'I360-0010',
    name: 'Cashmere Scarf',
    category: 'Accessories',
    icon: 'scarf',
    price: 68.0,
    reorderLevel: 8,
    stock: { 'Main Store': 3, 'Downtown Store': 7, 'Texas Warehouse': 21 },
    updated: 'Apr 20, 2024',
  },
  {
    id: 'P-0011',
    sku: 'I360-0011',
    name: 'Slim Leather Wallet',
    category: 'Accessories',
    icon: 'wallet',
    price: 39.0,
    reorderLevel: 15,
    stock: { 'Main Store': 24, 'Downtown Store': 10, 'Texas Warehouse': 28 },
    updated: 'Apr 25, 2024',
  },
  {
    id: 'P-0012',
    sku: 'I360-0012',
    name: 'Quilted Backpack',
    category: 'Accessories',
    icon: 'backpack',
    price: 96.0,
    reorderLevel: 10,
    stock: { 'Main Store': 11, 'Downtown Store': 0, 'Texas Warehouse': 19 },
    updated: 'Apr 24, 2024',
  },
  {
    id: 'P-0013',
    sku: 'I360-0013',
    name: 'Studio Headphones',
    category: 'Electronics',
    icon: 'headphones',
    price: 119.0,
    reorderLevel: 8,
    stock: { 'Main Store': 0, 'Downtown Store': 0, 'Texas Warehouse': 0 },
    updated: 'Apr 19, 2024',
  },
  {
    id: 'P-0014',
    sku: 'I360-0014',
    name: 'Portable Speaker',
    category: 'Electronics',
    icon: 'speaker',
    price: 89.0,
    reorderLevel: 10,
    stock: { 'Main Store': 5, 'Downtown Store': 2, 'Texas Warehouse': 0 },
    updated: 'Apr 22, 2024',
  },
]

/* ---------------------------------------------------------------------------
   Transfer card data
--------------------------------------------------------------------------- */
export const transfer = {
  id: 'TRF-2024-1187',
  description: 'You have 1 transfer waiting to be received',
  productName: 'Classic Denim Jacket',
  quantity: '20 pcs',
  from: 'Texas warehouse',
  to: 'Main Store',
  expectedDate: 'Apr 28, 2024',
  status: 'Waiting to be received',
}

/* ---------------------------------------------------------------------------
   Purchase orders data — 6 dispatched apparel orders
   `icon` keys map to Lucide icons inside the UI component.
--------------------------------------------------------------------------- */
export const purchaseOrders = [
  { id: 'ORD-4412', name: 'Essential Hoodie', qty: '24 pcs', from: 'Main Store', icon: 'shirt' },
  { id: 'ORD-4413', name: 'Leather Chelsea Boots', qty: '18 pcs', from: 'Downtown Store', icon: 'boots' },
  { id: 'ORD-4414', name: 'Aviator Sunglasses', qty: '30 pcs', from: 'Main Store', icon: 'glasses' },
  { id: 'ORD-4415', name: 'Minimalist Steel Watch', qty: '12 pcs', from: 'Texas warehouse', icon: 'watch' },
  { id: 'ORD-4416', name: 'Canvas Tote Bag', qty: '40 pcs', from: 'Downtown Store', icon: 'bag' },
  { id: 'ORD-4417', name: 'Cashmere Scarf', qty: '10 pcs', from: 'Texas warehouse', icon: 'scarf' },
]

export const purchaseOrdersSummary = {
  description: 'You have 6 dispatched orders waiting to be received',
}

/* ---------------------------------------------------------------------------
   Navigation model for the sidebar
--------------------------------------------------------------------------- */
export const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'sell', label: 'Sell', icon: 'sell' },
  { id: 'ecommerce', label: 'Online Store', icon: 'ecommerce' },
  { id: 'reporting', label: 'Reporting', icon: 'reporting', badge: 2 },
  { id: 'catalog', label: 'Catalog', icon: 'catalog' },
  { id: 'inventory', label: 'Inventory', icon: 'inventory' },
  { id: 'customers', label: 'Customers', icon: 'customers' },
  { id: 'setup', label: 'Setup', icon: 'setup' },
]

/* ---------------------------------------------------------------------------
   Top-level dashboardData export (kept for convenience / future pages)
--------------------------------------------------------------------------- */
export const dashboardData = {
  monthlySales: 8619.86,
  previousMonthDifference: 1780.24,
  averageSaleValue: 48.68,
  averageItemsPerSale: 2.8,
  outletSales: outletSalesMonth,
  sales: salesMonth,
  transfer,
  purchaseOrders,
}