var d3 = require("d3")
var d3Shape = require("d3-shape")

var createSvg = function () {
    var arcData = [
        { "length": 50, "eccentricity": 2}
    ]
    
    var arcFunction = d3.arc()
        // .innerRadius(function(d) { return d.length })
        .innerRadius(0)
        // .outerRadius(function(d) { return d.length })
        .outerRadius(50)
        .startAngle(0)
        .endAngle(Math.PI / 2)

    var svgContainer = d3.select("body").append("svg")
        .attr("width", 200)
        .attr("height", 200)
    
    var arcPath = svgContainer.append("path")
        .datum({
            "length": 50,
            "ecc": 2
        })
        .attr("d", arcFunction)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
}

function arcSetter(d) {
    var rMaj = d.length,
        rMin = 0 // debug
    
    console.log(rMaj)
    
    var arc = d3.arc()
        .innerRadius(rMin)
        .outerRadius(rMaj)
        .startAngle(0)
        .endAngle(Math.PI / 2)
    
    return arc
}

createSvg()