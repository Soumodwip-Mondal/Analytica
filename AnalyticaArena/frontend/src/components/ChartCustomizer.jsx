import {useState, useEffect} from 'react';

export default function ChartCustomizer({config, columns, onApply, onReset, onDownload}) {
    const [localConfig, setLocalConfig] = useState(config)

    const COLORS = ['#f97316', '#ea580c', '#fb923c', '#ec4899', '#f472b6', '#fb7185', '#fdba74', '#c2410c']

    const update=(key, value)=>{
        setLocalConfig(prev=>({...prev, [key]:value}))

    }
    useEffect(() => {
        setLocalConfig(config);

    },[config]);

    //taiwlind classes for consistent UI
    const selectClass = "bg-slate-800/50 border border-slate-600 text-white text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 transition-all";
    const labelClass = "flex items-center gap-2 text-slate-300 text-sm cursor-pointer hover:text transition-colors";
    const btnSecondary = "px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all active:scale-95 border border-slate-600";
    const btnPrimary="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium transition-all active:scale-95 shadow-lg shadow-orange-900/20";

    return (
        <div className="glass-card mt-4 p-5 space-y-4 border border-slate-700/50 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/*Chart Type */}
                <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Chart Type</label>
                {/* </div> */}
            <select 
                className={selectClass}
                value={localConfig.type || 'bar'}
                onChange={e=> update('type', e.target.value)}
            >
                <option value="">Select Column</option>
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
                <option value="scatter">Scatter</option>
                <option value="histogram">Histogram</option>
            </select>

            </div>
            
            
            {/*Aggregation */}
            <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Aggregation</label>
            <select 
                className={selectClass}
                value={localConfig.aggregation || 'sum'}
                onChange={e=> update('aggregation', e.target.value)}
            >
                {/* <option value="">Select Column</option> */}
                <option value="sum">Sum</option>
                <option value="mean">Average</option>
                <option value="count">Count</option>
                <option value="min">Min</option>
                <option value="max">Max</option>
            </select>
            </div>

            {/* X Axis */}
            <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">X-Axis Column</label>
            <select 
                className={selectClass}
                value={localConfig.xAxis || ''}
                onChange={e => update('xAxis', e.target.value)}
            >
                <option value="">Select Column</option>
                {columns.map(col => <option key={col}>{col}</option>)}
            </select>
            </div>

            {/* Y Axis */}
            <div className="space-y-1">
                    <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Y-Axis Column</label>
            <select 
                className={selectClass}
                value={localConfig.yAxis || ''}
                onChange={e => update('yAxis', e.target.value)}>
                <option value="">Select Column</option>
                {columns.map(col => <option key={col}>{col}</option>)}
            </select>
            </div>
            </div>

            {/* Toggles & Color Palette */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
            <div className="flex gap-4">
            <label className={labelClass}>
                 <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                    checked={localConfig.showGrid || false}
                    onChange={e => update('showGrid', e.target.checked)}
                />
                Grid
            </label>

           
            <label  className={labelClass}>
                 <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-orange-500 focus:ring-orange-500"
                    checked={localConfig.showLegend || false}
                    onChange={e => update('showLegend', e.target.checked)}
                />
                Legend
            </label>
        </div>

           {/* Buttons */}
           <div className="flex gap-2 p-1 bg-slate-800/80 rounded-full border border-slate-700">
                {COLORS.map(c => (
                    <button 
                        key={c}
                        onClick={() => update('color',c)}
                        style={{background:c}}
                        className={`w-5 h-5 rounded-full transition-transform hover:scale-125 ${localConfig.color === c ? 'ring-2 ring-white scale-110' : ''}`}
                        title={c}
                    />
                ))}
            </div>
           </div>

           {/* Action Buttons */}
           <div className="flex justify-between items-center pt-2">
                <button onClick={onDownload} className={btnSecondary}>
                    <span>⬇ PNG </span> 
                </button>
           <div className="flex justify-between items-center pt-2">
                <button onClick={onReset} className="text-slate-400 hover:text-white px-4 py-2 transition-colors text-sm">
                    Reset Defaults
                </button>
                <button onClick={()=> onApply(localConfig)}  className={btnPrimary}>
                    Apply Changes 
                </button>
           </div>
           </div>
        </div>
    )
}