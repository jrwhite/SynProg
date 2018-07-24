const d3 = require("d3")
const {getNodePoints} = require("./neuron-drawing-utils.js")

var drawDendOverlay = function(container) {
    console.log(container.datum().nodes)
    overlayData = container.datum().nodes
        .filter((n) => n.type == "dend")
        .map((dend, i) => (
            {
                "cx": getNodePoints(container.datum())[i+1].x,
                "cy": getNodePoints(container.datum())[i+1].y,
                "r": 5,
                "id": "d" + dend.id,
                "ghost": dend.synapses.length == 0 
            }
        ))

    dendNodeContainer = container.selectAll("circle")
        .data(overlayData)
        .enter().append("circle")
        .classed("overlay dend node", true)
        .classed("ghost", (d) => d.ghost)
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", (d) => d.r)
        .attr("id", (d) => d.id)
        .attr("fill", "red")
}

const {startSynapse} = require("./synapse-renderer.js")

var drawAxonOverlay = function(container) {
    axonData = container.datum().nodes.filter((n) => n.type == "axon")
        .map((ax) => (
            {
                "cx": getNodePoints(container.datum())[0].x,
                "cy": getNodePoints(container.datum())[0].y,
                "r": 5,
                "id": "a" + ax.id
            }
        ))

    console.log(axonData)

    axonOverlayContainer = container.append("circle")
        .data(axonData)
        .classed("overlay axon node", true)
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", (d) => d.r)
        .attr("id", (d) => d.id)
        .attr("fill", "red")
        .on("click", (d) => startSynapse(container, d))
}

var drawOverlay = function(container) {
    container.classed("overlayed", true)

    const deleteData = {
        "cx": 50,
        "cy": -50,
        "r": 10
    }

    deleteContainer = container.append("circle")
        .data([deleteData])
        .classed("overlay delete", true)
        .attr("cx", (d) => d.cx)
        .attr("cy", (d) => d.cy)
        .attr("r", (d) => d.r)
        .attr("fill", "red")
        .on("click", (d) => container.remove())

    drawAxonOverlay(container)
    drawDendOverlay(container)
}

var neuronClickSetter = function (d) {
    if (d.selected == false) {
        // reset overlay for previously selected neuron
        d3.selectAll(".overlay").remove()

        // draw overlay on selected neuron
        drawOverlay(d3.select("#n" + d.id))
        d.selected = true
    }
}

module.exports = {
    neuronClickSetter: neuronClickSetter,
    drawDendOverlay: drawDendOverlay
}