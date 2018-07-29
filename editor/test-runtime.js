var d3 = require("d3")
const {drawPotential} = require("./potential-renderer")
const {fireAp} = require("./ap-renderer")
const {startGym} = require("./gym-client")

var setMemCurrent = function (neuronData, current) {
    neuronData.memCurrent = current
}

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


let startRuntime = function (shouldStartGym) {
    let gymIsRunning = false
    let stepGym = null
    if (shouldStartGym) {
        stepGym = startGym()
        gymIsRunning = true
    }
    
    let step = () => {
        d3.selectAll(".neuron")
            .each((d) => {
                decayNeuron(d)
                if (d.memCurrent > 0) {
                    exciteNeuron(d, d.memCurrent)
                }
                if (d.potential >= 100) {
                    fireNeuron(d)
                    d.potential = -100
                }
            })
        // if gym is running, step gym too
        if (gymIsRunning) {
            stepGym()
        }
    }

    let interval = d3.interval(step, 100)

    const stopRuntime = () => {
        interval.stop()
    }

    return stopRuntime
}

module.exports = {
    startRuntime: startRuntime,
    exciteNeuron: exciteNeuron,
    setMemCurrent: setMemCurrent
}