import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ChartTooltip from '../charts/ChartTooltip.jsx'

/** Olive ramp — the dominant channel reads deepest, the smallest reads palest. */
const RAMP = ['#181818', '#4A4A32', '#8C8D40', '#B6B66A']

/**
 * Revenue by sales channel, as a horizontal bar chart.
 * Shares the olive palette so it sits alongside the revenue area chart.
 */
export default function ChannelBreakdownChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 12, left: 4, bottom: 0 }}
        barCategoryGap="28%"
      >
        <CartesianGrid horizontal={false} stroke="#EDEFE6" />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
        />
        <YAxis
          type="category"
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          width={112}
          tick={{ fill: '#4D4E4A', fontSize: 11.5 }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: '#F3F5ED' }} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((channel, index) => (
            <Cell key={channel.name} fill={RAMP[index % RAMP.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
