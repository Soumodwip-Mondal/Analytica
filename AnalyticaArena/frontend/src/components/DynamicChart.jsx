import {BarChart, Bar, LineChart, Line, PieChart, Pie, ScatterChart, Scatter, 
        XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Cell
} from 'recharts'

export default function DynamicChart({config, data, gridColor, axisColor, legendColor, CustomTooltip}) {
    const {type, xAxis, yAxis, color, showGrid, showLegend} = config 

    // const common ={
    //     data,
    // }
    const COLORS = ['#f97316', '#ea580c', '#fb923c', '#ec4899', '#f472b6', '#fb7185', '#fdba74', '#c2410c']
    switch(type) {
        case 'bar' :
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6}/>}
                        <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <YAxis stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }}/>}
                        <Bar dataKey="y" fill={color || "#f97316"} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                
            )
        case 'line' :
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6}/>}
                        <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <YAxis stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <Tooltip content={<CustomTooltip />} />
                        {showLegend && <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }}/>}
                        <Line type="monotone" dataKey="y" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 5 }} activeDot={{ r: 7 }}/>
                    </LineChart>
                </ResponsiveContainer>
            )
    
    case 'pie' :
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie 
                        data={data} 
                        cx = "50%"
                        cy = "50%"
                        labelLine = {false}
                        label={({name, percent}) => `${name}: ${(percent *100).toFixed(0)}%`} 
                        outerRadius={100} 
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                <Tooltip content={<CustomTooltip/>}/>
                    </PieChart>
                </ResponsiveContainer>
                
            )
    case 'scatter' :
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6}/>}
                        <XAxis dataKey="x" stroke={axisColor} name="XAxis" style={{ fontSize: '12px' }}/>
                        <YAxis dataKey="y" stroke={axisColor} name="YAxis" style={{ fontSize: '12px' }}/>
                        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                        {showLegend && <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }}/>}
                        <Scatter name="Data Points" data={data} fill={color || "#fb923c"} />
                    </ScatterChart>
                </ResponsiveContainer>
            )
    case 'histogram' :
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.6}/>}
                        <XAxis dataKey="x" stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <YAxis stroke={axisColor} style={{ fontSize: '12px' }}/>
                        <Tooltip content={<CustomTooltip />} />
                        {/* <Legend wrapperStyle={{ color: legendColor, fontSize: '12px' }}/> */}
                        <Bar dataKey="y" fill={color || "#ea580c"} radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )
    default:
        return <div>Unsupported chart</div>
    }   
}