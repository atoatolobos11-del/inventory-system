/* ---------------------------------------------------------------------------
   E-commerce (online store) mock data.

   Merchant-facing view of the online shop: revenue, orders, sales channels,
   conversion funnel, fulfilment and top sellers. No backend, no persistence.

   Modelled on the retail dashboard's `periods` shape so the existing header
   period filter drives this page too. Product-level figures reference the
   shared catalog in `dashboardData.js` so both halves of the app agree.
   --------------------------------------------------------------------------- */

import { PRODUCTS } from './dashboardData.js'

export { formatCurrency, formatCurrencyShort, formatNumber } from './dashboardData.js'

/* ---------------------------------------------------------------------------
   Order fulfilment states + badge tones (same palette as STOCK_STATUS).
   --------------------------------------------------------------------------- */
export const ORDER_STATUS = {
  unfulfilled: { label: 'Unfulfilled', badge: 'bg-[#F7EDD2] text-[#7A5B12]' },
  processing: { label: 'Processing', badge: 'bg-olive-light text-sidebar' },
  shipped: { label: 'Shipped', badge: 'bg-[#E4EDF7] text-[#2A4A73]' },
  delivered: { label: 'Delivered', badge: 'bg-soft text-muted' },
  refunded: { label: 'Refunded', badge: 'bg-[#FBEFED] text-[#9A2B22]' },
}

/* ---------------------------------------------------------------------------
   Top sellers — merged onto catalog products so the online store reuses the
   same catalogue the POS and Inventory pages already render.
   --------------------------------------------------------------------------- */
const TOP_SELLER_STATS = {
  'P-0001': { units: 412, revenue: 23896, trend: 12.4 },
  'P-0005': { units: 268, revenue: 39664, trend: 8.1 },
  'P-0009': { units: 355, revenue: 15975, trend: -3.2 },
  'P-0008': { units: 141, revenue: 18189, trend: 5.7 },
  'P-0002': { units: 173, revenue: 15916, trend: 22.9 },
  'P-0006': { units: 296, revenue: 21904, trend: -6.8 },
  'P-0011': { units: 302, revenue: 11778, trend: 4.2 },
  'P-0010': { units: 164, revenue: 11152, trend: 1.9 },
}

/** Catalog products with online sales attached, strongest seller first. */
export const topProducts = Object.entries(TOP_SELLER_STATS)
  .map(([id, stats]) => {
    const product = PRODUCTS.find((p) => p.id === id)
    return product ? { ...product, ...stats } : null
  })
  .filter(Boolean)
  .sort((a, b) => b.revenue - a.revenue)

/* ---------------------------------------------------------------------------
   Recent online orders.
   `id` doubles as the customer's order reference.
   --------------------------------------------------------------------------- */
export const recentOrders = [
  {
    id: '#ORD-88214',
    customer: 'Amara Osei',
    email: 'amara.osei@fastmail.com',
    items: 3,
    total: 214.0,
    status: 'unfulfilled',
    channel: 'Online Store',
    placed: 'Apr 30, 9:42 AM',
    destination: 'Austin, TX',
  },
  {
    id: '#ORD-88213',
    customer: 'Liam Bergström',
    email: 'liam.b@example.com',
    items: 1,
    total: 148.0,
    status: 'processing',
    channel: 'Instagram',
    placed: 'Apr 30, 9:15 AM',
    destination: 'Portland, OR',
  },
  {
    id: '#ORD-88211',
    customer: 'Priya Raghunathan',
    email: 'priya.rag@hey.com',
    items: 2,
    total: 87.0,
    status: 'shipped',
    channel: 'Online Store',
    placed: 'Apr 30, 8:03 AM',
    destination: 'Brooklyn, NY',
  },
  {
    id: '#ORD-88208',
    customer: 'Tomas Delgado',
    email: 't.delgado@outlook.com',
    items: 4,
    total: 342.0,
    status: 'shipped',
    channel: 'Google Shopping',
    placed: 'Apr 29, 6:51 PM',
    destination: 'Miami, FL',
  },
  {
    id: '#ORD-88204',
    customer: 'Hana Kowalski',
    email: 'hana.k@proton.me',
    items: 2,
    total: 165.0,
    status: 'delivered',
    channel: 'Online Store',
    placed: 'Apr 29, 2:20 PM',
    destination: 'Chicago, IL',
  },
  {
    id: '#ORD-88201',
    customer: 'Marcus Adeyemi',
    email: 'marcus.a@gmail.com',
    items: 1,
    total: 119.0,
    status: 'unfulfilled',
    channel: 'TikTok Shop',
    placed: 'Apr 29, 11:38 AM',
    destination: 'Atlanta, GA',
  },
  {
    id: '#ORD-88196',
    customer: 'Sofia Marchetti',
    email: 'sofia.m@icloud.com',
    items: 3,
    total: 268.0,
    status: 'refunded',
    channel: 'Online Store',
    placed: 'Apr 28, 4:07 PM',
    destination: 'Denver, CO',
  },
]

