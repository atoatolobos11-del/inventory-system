import OutletSalesChart from '../charts/OutletSalesChart.jsx'
import { formatCurrency, formatNumber } from '../../data/dashboardData.js'

/**
 * Large monthly overview card:
 * left KPI → center "All Outlets" chart → right KPI column.
 */
export default function OverviewCard({ data }) {
  return (
    <section className="rounded-2xl border border-line bg-card shadow-card">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,250px)]">
        {/* Left KPI */}
        <div className="flex flex-col justify-center p-6 lg:pr-4">
          <p className="text-[13px] font-medium leading-snug text-muted">{data.overviewTitle}</p>
          <p className="mt-2 text-[32px] font-bold leading-none tracking-tight text-text">
            {formatCurrency(data.overviewValue)}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted">{data.overviewSupport}</p>
        </div>

        {/* Center chart */}
        <div className="border-y border-line/70 px-6 pb-3 pt-5 lg:border-x lg:border-y-0 lg:px-8">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-muted">
            All Outlets
          </p>
          <div className="mt-1 h-[260px]">
            <OutletSalesChart data={data.outletSales} />
          </div>
        </div>

        {/* Right KPIs */}
        <div className="flex flex-col justify-center gap-5 p-6">
          <div>
            <p className="text-xs font-medium leading-tight text-muted">Average Sale Value</p>
            <p className="mt-1.5 text-[22px] font-bold leading-none tracking-tight text-text">
              {formatCurrency(data.averageSaleValue)}
            </p>
          </div>
          <div className="border-t border-line/70 pt-5">
            <p className="text-xs font-medium leading-tight text-muted">Average Items per Sale</p>
            <p className="mt-1.5 text-[22px] font-bold leading-none tracking-tight text-text">
              {formatNumber(data.averageItemsPerSale, 1)}
            </p>
            <p className="mt-2 text-[11px] leading-snug text-muted">{data.rightSupport}</p>
          </div>
        </div>
      </div>
    </section>
  )
}