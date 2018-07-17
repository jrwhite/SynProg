var d3 = require("d3")
var d3Transform = require("d3-transform")
var d3Shape = require("d3-shape")
var Neuron = require("./Neuron.js")
const makeBezierCurves = require("./neuron-body-drawer.js")
const {remote} = require('electron')
const {Menu, MenuItem} = remote

var createMenu = function (addNeuron) {
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

var makeNeuronPathSetter = function (data) {
    let neuronPathSetter = d3.path()


    const bezierCurves = makeBezierCurves(data.length, data.width, data.angle)
    neuronPathSetter.moveTo(bezierCurves[0].P1.x, bezierCurves[0].P1.y)
    for (let curve of bezierCurves) {
        neuronPathSetter.bezierCurveTo(curve.Q1.x, curve.Q1.y, curve.Q2.x, curve.Q2.y, curve.P2.x, curve.P2.y)
    }
    neuronPathSetter.closePath()

    return neuronPathSetter;
}

var drawNeuronBodies = function (container, neuronData) {
    const pathSetters = neuronData.map((n) => (makeNeuronPathSetter(n)))

    const transformSetter = d3Transform.transform()
        .translate((d) => ([d.x, d.y]))

    const neuronContainers = container.selectAll("g")
        .data(neuronData)
        .enter().append("g")
        .attr("class", "neuron")
        .attr("transform", transformSetter)
        .append("path").attr("d", makeNeuronPathSetter)

    neuronContainers.call(d3.drag()
            .on("start", dragStarted)
            .on("drag", dragged)
            .on("end", dragEnded))

    // const paths = neuronContainers.map((c, i) => {
    //     // maybe move this to a loop by itself to improve readibility
    //     c.call(d3.drag()
    //         .on("start", dragStarted)
    //         .on("drag", dragged)
    //         .on("end", dragEnded))

    //     c.append("path").attr("d", pathSetters[i]) // bug with order maybe?
    // })
}

var init = function initializeRenderer() {
    let svgContainer = d3.select("body").append("svg")
        .attr("width", 1000)
        .attr("height", 800)
    
    let neuronData = []
    let neuronAvailableIds = []
    let nextNeuronId = 0
    const addNeuron = (x, y) => {
            neuronData.push({
                "x": x,
                "y": y,
                "length": 100,
                "width": 60,
                "angle": 0,
                "id": neuronAvailableIds.length ? neuronAvailableIds.pop() : nextNeuronId++
            })
            drawNeuronBodies(svgContainer, neuronData)
    }

    createMenu(addNeuron)
    drawNeuronBodies(svgContainer, neuronData)
}



function dragStarted(d) {
    d3.select(this).raise().classed("active", true)
}

function dragged(d) {
    d3.select(this).attr("transform", d3Transform.transform().translate([d.x = d3.event.x, d.y = d3.event.y]))
}

function dragEnded(d) {
    d3.select(this).classed("active", false);
}

init()