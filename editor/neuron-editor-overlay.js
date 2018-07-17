const d3 = require("d3")

var selectNeuron = function (d) {

    let neuronContainer = d3.select(d.id)

}

var drawOverlay = function() {
    overlayDatum = {}
    // allow only one overlay
    overlayContainer = d3.select("neuron-overlay")
        .datum(overlayDatum)
        .enter()
}

module.exports = selectNeuron