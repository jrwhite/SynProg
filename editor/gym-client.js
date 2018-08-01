const zerorpc = require("zerorpc")
const d3 = require("d3")

let createGymClient = function() {
    console.log("creating client")
    let client = new zerorpc.Client()
    client.connect("tcp://127.0.0.1:4242")
    client.on("error", (error) => console.error(error))
    return client
}

let stepGym = function(client) {
    let inputNeurons = d3.selectAll(".input")
    let outputNeuron = d3.selectAll(".output") // there should only be one
    // client.invoke("step", outputNeuron.datum().potential, (error, res) => {
    client.invoke("step", 0, (error, res, more) => {
        console.log(error)
        console.log(res)
        // if (error) {
        //     console.error(error)
        // } else {
        //     console.log(res)
            // returns new membrane current for input neurons
            // inputNeurons.each((d) => (d.memCurrent = res))
            inputNeurons.each((d) => (d.memCurrent = 0))
        // }
    })
}

let startGym = function() {
    let client = createGymClient()
    console.log('start')
    client.invoke("start", (error, res, more) => console.log(res))

    return () => stepGym(client)
}

module.exports = {
    startGym: startGym
}