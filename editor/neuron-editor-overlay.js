const d3 = require("d3")

var drawOverlay = function(container) {
    const overlayDatum = {
        "x": 50,
        "y": -50,
        "r": 10
    }

    overlayContainer = container.data([overlayDatum])
        .append("circle")
        .classed("overlay axon node", true)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", "red")
        .on("click", (d) => container.remove())
}


var neuronClickSetter = function (d) {
    if (!d.selected) {
        // reset overlay for previously selected neuron

        // draw overlay on selected neuron
        drawOverlay(d3.select("#n" + d.id), removeNeuron)
        d.selected = true
    }
}


module.exports = neuronClickSetter