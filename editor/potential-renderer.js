var d3 = require("d3")

var drawPotential = function(neuron) {
    let pathData = [{
        "potential": 50,
        "firing": false,
        "arc": d3.arc()
    }]

    const arcSetter = (d) => ({
        innerRadius: 0,
        outerRadius: 10,
        startAngle: 0,
        endAngle: (d.potential / 100) * 2 * Math.PI
    })

    let arc = d3.arc()

    container = neuron.append("path")
        .data(pathData)
        .classed("potential", true)
        .attr("d", (d) => arc(arcSetter(d)))
        .attr("fill", "red")
        // .call((d) => d.arc, arcSetter)
        // .attr("d", (d) => arcSetter(d)())
    
    
    // let arc = d3.arc()
    // console.log(arcSetter(container.datum()))
    // console.log(arc(arcSetter(container.datum())))
    // console.log(arc())
    // container.attr("d", arc())
}

module.exports = {
    drawPotential: drawPotential
}