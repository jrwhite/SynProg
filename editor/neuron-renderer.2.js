var d3 = require("d3")
var d3Shape = require("d3-shape")

var createSvg = function () {
    var arcData = { "length": 50, "ecc": 2}
    
    var arcFunction = d3.arc()
        // .innerRadius(function(d) { return d.length })
        .innerRadius(0)
        // .outerRadius(function(d) { return d.length })
        .outerRadius((d,i) => (d.length))
        .startAngle(Math.PI / 2)
        .endAngle(3 * Math.PI / 2)

    var svgContainer = d3.select("body").append("svg")
        .attr("width", 200)
        .attr("height", 200)
    
    var arcPaths = svgContainer.selectAll("path")
        .data([arcData])
        .enter().append("path")
        .attr("d", arcFunction)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
}


createSvg()