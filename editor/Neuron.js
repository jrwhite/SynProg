class Neuron {
    constructor(length, width, orientation) {
        this.major = length.toFixed(2) / 2.00
        this.minor = width.toFixed(2) / 2.00
        this.ecc = Math.sqrt(1.00 - ((this.minor * this.minor) / (this.major * this.major)))
        this.theta = orientation.toFixed(2)
        /**
         * Initialize the neuron base outline
         */
        this.bezierData = [
            this.ellipseBezier(0, Math.PI / 4),
            this.ellipseBezier(Math.PI / 4, Math.PI)
        ]
        console.log(this.bezierData)
    }

    get data() {
        return this.bezierData;
    }

    // Using technique from http://www.spaceroots.org/documents/ellipse/node22.html
    el(nu) {
        return {
            "x": (this.major * Math.cos(this.theta) * Math.cos(nu)) - (this.minor * Math.sin(this.theta) * Math.sin(nu)),
            "y": (this.major * Math.sin(this.theta) * Math.cos(nu)) + (this.minor * Math.cos(this.theta) * Math.sin(nu))
        }       
    }

    elPrime(nu) {
        return {
            "x": (-this.major * Math.cos(this.theta) * Math.sin(nu)) - (this.minor * Math.sin(this.theta) * Math.cos(nu)),
            "y": (-this.major * Math.sin(this.theta) * Math.sin(nu)) + (this.minor * Math.cos(this.theta) * Math.cos(nu))
        }       
    }

    ellipseBezier(nu1, nu2) {
        var alpha = Math.sin(nu2 - nu1) * ((Math.sqrt(4.00 + 3.00 * Math.pow(Math.tan((nu2 - nu1) / 2.00), 2)) - 1.00) / 3.00)
        console.log(this.elPrime(nu1))
        console.log(alpha)
        var p1 = this.el(nu1)
        var pp1 = this.elPrime(nu1)
        var p2 = this.el(nu2)
        var pp2 = this.elPrime(nu2)
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
}

module.exports = Neuron