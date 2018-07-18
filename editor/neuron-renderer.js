var d3 = require("d3")
var d3Transform = require("d3-transform")
var _ = require('lodash')
const {makeBezierCurves} = require("./neuron-drawing-utils.js")
const neuronClickSetter = require("./neuron-editor-overlay")
const {remote} = require('electron')
const {Menu, MenuItem} = remote

var nextId = 0

var addNeuron = function(x, y) {
    let neuronData = {
        "x": x,
        "y": y,
        "length": 100,
        "width": 60,
        "angle": 0,
        "id": nextId++,
        "selected": false
    }   

    const transformSetter = d3Transform.transform()
        .translate((d) => ([d.x, d.y]))

    d3.select("svg").append("g")
        .data([neuronData])
        .attr("class", "neuron")
        .attr("id", (d) => "n"+d.id)
        .attr("transform", transformSetter)
        .call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded))
        .on("click", neuronClickSetter)
        .append("path").attr("d", neuronPathSetter)
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

var neuronPathSetter = function (data) {
    let pathSetter = d3.path()

    const bezierCurves = makeBezierCurves(data.length, data.width, data.angle)
    pathSetter.moveTo(bezierCurves[0].P1.x, bezierCurves[0].P1.y)
    for (let curve of bezierCurves) {
        pathSetter.bezierCurveTo(curve.Q1.x, curve.Q1.y, curve.Q2.x, curve.Q2.y, curve.P2.x, curve.P2.y)
    }

    return pathSetter;
}

var init = function initializeRenderer() {
    // TODO: just make this part of index.html
    let svgContainer = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 800)
    
    // TODO: put this stuff in the electron code (main.js)
    createMenu()
}

function dragStarted(d) {
    d3.select(this).raise().classed("active", true)
    // selectNeuron(d)
}

function dragged(d) {
    d3.select(this).attr("transform", d3Transform.transform().translate([d.x = d3.event.x, d.y = d3.event.y]))
}

function dragEnded(d) {
    d3.select(this).classed("active", false);
}

init()