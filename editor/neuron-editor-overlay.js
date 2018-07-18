const d3 = require("d3")

var drawOverlay = function(container, x, y) {
    const overlayDatum = {
        "x": 50,
        "y": 50,
        "r": 20
    }
    // const transformSetter = d3Transform.transform()
    //     .translate((d) => ([d.x, d.y]))
    // allow only one overlay
    overlayContainer = container.data([overlayDatum])
        .append("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", "red")
}

var selectNeuron = function (d) {
    if (!d.selected) {
        let neuronContainer = d3.select("#n" + d.id)
        drawOverlay(neuronContainer, d.x, d.y)
        d.selected = true
    }
}


module.exports = selectNeuron