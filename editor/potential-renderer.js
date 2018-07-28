var d3 = require("d3")

var drawPotential = function (neuron) {
    let arc = d3.arc()

    const arcSetter = (d) => ({
        innerRadius: 0,
        outerRadius: 10,
        startAngle: 0,
        endAngle: (neuron.datum().potential / 100) * 2 * Math.PI
    })

    neuron.selectAll("path.potential")
        .data([neuron.datum()])
        .enter().append("path")
        .classed("potential", true)
        .attr("d", (d) => arc(arcSetter(d)))
        .attr("fill", "red")
}

module.exports = {
    drawPotential: drawPotential
}