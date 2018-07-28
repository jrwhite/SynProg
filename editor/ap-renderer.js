var d3 = require("d3")
const {remote} = require('electron')

setImmediate(() => console.log(module))

var drawAp = function (id, startPoint, endPoint, callback) {
    let apData = [{
        "startX": startPoint.x,
        "startY": startPoint.y,
        "endX": endPoint.x,
        "endY": endPoint.y,
        "r": 5,
        "id": id
    }]

    const length = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y)

    // create ap element
    let apContainer = d3.select("svg").append("circle")
        .data(apData)
        .classed("ap", true)
        .attr("cx", (d) => d.startX)
        .attr("cy", (d) => d.startY)
        .attr("r", (d) => d.r)
        .attr("id", (d) => d.id)
        .attr("fill", "blue")
    
    let transitionSetter = d3.transition()
        .duration(length * 5)
        .ease(d3.easeLinear)
        // DONT DELETE THIS
        // might be useful
        // .attrTween("transform", translateAlong(linePath.node()))
        .on("end", callback)

    let apTransition = apContainer.transition(transitionSetter)
        .attr("cx", (d) => d.endX)
        .attr("cy", (d) => d.endY)
        .remove()
}

var fireAp = function (neuronData, callback) {
    neuronData.nodes[0].synapses.map((synapseId) => {
        d3.select("#" + synapseId).call((s) => {
                console.log(neuronData)
                console.log(s.selectAll("path").datum())
            drawAp(
                neuronData.id,
                // maybe just do s.select("path").datum()
                s.selectAll("path").datum()[0],
                s.selectAll("path").datum()[1],
                () => {
                    console.log("ap received")
                    console.log(s.datum())
                    callback(d3.select("#n"+s.datum().postId).datum(), s.datum().weighting)
                }
            )
        })
    })
}

module.exports = {
    drawAp: drawAp,
    fireAp: fireAp 
}