var d3 = require("d3")
const {remote} = require('electron')

var mouseMove = function(e) {
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    d3.select(".synapse").select("path").datum()[1].x = e.clientX
    d3.select(".synapse").select("path").datum()[1].y = e.clientY
    d3.select(".synapse").select("path").attr("d", line)
}

var startSynapse = function (container, d) {
    let lineData = [{
            "x": container.datum().x,
            "y": container.datum().y
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
    axonNode = preNeuron.select(".axon")
    dendNode = container.select(".dend")
    axonPosition = {
        "x": preNeuron.datum().x + axonNode.datum().x,
        "y": preNeuron.datum().y + axonNode.datum().y
    }
    dendPosition = {
        "x": container.datum().x + dendNode.datum().x,
        "y": container.datum().y + dendNode.datum().y
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