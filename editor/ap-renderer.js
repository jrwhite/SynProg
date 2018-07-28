var d3 = require("d3")
const {remote} = require('electron')

setImmediate(() => console.log(module))

var drawAp = function (id, startPoint, endPoint) {
    let apData = [{
        "startX": startPoint.x,
        "startY": startPoint.y,
        "endX": endPoint.x,
        "endY": endPoint.y,
        "r": 5,
        "id": id
    }]

    // create ap element
    let apContainer = d3.select("svg").append("circle")
        .data(apData)
        .classed("ap", true)
        .attr("cx", (d) => d.startX)
        .attr("cy", (d) => d.startY)
        .attr("r", (d) => d.r)
        .attr("id", (d) => d.id)
        .attr("fill", "blue")
    
    let apTransition = apContainer.transition()
        .attr("cx", (d) => d.endX)
        .attr("cy", (d) => d.endY)
        .remove()
}

var fireAp = function (neuronData) {
    neuronData.synapses.map((synapseId) => {
        d3.select("#" + synapseId).call((s) => {
                console.log(neuronData)
                console.log(s.selectAll("path").datum())
            drawAp(
                neuronData.id,
                // maybe just do s.select("path").datum()
                s.selectAll("path").datum()[0],
                s.selectAll("path").datum()[1]
            )
        })
    })
}

module.exports = {
    drawAp: drawAp,
    fireAp: fireAp 
}