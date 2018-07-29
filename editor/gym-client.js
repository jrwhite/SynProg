const zerorpc = require("zerorpc")
const d3 = require("d3")

let createGymClient = function() {
    let client = new zerorpc.Client()
    client.connect("tcp://127.0.0.1:4242")
    return client
}

let stepGym = function(client) {
    let inputNeurons = d3.selectAll(".input")
    let outputNeuron = d3.selectAll(".output") // there should only be one
    client.invoke("step", outputNeuron.datum().potential, (error, res) => {
        if (error) {
            console.error(error)
        } else {
            // returns new membrane current for input neurons
            inputNeurons.each((d) => d.memCurrent = res)
        }
    })
}

let startGym = function() {
    let client = createGymClient()
    client.invoke("start")

    return () => stepGym(client)
}

module.exports = {
    startGym: startGym
}