var d3 = require("d3")
const {remote} = require('electron')

var nextSynapseId = 0

var drawSynapse = function (selectionStr) {
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    d3.select(selectionStr).selectAll("path").attr("d", line)
}

var mouseMove = function(e) {
    points = d3.select(".synapse.active").selectAll("path").datum()
    // offset line slightly to avoid accidentally clicking it
    points[1].x = (e.clientX - points[0].x) > 0 ? e.clientX - 10 : e.clientX + 10
    points[1].y = (e.clientY - points[0].y) > 0 ? e.clientY - 10 : e.clientY + 10

    drawSynapse(".synapse.active")
}

var makeSynapse = function (d, lineData, makeDend) {
    window.removeEventListener("mousemove", mouseMove, false)
    presyn = d3.select(".presyn").datum()
    postsyn = d3.select(".postsyn").datum()
    let synapseData = {
        "id": "s" + nextSynapseId++,
        "axonNode": presyn.id,
        "dendNode": postsyn.id
    }
    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)
    // establish synapse and give it an id
    d3.select(".synapse.active")
        .datum(synapseData)
        .attr("id", (d) => d.id)
        .classed("active", false)
        .selectAll("path").datum(lineData).attr("d", line)
    // set node data
    makeDend(synapseData)
    presyn.synapses.push(synapseData.id)
    presyn.nodes[0].synapses.push(synapseData.id) // set axon synapse reference
    postsyn.synapses.push(synapseData.id)
    // give presyn and postsyn synapse data
    d3.select(".presyn").classed("presyn", false)
    d3.select(".postsyn").classed("postsyn", false)
}

var synapseDendMoved = function (id, change) {
    synapse = d3.selectAll("#"+id)
    points = synapse.selectAll("path").datum()
    points[1].x += change.cx
    points[1].y += change.cy

    drawSynapse("#"+id)
}

var synapseAxonMoved = function (id, change) {
    // remake synapse after one of the neurons is moved

    synapse = d3.selectAll("#"+id)
    points = synapse.selectAll("path").datum()
    points[0].x += change.cx
    points[0].y += change.cy

    drawSynapse("#"+id)
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
        .classed("synapse active", true)
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .append("path").datum(lineData).attr("d", line)
    
    window.addEventListener("mousemove", mouseMove, false)

    container.classed("presyn", true)
}

var prepMakeSynapse = function (container, prepDend) {
    /**
     * clicking neuron body creates a new dendrite. (not to exceed max dend count)
     * clicking an existing dendrite adds synapse to that dendrite
     */
    container.classed("postsyn", true)
    preNeuron = d3.select(".presyn")
    axonNode = d3.select(".presyn").selectAll(".axon").data()[0]
    axonPosition = {
        "x": preNeuron.datum().x + axonNode.cx,
        "y": preNeuron.datum().y + axonNode.cy
    }
    makeDend = prepDend(container, axonPosition)
    dendNode = container.selectAll(".dend.ghost").datum()
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

    const clickListener = (e) => {
        console.log("click")
        makeSynapse(container.datum(), lineData, makeDend)
        container.node().removeEventListener('click', clickListener)
    }

    container.node().addEventListener('click', clickListener)

    // container.on("click", (d) => {
    //     console.log("click")
    //     makeSynapse(d, lineData, makeDend)
    // })
}

module.exports = {
    startSynapse: startSynapse,
    prepMakeSynapse: prepMakeSynapse,
    synapseAxonMoved: synapseAxonMoved,
    synapseDendMoved: synapseDendMoved
}