/* ---------------------------------------------------------------------------
   Period-scoped figures. Keys match the retail `periods` labels so the header
   period control can drive this page without extra wiring.
   --------------------------------------------------------------------------- */
export const ecommercePeriods = {
  Today: {
    id: 'Today',
    metrics: {
      revenue: 1842.6,
      revenueDelta: 11.4,
      orders: 23,
      ordersDelta: 9.1,
      conversion: 2.84,
      conversionDelta: 0.3,
      averageOrderValue: 80.11,
      averageOrderValueDelta: 2.2,
      sessions: 810,
      returningShare: 38,
    },
    revenueSeries: [
      { date: '9 AM', value: 120 },
      { date: '11 AM', value: 385 },
      { date: '1 PM', value: 690 },
      { date: '3 PM', value: 1015 },
      { date: '5 PM', value: 1320 },
      { date: '7 PM', value: 1608 },
      { date: '9 PM', value: 1842.6 },
    ],
    channels: [
      { name: 'Online Store', value: 1248.9 },
      { name: 'Instagram', value: 268.4 },
      { name: 'Google Shopping', value: 187.2 },
      { name: 'TikTok Shop', value: 138.1 },
    ],
    funnel: [
      { stage: 'Sessions', value: 810 },
      { stage: 'Product views', value: 549 },
      { stage: 'Added to cart', value: 131 },
      { stage: 'Reached checkout', value: 62 },
      { stage: 'Purchased', value: 23 },
    ],
  },

  'This Week': {
    id: 'This Week',
    metrics: {
      revenue: 9642.15,
      revenueDelta: 18.7,
      orders: 118,
      ordersDelta: 14.2,
      conversion: 2.61,
      conversionDelta: 0.18,
      averageOrderValue: 81.71,
      averageOrderValueDelta: 3.9,
      sessions: 4521,
      returningShare: 34,
    },
    revenueSeries: [
      { date: 'Mon', value: 1120 },
      { date: 'Tue', value: 1465 },
      { date: 'Wed', value: 1288 },
      { date: 'Thu', value: 1912 },
      { date: 'Fri', value: 2015 },
      { date: 'Sat', value: 2104 },
      { date: 'Sun', value: 9642.15 },
    ],
    channels: [
      { name: 'Online Store', value: 6218.4 },
      { name: 'Instagram', value: 1502.3 },
      { name: 'Google Shopping', value: 1174.9 },
      { name: 'TikTok Shop', value: 746.55 },
    ],
    funnel: [
      { stage: 'Sessions', value: 4521 },
      { stage: 'Product views', value: 3080 },
      { stage: 'Added to cart', value: 742 },
      { stage: 'Reached checkout', value: 351 },
      { stage: 'Purchased', value: 118 },
    ],
  },

  'This Month': {
    id: 'This Month',
    metrics: {
      revenue: 38164.9,
      revenueDelta: 24.3,
      orders: 462,
      ordersDelta: 16.8,
      conversion: 2.48,
      conversionDelta: 0.41,
      averageOrderValue: 82.61,
      averageOrderValueDelta: 6.4,
      sessions: 18629,
      returningShare: 36,
    },
    revenueSeries: [
      { date: '1 Apr', value: 940 },
      { date: '4 Apr', value: 2140 },
      { date: '7 Apr', value: 3380 },
      { date: '10 Apr', value: 5120 },
      { date: '13 Apr', value: 6480 },
      { date: '16 Apr', value: 8270 },
      { date: '19 Apr', value: 9640 },
      { date: '22 Apr', value: 12180 },
      { date: '25 Apr', value: 15340 },
      { date: '28 Apr', value: 18960 },
      { date: '30 Apr', value: 38164.9 },
    ],
    channels: [
      { name: 'Online Store', value: 24385.2 },
      { name: 'Instagram', value: 6218.7 },
      { name: 'Google Shopping', value: 4702.4 },
      { name: 'TikTok Shop', value: 2858.6 },
    ],
    funnel: [
      { stage: 'Sessions', value: 18629 },
      { stage: 'Product views', value: 12340 },
      { stage: 'Added to cart', value: 2986 },
      { stage: 'Reached checkout', value: 1412 },
      { stage: 'Purchased', value: 462 },
    ],
  },
}

/* ---------------------------------------------------------------------------
   Fulfilment queue — orders needing action, across every state.
   --------------------------------------------------------------------------- */
export const fulfilment = {
  awaitingShipment: 12,
  inTransit: 27,
  deliveredThisPeriod: 418,
  returnsOpen: 3,
  onTimeRate: 96.2,
  averageHandlingHours: 6.4,
}
