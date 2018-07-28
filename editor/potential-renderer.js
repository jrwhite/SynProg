var d3 = require("d3")
const {fireAp} = require("./ap-renderer")

var drawPotential = function (neuronData) {
    let arc = d3.arc()

    const arcSetter = (d) => ({
        innerRadius: 0,
        outerRadius: 10,
        startAngle: 0,
        endAngle: (d.potential / 100) * 2 * Math.PI
    })

    d3.select("#n"+neuronData.id).selectAll("path.potential")
        .attr("d", (d) => arc(arcSetter(d)))
        .attr("fill", (d) => (d.potential >=0 ? "red" : "blue"))
        .data([neuronData])
        .enter().append("path")
        .classed("potential", true)
}

module.exports = {
    drawPotential: drawPotential
}