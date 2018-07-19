var d3 = require("d3")
const {remote} = require('electron')

var startSynapse = function (container, d) {
    let lineData = [{
            "x": container.datum().x,
            "y": container.datum().y
        },
        {
            "x": 0,
            "y": 0
        }
    ]

    let line = d3.line()
        .x((d) => d.x)
        .y((d) => d.y)

    lineContainer = d3.select("svg")
        .append("g")
        .classed("synapse", true)
        .attr("stroke", "red")
        .attr("stroke-width", 3)
        .append("path").datum(lineData).attr("d", line)
    
    window.addEventListener("mousemove", (e) => {
        lineData[1].x = e.clientX
        lineData[1].y = e.clientY
        d3.select(".synapse").select("path").attr("d", line)
    })

    container.classed("presyn", true)
}

module.exports = {
    startSynapse: startSynapse
}