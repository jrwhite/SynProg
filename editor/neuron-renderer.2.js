var d3 = require("d3")
var d3Transform = require("d3-transform")
var d3Shape = require("d3-shape")
var Neuron = require("./Neuron.js")


var createSvg = function () {
    var arcData = { "length": 50, "width": 2}
    var neuronData = {"x": 50, "y": 50}
    var neuron = new Neuron(100, 100, 0)
    
    var neuronPathSetter = d3.path()

    console.log(neuron.data)
    for (var bez of neuron.data) {
        console.log(bez)
        neuronPathSetter.moveTo(bez.P1.x, bez.P1.y)
        neuronPathSetter.bezierCurveTo(bez.Q1.x, bez.Q1.y, bez.Q2.x, bez.Q2.y, bez.P2.x, bez.P2.y)
    }
    neuronPathSetter.closePath()

    var neuronTransformSetter = d3Transform.transform()
        .translate((d) => ([d.x, d.y]))
    
    var svgContainer = d3.select("body").append("svg")
        .attr("width", 200)
        .attr("height", 200)
    
    var neuronContainer = svgContainer.selectAll("g")
        .data([neuronData])
        .enter().append("g")
        .attr("transform", neuronTransformSetter)
    
    var arcPaths = neuronContainer.selectAll("path")
        .data([arcData])
        .enter().append("path")
        .attr("d", neuronPathSetter)
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none")
}


createSvg()