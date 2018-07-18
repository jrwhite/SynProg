const d3 = require("d3")
const {getNodePoints} = require("./neuron-drawing-utils.js")

var drawOverlay = function(container) {
    const deleteData = {
        "x": 50,
        "y": -50,
        "r": 10
    }

    const overlayData = {
        "x": getNodePoints(container.datum())[0].x,
        "y": getNodePoints(container.datum())[0].y,
        "r": 5
    }

    deleteContainer = container.data([deleteData])
        .append("circle")
        .classed("overlay delete", true)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.r)
        .attr("fill", "red")
        .on("click", (d) => container.remove())

    axonNodeContainer = container.data([overlayData])
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
        drawOverlay(d3.select("#n" + d.id))
        d.selected = true
    }
}

module.exports = neuronClickSetter