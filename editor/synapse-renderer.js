var d3 = require("d3")
const {remote} = require('electron')

var startSynapseUpdater = function (lineData) {
    window.addEventListener("mousemove", (e) => {
    console.log('mouse')
        e.preventDefault()
        lineData[1].x = e.x
        lineData[1].y = e.y
    })
}

var startSynapse = function (container, d) {
    let lineData = [{
        "x": container.datum().x,
        "y": container.datum().y
    },
{
    // "x": container.datum().x + d3.mouse(container.node())[0],
    // "y": container.datum().y + d3.mouse(container.node())[1]
    "x": 50,
    "y": 50
}]
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
    // start synapse from the node data d
    lineContainer = d3.select("svg")
        .append("g")
        .classed("synapse", true)
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .append("path").datum(lineData).attr("d", line)
        .on("mousemove", (d, i) => {
            console.log(d)
            d.x = lineData[i].x
            d.y = lineData[i].y
        })
    
    window.addEventListener("mousemove", (e) => {
        lineData[1].x = e.clientX
        lineData[1].y = e.clientY
        d3.select(".synapse").select("path").attr("d", line)
    })
}

module.exports = startSynapse