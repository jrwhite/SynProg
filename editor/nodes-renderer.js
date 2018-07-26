const {drawDendOverlay} = require('./neuron-editor-overlay.js')

var prune = function(neuronData) {
    // remove unconnected dendrites
    // mutates neuronData
    neuronData.nodes = neuronData.nodes.filter((n) => n.type == "axon" || n.synapses.length > 0)
}

var prepAddDend = function (neuron, axonPoint) {
    // TODO: redo this whole thing
    neuronData = neuron.datum()
    prune(neuronData) // mutates

    // add a new dendrite and return a closure with call to confirm

    // check if its the first dendrite
    dendrites = neuronData.nodes.filter((n) => n.type == "dend")
    console.log(dendrites)
    let j
    if (dendrites.length == 0) {
        j = neuronData.nodes.push(
            {
                "type": "dend",
                "id": 0,
                "theta": 1,
                "synapses": []
            }
        ) - 1
    } else {
        j = neuronData.nodes.push(
            {
                "type": "dend",
                "id": dendrites.reduce((d, cur) => d > cur ? d: cur) + 1, 
                "theta": axonPoint.y < neuronData.y ? 1.4: 0.6, // temporarily just 3 dendrites
                "synapses": []
            }
        ) - 1
    }

    drawDendOverlay(neuron)

    return (synapse) => {
        neuronData.nodes[j].synapses.push(synapse.id)
    }
}

module.exports = {
    prepAddDend: prepAddDend
}
