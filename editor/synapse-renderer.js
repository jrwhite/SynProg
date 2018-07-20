var d3 = require("d3")
const {remote} = require('electron')

var mouseMove = function(e) {
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    points = d3.select(".synapse").select("path").datum()
    // offset line slightly to avoid accidentally clicking it
    points[1].x = (e.clientX - points[0].x) > 0 ? e.clientX - 10 : e.clientX + 10
    points[1].y = (e.clientY - points[0].y) > 0 ? e.clientY - 10 : e.clientY + 10

    d3.select(".synapse").select("path").attr("d", line)
}

var makeSynapse = function (d, synapseData) {
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
    // establish synapse and give it an id
    d3.select(".synapse").attr("id", 5).select("path").datum(synapseData).attr("d", line)
    // give presyn and postsyn synapse data
    let neuronData = [{
        synapses: [synapseData.id]
    }]
    d3.select(".presyn").data(neuronData).classed("presyn", false)
    d3.select(".postsyn").data(neuronData).classed("postsyn", false)
    window.removeEventListener("mousemove", mouseMove, false)
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

    const transformSetter = d3Transform.transform()
        .translate((d) => ([d.x, d.y]))

    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    lineContainer = d3.select("svg")
        .append("g")
        .classed("synapse", true)
        .attr("transform", transformSetter)
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
        makeSynapse(d, lineData)
    })
}

module.exports = {
    startSynapse: startSynapse,
    prepMakeSynapse: prepMakeSynapse
}