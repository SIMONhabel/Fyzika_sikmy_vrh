const canvas = document.querySelector("canvas");
const brush = canvas.getContext("2d");

canvas.width = 820;
canvas.height = 640;

const g = 9.8;

const angleInput = document.getElementById("angle");
const velocityInput = document.getElementById("velocity");
const heightInput = document.getElementById("height");
const button = document.getElementById("drawBtn");


const maxHeightOut = document.getElementById("maxHeight");
const maxDistanceOut = document.getElementById("maxDistance");

let velocity = 20;
let angle = Math.PI / 4;
let optAngle = 0;
let height = 100;

function calcX(t,a) {
    return velocity * Math.cos(a) * t;
}

function calcY(t,a) {
    return height + velocity * Math.sin(a) * t - 0.5 * g * t * t;
}

function optimal_angle(){
    return Math.acos((g * height) / (Math.pow(velocity, 2) + g * height)) / 2;
}

function draw() {
    let points = [];
    let pointsOpt = [];
    let maxYValue = height;
    let maxXValue = 0;

    let highestPoint = null;
    let landingPoint = null;

    for (let t = 0; ; t += 0.02) {
        const x = calcX(t,angle);
        const y = calcY(t,angle);
        const xo = calcX(t,optAngle);
        const yo = calcY(t,optAngle);

        if (y > maxYValue) {
            maxYValue = y;
            highestPoint = { x, y };
        }

        if (y < 0) {
            landingPoint = { x, y: 0 };
            maxXValue = x;
            break;
        }

        points.push({
            x,
            y: canvas.height - y
        });
        pointsOpt.push({
            x: xo,
            y: canvas.height - yo
        });
    }

    maxHeightOut.textContent = maxYValue.toFixed(2) + " m";
    maxDistanceOut.textContent = maxXValue.toFixed(2) + " m";


    brush.clearRect(0, 0, canvas.width, canvas.height);
    brush.beginPath();
    brush.lineWidth = 4;
    brush.strokeStyle = "blue";

    let lastPoint = null;
    for (const p of points) {
        if (lastPoint) brush.lineTo(p.x, p.y);
        brush.moveTo(p.x, p.y);
        lastPoint = p;
    }
    brush.stroke();
    brush.closePath();

    brush.beginPath();
    brush.lineWidth = 4;
    brush.strokeStyle = "orange";
    lastPoint = null;
    for (const p of pointsOpt) {
        if (lastPoint) brush.lineTo(p.x, p.y);
        brush.moveTo(p.x, p.y);
        lastPoint = p;
    }
    brush.stroke();
    brush.closePath();


    if (highestPoint) {
        brush.fillStyle = "red";
        brush.beginPath();
        brush.arc(highestPoint.x, canvas.height - highestPoint.y, 6, 0, Math.PI * 2);
        brush.fill();
    brush.closePath();
    }

    if (landingPoint) {
        brush.fillStyle = "green";
        brush.beginPath();
        brush.arc(landingPoint.x, canvas.height, 6, 0, Math.PI * 2);
        brush.fill();
    brush.closePath();
    }
}

button.addEventListener("click", () => {
    velocity = parseFloat(velocityInput.value);
    height = parseFloat(heightInput.value);
    angle = parseFloat(angleInput.value) * Math.PI / 180;
    optAngle = optimal_angle()

    draw();
});

draw();
