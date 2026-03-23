export function transformData(rawdata, config) {
    const {type, xAxis, yAxis, aggregation} = config

    if (type === 'scatter') return transformScatter(rawdata, xAxis, yAxis, aggregation)
    if (type === 'pie') return transformPie(rawdata, xAxis, yAxis, aggregation)
    return transformAggregate(rawdata, xAxis, yAxis, aggregation)
}
//function for bar,line, histogram
function transformAggregate(data, xAxis, yAxis, aggregation){
const groups={};
for(const row of data){
    //add fallback key as Unknown
    const key = row[xAxis] || "Unknown"
    const value = Number(row[yAxis])

    if(!groups[key])
        groups[key] = []
    //check for valid number as value
    if(typeof(value)=== 'number' && !isNaN(value)){
        groups[key].push(value)
    }
    
}
let result=[]
for(const key in groups){
    const values = groups[key]
    let y;
    //add check for values length
    if(values.length === 0){
        result.push({x: key, y: 0})
        continue
    }
    else if(aggregation === "sum")
        y = values.reduce((acc, val)=> acc+val,0)
    else if(aggregation === "mean")
        y = values.reduce((acc,val)=>acc+val,0) / values.length
    else if(aggregation === "count")
        y = values.length
    else if(aggregation === "min")
        y = Math.min(...values)
    else if(aggregation === "max")
        y = Math.max(...values)
    //if aggregation is missing use, "sum"
    else 
        y= values.reduce((acc, val)=> acc+val,0)
    
    result.push({x: key, y: y})

} 
return result
}
function transformScatter(rawdata, xAxis, yAxis){
    return rawdata.map(row => ({
        //add fallback for row[xAxis]
        x: Number(row[xAxis]) || 0,
        y: row[yAxis]
    }))
}
function transformPie(rawdata, xAxis){
    const count = {}
    
    for( const row of rawdata){
        //add fallback for key as Unknown
        const key = row[xAxis] || "Unknown"
    
        if(!count[key]){
            count[key] = 0
        } 
            
        count[key]+=1
    }
    let result = []
    for(const key in count){
        result.push({name: key, value: count[key]})
    }
    return result
}