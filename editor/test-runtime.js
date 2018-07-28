var d3 = require("d3")
const {drawPotential} = require("./potential-renderer")
const {fireAp} = require("./ap-renderer")

var exciteNeuron = function(neuronData, val) {
    newPotential = neuronData.potential + val
    neuronData.potential = newPotential
    drawPotential(neuronData)
}

var fireNeuron = function (neuronData) {
    neuronData.firing = true
    let callback = (d, val) => {
        neuronData.firing = false
        exciteNeuron(d, val)
    }

    fireAp(
        neuronData,
        callback
    )
}

var decayNeuron = function (neuronData) {
    let pot = neuronData.potential * 0.95
    if (pot < 1 && pot > -1) pot = 0
    neuronData.potential = pot
    drawPotential(neuronData)
}

let step = function () {
    d3.selectAll(".neuron")
        .each((d) => {
            decayNeuron(d)
            if (d.potential >= 100) {
                fireNeuron(d)
                d.potential = -100
            }
        })
}

let startRuntime = function () {
    const interval = d3.interval(step, 100)
}

module.exports = {
    startRuntime: startRuntime,
    exciteNeuron: exciteNeuron
}