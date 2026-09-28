import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from './ChartTooltip.jsx'

/**
 * "All Outlets" — monthly overview trend.
 * Olive line, very light area fill, minimal axis treatment.
 */
export default function OutletSalesChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 4, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="outletAreaFill" x1="0" y1="0" x2="0" y2="1">
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
          domain={[0, 10000]}
          ticks={[0, 2500, 5000, 7500, 10000]}
          axisLine={false}
          tickLine={false}
          tickMargin={6}
          width={46}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#C9C8BD', strokeDasharray: '3 3' }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8C8D40"
          strokeWidth={2}
          fill="url(#outletAreaFill)"
          activeDot={{ r: 4, fill: '#8C8D40', stroke: '#FFFFFF', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}