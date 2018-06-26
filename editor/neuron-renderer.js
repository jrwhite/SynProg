var d3 = require("d3")
var d3Shape = require("d3-shape")

var createSvg = function () {
    var svg = d3.select("body").append("svg")
        .attr("width", 460)
        .attr("height", 200)

    var frame = svg.append("g")
        .datum({
            length : 50,
            eccentricity : 0.75
        })

    frame.append("g")
        .datum({
            length : 50,
            eccentricity : 0.75
        })
        .append("path")
        .attr("d", ellipse)
}

/**
 * Neuron datum:
 * 
 * eccentricity -   (rMaj / rMin)
 * length
 * position -   (of left-most point)
 * angle
 * axonChordLength
 * 
 */

function ellipse(d) {
    var rMaj = d.length,
        rMin = d.length

    console.log(rMaj)

    var arc = d3Shape.arc()

    arc({
        innerRadius: rMin,
        outerRadius: rMaj,
        startAngle: 0,
        endAngle: Math.PI / 2
    })

    return arc()

}

createSvg()