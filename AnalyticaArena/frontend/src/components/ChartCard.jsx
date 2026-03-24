//import { BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../context/ThemeContext'
import { transformData } from '../utils/dataTransformer'
import {useState} from 'react';
import DynamicChart from './DynamicChart'
import ChartCustomizer from './ChartCustomizer'
import {useMemo, useRef} from 'react';
import html2canvas from 'html2canvas';

//const COLORS = ['#f97316', '#ea580c', '#fb923c', '#ec4899', '#f472b6', '#fb7185', '#fdba74', '#c2410c']



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
    const chartRef = useRef(null);
    //build config from backend
    const initialConfig = {
        type: chart.chart_type,
        xAxis: chart.x_column,
        yAxis: chart.y_column,
        aggregation: chart.aggregation || 'sum',
        color: '#f97316',
        showGrid: true,
        showLegend: true
    }
    const [config, setConfig] = useState(initialConfig)
    const [originalConfig] = useState(initialConfig)
    //const transformedData = transformData(chart.rawData, config)
    const [showCustomizer, setShowCustomizer] = useState(false)
    const { theme } = useTheme()

    
    // Dynamic colors for Recharts SVG props based on the current theme
    const gridColor = theme === 'dark' ? '#334155' : '#d1d5db'
    const axisColor = theme === 'dark' ? '#94a3b8' : '#374151'
    const legendColor = theme === 'dark' ? '#cbd5e1' : '#111827'

    // add fallback for data
    const rawData = Array.isArray(chart.rawData)
        ? chart.rawData
        : Array.isArray(chart.data)
        ? chart.data
        : []

    if (!chart) {
        return (
            <div className="glass-card p-6">
                <p className="text-slate-400">No chart data </p>
            </div>
        )
    }
    if (!rawData || rawData.length === 0) {
        return (
            <div className="glass-card p-6">
                <p className="text-slate-400">No raw data available </p>
            </div>
        )
    }
    //useMemo avoids recomputation on each render
    const transformedData = useMemo(() => {
        //if user didn't customize, use backend data
        if(!showCustomizer){
            return chart.data || []
        }
        //if customized, use raw data
        return transformData(rawData, config);
    },[rawData, config, showCustomizer, chart.data]);

    if(!transformedData || transformedData.length === 0){
        return (
            <div className="glass-card p-6">
                <p className="text-slate-400">
                    No usable data for this chart configuration
                </p>
            </div>
        )
    }
    const columns = rawData.length > 0
        ? Object.keys(rawData?.[0])
        : []
    const handleApply = (newConfig) => {
        setConfig(newConfig)
    }
    const handleReset = () => {
        setConfig(originalConfig || {})
    }
    // function to download image
    const handleDownload = async () => {
        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL();
        link.click();
    };
    const safeConfig = {
                type: 'bar',
                ...config
    }
    console.log("chart:", chart)
    console.log("config:", config)
    console.log("rawData:", rawData)
    console.log("transformedData:", transformedData)
    // const renderChart = () => {
    //     switch (chart.chart_type) {
    //         case 'bar':
    //             return (
    //                 <ResponsiveContainer width="100%" height={300}>
    //                     <BarChart data={chart.data}>
    //                         <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
    //                         <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <Tooltip content={<CustomTooltip />} />
    //                         <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
    //                         <Bar dataKey="y" fill="#f97316" radius={[8, 8, 0, 0]} />
    //                     </BarChart>
    //                 </ResponsiveContainer>
    //             )

    //         case 'line':
    //             return (
    //                 <ResponsiveContainer width="100%" height={300}>
    //                     <LineChart data={chart.data}>
    //                         <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
    //                         <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <Tooltip content={<CustomTooltip />} />
    //                         <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
    //                         <Line type="monotone" dataKey="y" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} activeDot={{ r: 7 }} />
    //                     </LineChart>
    //                 </ResponsiveContainer>
    //             )

    //         case 'pie':
    //             return (
    //                 <ResponsiveContainer width="100%" height={300}>
    //                     <PieChart>
    //                         <Pie
    //                             data={chart.data}
    //                             cx="50%"
    //                             cy="50%"
    //                             labelLine={false}
    //                             label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
    //                             outerRadius={100}
    //                             fill="#8884d8"
    //                             dataKey="value"
    //                         >
    //                             {chart.data.map((entry, index) => (
    //                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //                             ))}
    //                         </Pie>
    //                         <Tooltip content={<CustomTooltip />} />
    //                     </PieChart>
    //                 </ResponsiveContainer>
    //             )

    //         case 'scatter':
    //             return (
    //                 <ResponsiveContainer width="100%" height={300}>
    //                     <ScatterChart>
    //                         <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
    //                         <XAxis dataKey="x" stroke={axisColor} name={chart.x_column} style={{ fontSize: '12px' }} />
    //                         <YAxis dataKey="y" stroke={axisColor} name={chart.y_column} style={{ fontSize: '12px' }} />
    //                         <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
    //                         <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }} />
    //                         <Scatter name="Data Points" data={chart.data} fill="#fb923c" />
    //                     </ScatterChart>
    //                 </ResponsiveContainer>
    //             )

    //         case 'histogram':
    //             return (
    //                 <ResponsiveContainer width="100%" height={300}>
    //                     <BarChart data={chart.data}>
    //                         <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6} />
    //                         <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <YAxis stroke={axisColor} style={{ fontSize: '12px' }} />
    //                         <Tooltip content={<CustomTooltip />} />
    //                         <Bar dataKey="y" fill="#ea580c" radius={[8, 8, 0, 0]} />
    //                     </BarChart>
    //                 </ResponsiveContainer>
    //             )

    //         default:
    //             return <p className="text-slate-400">Unsupported chart type: {chart.chart_type}</p>
    //     }
    // }

    return (
        <div className="border-gray-500/40 glass-card p-6 fade-in-up hover:scale-105 transition-all duration-500 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300 rounded-2xl -z-10"></div>
            <div className="mb-5 flex justify-between items-start">
                <div>
                <h3 className="text-lg font-bold text-white mb-1 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {chart.title}
                </h3>
                {chart.description && (
                    <p className="text-sm text-slate-400">{chart.description}</p>
                )}
                </div>
                <button 
                    onClick={() => setShowCustomizer(prev => !prev)}
                    className="text-sm px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                >
               ⚙️ Customize
                </button>
            </div>
            
            <div ref={chartRef}>
                <DynamicChart 
                    config={safeConfig} 
                    data={transformedData}
                    gridColor = {gridColor}
                    axisColor = {axisColor}
                    legendColor={legendColor}
                    CustomTooltip={CustomTooltip}
            />
            </div>
            
            
            {columns.length > 0 && showCustomizer && (
                <ChartCustomizer 
                config={config} 
                columns={columns} 
                onApply={handleApply} 
                onReset={handleReset}
                onDownload={handleDownload}
            />
            )}
            
        </div>
    )
}
