import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../context/ThemeContext'

const COLORS = ['#f97316', '#ea580c', '#fb923c', '#ec4899', '#f472b6', '#fb7185', '#fdba74', '#c2410c']

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-card p-3 border border-slate-700/50 shadow-xl">
                <p className="text-slate-300 text-sm font-semibold mb-1">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-xs" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        )
    }
    return null
}

export default function ChartCard({ chart }) {
    const { theme } = useTheme()

    // Dynamic colors for Recharts SVG props based on the current theme
    const gridColor = theme === 'dark' ? '#334155' : '#d1d5db'
    const axisColor = theme === 'dark' ? '#94a3b8' : '#374151'
    const legendColor = theme === 'dark' ? '#cbd5e1' : '#111827'

    if (!chart || !chart.data || chart.data.length === 0) {
        return (
            <div className="glass-card p-6">
                <p className="text-slate-400">No data available for this chart</p>
            </div>
        )
    }

    const renderChart = () => {
        switch (chart.chart_type) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                            <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
                            <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
                            <Bar dataKey="y" fill="#f97316" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                            <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
                            <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
                            <Line type="monotone" dataKey="y" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} activeDot={{ r: 7 }} />
                        </LineChart>
                    </ResponsiveContainer>
                )

            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chart.data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chart.data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                )

            case 'scatter':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                            <XAxis dataKey="x" stroke={axisColor} name={chart.x_column} style={{ fontSize: '12px' }} />
                            <YAxis dataKey="y" stroke={axisColor} name={chart.y_column} style={{ fontSize: '12px' }} />
                            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                            <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
                            <Scatter name="Data Points" data={chart.data} fill="#fb923c" />
                        </ScatterChart>
                    </ResponsiveContainer>
                )

            case 'histogram':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chart.data}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
                            <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
                            <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="y" fill="#ea580c" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )

            default:
                return <p className="text-slate-400">Unsupported chart type: {chart.chart_type}</p>
        }
    }

    return (
        <div className="border-gray-500/40 glass-card p-6 fade-in-up hover:scale-105 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-2xl -z-10"></div>
            <div className="mb-5">
                <h3 className="text-lg font-bold text-white mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {chart.title}
                </h3>
                {chart.description && (
                    <p className="text-sm text-slate-400">{chart.description}</p>
                )}
            </div>
            {renderChart()}
        </div>
    )
}