import { MoreHorizontal } from 'lucide-react'
import { Button } from './button'

interface SalesDataPoint {
  date: string
  sales: number
  orders: number
}

interface SalesChartProps {
  data?: SalesDataPoint[]
  period?: '7d' | '30d' | '90d'
  className?: string
}

// Mock data for demonstration
const generateMockData = (days: number): SalesDataPoint[] => {
  const data: SalesDataPoint[] = []
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    // Generate realistic mock sales data
    const baseOrders = Math.floor(Math.random() * 15) + 5 // 5-20 orders per day
    const avgOrderValue = 3500 + Math.random() * 2000 // ₦3,500-₦5,500 average
    const sales = baseOrders * avgOrderValue

    data.push({
      date: date.toISOString().split('T')[0],
      sales,
      orders: baseOrders,
    })
  }

  return data
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string, period = '7d') => {
  const date = new Date(dateString)
  if (period === '7d') {
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function SalesChart({ data, period = '7d', className = '' }: SalesChartProps) {
  const chartData = data || generateMockData(period === '7d' ? 7 : period === '30d' ? 30 : 90)

  const maxSales = Math.max(...chartData.map((d) => d.sales))
  const minSales = Math.min(...chartData.map((d) => d.sales))
  const salesRange = maxSales - minSales

  const chartWidth = 600
  const chartHeight = 200
  const padding = { top: 20, right: 40, bottom: 40, left: 60 }
  const innerWidth = chartWidth - padding.left - padding.right
  const innerHeight = chartHeight - padding.top - padding.bottom

  // Calculate points for the line
  const points = chartData.map((item, index) => {
    const x = padding.left + (index / (chartData.length - 1)) * innerWidth
    const y = padding.top + ((maxSales - item.sales) / salesRange) * innerHeight
    return { x, y, ...item }
  })

  // Create path for area fill
  const areaPath = `
    M ${points[0].x} ${chartHeight - padding.bottom}
    ${points.map((p) => `L ${p.x} ${p.y}`).join(' ')}
    L ${points[points.length - 1].x} ${chartHeight - padding.bottom}
    Z
  `

  // Create path for line
  const linePath = `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')}`

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Sales over time</h3>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="text-sm">
            Last {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full h-auto"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
            </pattern>
          </defs>
          <rect
            x={padding.left}
            y={padding.top}
            width={innerWidth}
            height={innerHeight}
            fill="url(#grid)"
          />

          {/* Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + ratio * innerHeight
            const value = maxSales - ratio * salesRange
            return (
              <g key={i}>
                <line
                  x1={padding.left - 5}
                  y1={y}
                  x2={padding.left}
                  y2={y}
                  stroke="#9ca3af"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y}
                  textAnchor="end"
                  dy="0.35em"
                  className="text-xs fill-gray-500"
                >
                  {formatCurrency(value).replace('NGN', '₦')}
                </text>
              </g>
            )
          })}

          {/* X-axis labels */}
          {points
            .filter((_, i) => period === '7d' || i % Math.ceil(points.length / 6) === 0)
            .map((point, i) => (
              <text
                key={i}
                x={point.x}
                y={chartHeight - padding.bottom + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {formatDate(point.date, period)}
              </text>
            ))}

          {/* Area fill */}
          <path d={areaPath} fill="rgb(34, 197, 94)" fillOpacity="0.1" />

          {/* Line */}
          <path d={linePath} fill="none" stroke="rgb(34, 197, 94)" strokeWidth="2" />

          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="rgb(34, 197, 94)"
                className="hover:r-6 cursor-pointer transition-all"
              />
              {/* Tooltip on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity">
                <rect
                  x={point.x - 50}
                  y={point.y - 35}
                  width="100"
                  height="25"
                  fill="black"
                  fillOpacity="0.8"
                  rx="4"
                />
                <text
                  x={point.x}
                  y={point.y - 20}
                  textAnchor="middle"
                  className="text-xs fill-white"
                >
                  {formatCurrency(point.sales).replace('NGN', '₦')}
                </text>
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.sales, 0)).replace(
              'NGN',
              '₦'
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-lg font-semibold text-gray-900">
            {chartData.reduce((sum, item) => sum + item.orders, 0)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Avg. Order Value</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(
              chartData.reduce((sum, item) => sum + item.sales, 0) /
                chartData.reduce((sum, item) => sum + item.orders, 0)
            ).replace('NGN', '₦')}
          </p>
        </div>
      </div>
    </div>
  )
}
