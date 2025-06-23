
// Elleptic curve
/////////////////////////////////////////////////////////////////////////////////////////////////////////// 
double = function (Ax, Ay) {
    const k = (3 * Ax ** 2) / (2 * Ay);
    const Bx = k ** 2 - 2 * Ax;
    const By = k * (Ax - Bx) - Ay;
    return [Bx, By];
}

curveY = function (x) {
    return (x ** 3 + 7) ** 0.5;
}

range = function (start, end, step) {
    const array = []
    for (let i = start; i <= end; i += step) {
        array.push(i.toFixed(1));
    }

    return array;
};

// init Html
///////////////////////////////////////////////////////////////////////////////////////////////////////////
var sliderScale = document.getElementById("sliderScale");

var inputStep = document.getElementById("inputStep");
var sliderX = document.getElementById("sliderX");

var startX = document.getElementById("startX");
var start = document.getElementById("start");
var doubleHtml = document.getElementById("double");
var divideHtml = document.getElementById("divide");

const inputK = document.getElementById("inputK");
const resultK = document.getElementById("resultK");
const inputY = document.getElementById("inputY");
const resultY = document.getElementById("resultY");
const inputX = document.getElementById("inputX");
const resultX = document.getElementById("resultX");

const xyCheck = document.getElementById("xyCheck");
const yxCheck = document.getElementById("yxCheck");

var canvas = document.getElementById("plotCanvas");

// init vars
///////////////////////////////////////////////////////////////////////////////////////////////////////////
canvas.width = 500;
canvas.height = 700;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

var scale = 20;

const ctx = canvas.getContext('2d');

var x1, y1, x, y, k, x2, y2;
var k_formula, x2_formula, y2_formula;

// slider x
const begin = -2;
const end = 50;
var step = 0.1;
inputStep.value = step;
sliderX.setAttribute("min", begin);
sliderX.setAttribute("max", end);
sliderX.setAttribute("step", step);
sliderX.setAttribute("value", 1);
x1 = 1;

var xx = range(begin, end, 0.01);

// init functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////

// logarithm of number b to base a
log = function(a, b) {
    return Math.log(b)/ Math.log(a);
}

setStep = function () {
    step = inputStep.value;
    sliderX.setAttribute("step", step);
    startX.setAttribute("step", step);
}

drawPoint = function (x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
    // ctx.stroke();
}

plotDivision = function () {
    // ctx.beginPath();

    xx.forEach(x1 => {
        ctx.beginPath();

        x1 = Number(x1);
        var y1 = curveY(x1);

        var xy = double(x1, y1);
        var x = xy[0];
        var y = xy[1];

        var k = Number(eval(k_formula));
        if (xyCheck.checked) {
            var x2 = Number(eval(x2_formula)); 
            var y2 = Number(eval(y2_formula));
        }
        else {
            var y2 = Number(eval(y2_formula));
            var x2 = Number(eval(x2_formula)); 
        }

        // console.log(x2, y2);

        ctx.moveTo(centerX + x2 * scale, centerY - y2 * scale);
        ctx.arc(centerX + x2 * scale, centerY - y2 * scale, 3, 0, 2 * Math.PI);

        ctx.fillStyle = 'red';
        ctx.fill();
    });

    // ctx.fillStyle = 'blue';
    // ctx.fill();
}

curveLine = function (negative) {
    ctx.beginPath();

    xx.forEach(x1 => {
        var y1 = null;
        if (negative) {
            y1 = -curveY(x1);
        }
        else {
            y1 = curveY(x1);
        }
        ctx.lineTo(centerX + x1 * scale, centerY - y1 * scale);
    });

    ctx.stroke();
}

drawPoints = function () {
    y1 = curveY(x1);

    start.innerHTML = `x<sub>1</sub>: ${x1.toFixed(2)} &nbsp; y<sub>1</sub>: ${y1.toFixed(2)} &nbsp;&nbsp;&nbsp; Black. Initial`;
    drawPoint(centerX + x1 * scale, centerY - y1 * scale, 'black');

    const xy = double(x1, y1);
    x = xy[0];
    y = xy[1];
    doubleHtml.innerHTML = `x: ${xy[0].toFixed(2)} &nbsp; y: ${xy[1].toFixed(2)} &nbsp;&nbsp;&nbsp; Green. Multiply point (x<sub>1</sub>, y<sub>1</sub>) by 2`;
    drawPoint(centerX + xy[0] * scale, centerY - xy[1] * scale, 'green');

    calculateKXY();

    if (xyCheck.checked) {
        x2_result = Number(eval(x2_formula));
        y2_result = Number(eval(y2_formula));
    }
    else {
        y2_result = Number(eval(y2_formula));
        x2_result = Number(eval(x2_formula));
    }

    divideHtml.innerHTML = `x<sub>2</sub>: ${x2_result.toFixed(2)} &nbsp; y<sub>2</sub>: ${y2_result.toFixed(2)} &nbsp;&nbsp;&nbsp; Red. Devide point (x, y) by 2`
    drawPoint(centerX + x2_result * scale, centerY - y2_result * scale, 'red');
}

plot = function (value) {
    if (value == 'enterX') {
        sliderX.value = startX.value;
        x1 = Number(startX.value);
    } else if (value != 'init') {
        x1 = Number(value);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    curveLine();
    curveLine(true);

    drawPoints();

    plotDivision();
}

// Find angle k and point (x3, y3) 
///////////////////////////////////////////////////////////////////////////////////////////////////////////
calculateK = function () {
    try {
        k = eval(inputK.value);
        k_formula = inputK.value;
        // resultK.innerHTML = `k = ${k}`;
    }
    catch (error) {
        // resultK.textContent = "invalid expression";
    }
}

calculateY = function () {
    try {
        y2 = eval(inputY.value);
        y2_formula = inputY.value;
        // resultY.innerHTML = `y<sub>2</sub> = ${y2}`;
    }
    catch (error) {
        // resultY.textContent = "invalid expression";
    }
}

calculateX = function () {
    try {
        x2 = eval(inputX.value);
        x2_formula = inputX.value;
        // resultX.innerHTML = `x<sub>2</sub> = ${x2}`;
    }
    catch (error) {
        // resultX.textContent = "invalid expression";
    }
}

calculateKXY = function () {
    calculateK();

    if (xyCheck.checked) {
        calculateX();
        calculateY();
    }
    else {
        calculateY();
        calculateX();
    }
}

calculateKXY_plot = function () {
    calculateKXY();
    plotDivision();
}

// listeners
///////////////////////////////////////////////////////////////////////////////////////////////////////////

sliderScale.oninput = function () {
    scale = this.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    plot('init');
};

sliderX.oninput = function () {
    startX.value = this.value;
    plot(this.value);
}

// call functions
///////////////////////////////////////////////////////////////////////////////////////////////////////////

plot('init');
