var d3 = require("d3")

var synapsePathSetter = function(container, d) {
    let pathSetter = d3.path()
    pathSetter.moveTo(container.datum().x, container.datum)
}

var startSynapse = function (container, d) {
    let lineData = [{
        "x": container.datum().x,
        "y": container.datum().y
    },
{
    "x": container.datum().x + d3.mouse(container.node())[0],
    "y": container.datum().y + d3.mouse(container.node())[1]
}]
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
    // start synapse from the node data d
    lineContainer = d3.select("svg")
        .append("g")
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        // .append("path").attr("d", (d) => synapsePathSetter(container, d))
        .append("path").datum(lineData).attr("d", line)
    
}

module.exports = startSynapse