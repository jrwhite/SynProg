var d3 = require("d3")
var d3Transform = require("d3-transform")

var _ = require('lodash')
const {makeBezierCurves} = require("./neuron-drawing-utils.js")
const {neuronClickSetter, drawDendOverlay} = require("./neuron-editor-overlay.js")
const {prepMakeSynapse, synapseAxonMoved, synapseDendMoved} = require("./synapse-renderer.js")
const {prepAddDend} = require("./nodes-renderer.js")
const {drawPotential} = require("./potential-renderer.js")
const {remote} = require('electron')
const {Menu, MenuItem} = remote
const {startRuntime, fireNeuron} = require("./test-runtime")


var nextNeuronId = 0

var neuronPathSetter = function (data) {
    let pathSetter = d3.path()

    const bezierCurves = makeBezierCurves(data.length, data.width, data.angle)
    pathSetter.moveTo(bezierCurves[0].P1.x, bezierCurves[0].P1.y)
    for (let curve of bezierCurves) {
        pathSetter.bezierCurveTo(curve.Q1.x, curve.Q1.y, curve.Q2.x, curve.Q2.y, curve.P2.x, curve.P2.y)
    }

    return pathSetter;
}

var neuronMouseOver = function (d) {
    container = d3.select("#n"+d.id)
    if (d3.select(".presyn").empty() == false && container.classed("presyn") == false && d3.select(".postyn").empty() == true) {
        prepMakeSynapse(container, prepAddDend)
    }
}

var neuronMouseOff = function(d) {
    container = d3.select("#n"+d.id)
    container.classed("postsyn", false)
}

var addNeuron = function(x, y) {
    let neuronData = {
        "x": x,
        "y": y,
        "length": 100,
        "width": 60,
        "angle": 0,
        "id": nextNeuronId++,
        "selected": false,
        "potential": 50,
        "memCurrent": 0,
        "potential-arc": d3.arc(),
        "firing": false,
        "synapses": [],
        "nodes": [
            {
                "type": "axon",
                "id": 0,
                "theta": 0,
                "synapses": []
            }
        ]
    }   

    const transformSetter = d3Transform.transform()
        .translate((d) => ([d.x, d.y]))

    let newNeuron = d3.select("svg").append("g")
        .data([neuronData])
        .attr("class", "neuron")
        .attr("id", (d) => "n"+d.id)
        .attr("transform", transformSetter)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded))
        .on("click", neuronClickSetter)
        .on("mouseover", neuronMouseOver)
        .on("mouseoff", neuronMouseOff)

    newNeuron.append("path").attr("d", neuronPathSetter)
    drawPotential(neuronData)
    neuronData.potential = 25
    drawPotential(neuronData)
    return newNeuron
}

let makeNeuronInput = function (neuron) {
    neuron.classed("input", true)
}

var createMenu = function () {
    const menu = new Menu()
    const addNeuronMenuItem = new MenuItem({
        label: "Add Neuron",
        click() {
            addNeuron(rightClickPosition.x, rightClickPosition.y)
        }
    })

    menu.append(addNeuronMenuItem)
    menu.append(new MenuItem({type: 'separator'}))
    menu.append(new MenuItem({label: 'Add I/O', click() { }}))

    window.addEventListener('contextmenu', (e) => {
        e.preventDefault()
        rightClickPosition = {x: e.x, y: e.y}
        menu.popup({window: remote.getCurrentWindow()})
    }, false)

    let reCreateMenu = () => {}
    return reCreateMenu
}

var init = function initializeRenderer() {
    // TODO: just make this part of index.html
    let svgContainer = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 800)
    
    // TODO: put this stuff in the electron code (main.js)
    createMenu()
    addNeuron(100, 100).classed("input", true).datum().memCurrent = 10
    addNeuron(200, 100).classed("output", true)
    startRuntime(true)
}

function dragStarted(d) {
    d3.select(this).raise().classed("active", true)
    // selectNeuron(d)
}

function dragged(d) {
    translation = {
        "cx": d3.event.x - d.x,
        "cy": d3.event.y - d.y
    }

    d3.select(this).attr("transform", d3Transform.transform().translate([d.x = d3.event.x, d.y = d3.event.y]))

    // update synapses
    d.nodes.map((n) => {
        if (n.type == "axon") {
            n.synapses.map((s) => synapseAxonMoved(s, translation))
        } else if (n.type = "dend") {
            n.synapses.map((s) => synapseDendMoved(s, translation))
        }
    })
}

function dragEnded(d) {
    d3.select(this).classed("active", false);
    console.log(d3.select(this).datum())
}

init()