import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from '../charts/ChartTooltip.jsx'

/**
 * Online revenue trend — cumulative-ish area chart for the active period.
 * Mirrors OutletSalesChart's visual language (olive stroke, light fill) but
 * auto-scales its Y axis to the period's own range.
 */
export default function OnlineRevenueChart({ data }) {
  const max = data.reduce((peak, point) => Math.max(peak, point.value), 0)
  // Four round ticks between zero and the series max.
  const step = max > 0 ? Math.ceil(max / 4 / 100) * 100 : 100
  const ticks = [0, step, step * 2, step * 3, step * 4].filter((t) => t <= max + step * 0.5)

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 4, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="onlineRevenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EDEED9" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#EDEED9" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="#EDEFE6" />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          interval="preserveStartEnd"
          minTickGap={28}
        />
        <YAxis
          domain={[0, ticks[ticks.length - 1]]}
          ticks={ticks}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
          width={52}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#C9C8BD', strokeDasharray: '3 3' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8C8D40"
          strokeWidth={2}
          fill="url(#onlineRevenueFill)"
          activeDot={{ r: 4, fill: '#8C8D40', stroke: '#FFFFFF', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
