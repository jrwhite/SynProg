const PI = Math.PI

var makeBezierCurves = function (length, width, orientation) {
    const major = length.toFixed(2) / 2.00
    const minor = width.toFixed(2) / 2.00
    const ellipse = {
        "major": major,
        "minor": minor,
        "ecc": Math.sqrt(1.00 - ((minor * minor) / (major * major))),
        "theta": orientation.toFixed(3)
    }

    const arcs = [
        // in pi radians
        [0, 1/4],
        [1/4, 1/2],
        [1/2, 3/2],
        [3/2, 2]
    ].map(x => x.map(xx => xx * PI))

    return arcs.map(arc => ellipseBezier(ellipse, arc[0], arc[1]))
}

function ellipseBezier(ellipse, nu1, nu2) {
    // Using technique from http://www.spaceroots.org/documents/ellipse/node22.html
    const el = (nu) => ({
        "x": (ellipse.major * Math.cos(ellipse.theta) * Math.cos(nu)) - (ellipse.minor * Math.sin(ellipse.theta) * Math.sin(nu)),
        "y": (ellipse.major * Math.sin(ellipse.theta) * Math.cos(nu)) + (ellipse.minor * Math.cos(ellipse.theta) * Math.sin(nu))
    })
    const elPrime = (nu) => ({
        "x": (-ellipse.major * Math.cos(ellipse.theta) * Math.sin(nu)) - (ellipse.minor * Math.sin(ellipse.theta) * Math.cos(nu)),
        "y": (-ellipse.major * Math.sin(ellipse.theta) * Math.sin(nu)) + (ellipse.minor * Math.cos(ellipse.theta) * Math.cos(nu))
    })
    const alpha = Math.sin(nu2 - nu1) * ((Math.sqrt(4.00 + 3.00 * Math.pow(Math.tan((nu2 - nu1) / 2.00), 2)) - 1.00) / 3.00)
    const p1 = el(nu1)
    const pp1 = elPrime(nu1)
    const p2 = el(nu2)
    const pp2 = elPrime(nu2)
    return {
        "P1": p1,
        "P2": p2,
        "Q1": {
            "x": p1.x + alpha * pp1.x,
            "y": p1.y + alpha * pp1.y
        },
        "Q2": {
            "x": p2.x - alpha * pp2.x,
            "y": p2.y - alpha * pp2.y
        }
    }
}

module.exports = makeBezierCurves
