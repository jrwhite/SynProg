var d3 = require("d3")
const {remote} = require('electron')

var mouseMove = function(e) {
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    points = d3.select(".synapse").select("path").datum()
    points[1].x = (e.clientX - points[0].x) > 0 ? e.clientX - 10 : e.clientX + 10
    points[1].y = (e.clientY - points[0].y) > 0 ? e.clientY - 10 : e.clientY + 10

    // d3.select(".synapse").select("path").datum()[1].x = e.clientX
    // d3.select(".synapse").select("path").datum()[1].x = 10
    // d3.select(".synapse").select("path").datum()[1].y = e.clientY
    // d3.select(".synapse").select("path").datum()[1].y = 10
    d3.select(".synapse").select("path").attr("d", line)
}

var startSynapse = function (container, d) {
    let lineData = [{
            "x": container.datum().x + d.cx,
            "y": container.datum().y + d.cy
        },
        {
            "x": 0,
            "y": 0
        }
    ]

    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    lineContainer = d3.select("svg")
        .append("g")
        .classed("synapse", true)
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .append("path").datum(lineData).attr("d", line)
    
    window.addEventListener("mousemove", mouseMove, false)

    container.classed("presyn", true)
}

var prepMakeSynapse = function (container) {
    container.classed("postyn", true)
    preNeuron = d3.select(".presyn")
    axonNode = d3.select(".presyn").selectAll(".axon").data()[0]
    dendNode = container.selectAll(".dend").data()[0]
    axonPosition = {
        "x": preNeuron.datum().x + axonNode.cx,
        "y": preNeuron.datum().y + axonNode.cy
    }
    dendPosition = {
        "x": container.datum().x + dendNode.cx,
        "y": container.datum().y + dendNode.cy
    }
    let lineData = [
        {
            "x": axonPosition.x,
            "y": axonPosition.y
        },
        {
            "x": dendPosition.x,
            "y": dendPosition.y
        }
    ]
    console.log(lineData)
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    container.on("click", (d) => {
        console.log("click")
        window.removeEventListener("mousemove", mouseMove, false)
        d3.select(".synapse").select("path").datum(lineData).attr("d", line)
    })
}

module.exports = {
    startSynapse: startSynapse,
    prepMakeSynapse: prepMakeSynapse
}