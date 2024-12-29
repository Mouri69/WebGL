let gl;
let program;
let carPosition = -0.5;
let carDirection = 1;
let sunOffset = 0;
let sunDirection = 1;
let isNight = false;

function initGL() {
    const canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    canvas.addEventListener('click', handleCanvasClick);
}

function handleCanvasClick(event) {
    const canvas = event.target;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / canvas.width * 2 - 1;
    const y = -(event.clientY - rect.top) / canvas.height * 2 + 1;

    // Check if the click is within the sun/moon
    if (Math.sqrt((x + 0.8) ** 2 + (y - 0.8) ** 2) <= 0.1) {
        isNight = !isNight;
    }
}

function draw() {
    const skyColor = isNight ? [0.1, 0.1, 0.3, 1.0] : [0.529, 0.808, 0.922, 1.0];
    gl.clearColor(...skyColor);
    gl.clear(gl.COLOR_BUFFER_BIT);

    drawSun();
    drawLandscape();
    drawTree();
    drawHouse();
    drawRoad();
    drawCar();

    carPosition += 0.005 * carDirection;
    if (carPosition > 0.5 || carPosition < -0.5) {
        carDirection *= -1;
    }

    sunOffset += 0.001 * sunDirection;
    if (sunOffset > 0.05 || sunOffset < -0.05) {
        sunDirection *= -1;
    }

    requestAnimationFrame(draw);
}

function drawSun() {
    const segments = 32;
    const radius = 0.1;
    const centerX = -0.8;
    const centerY = 0.8 + sunOffset;
    const sunVertices = [];

    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = centerX + radius * Math.cos(theta);
        const y = centerY + radius * Math.sin(theta);
        sunVertices.push(x, y);
    }

    const color = isNight ? [0.9, 0.9, 0.9, 1.0] : [1.0, 1.0, 0.0, 1.0];
    drawShape(new Float32Array(sunVertices), color, false);
}

function drawLandscape() {
    const landscapeVertices = new Float32Array([
        -1.0, -0.2,
        1.0, -0.2,
        1.0, -1.0,
        -1.0, -1.0
    ]);
    const color = isNight ? [0.05, 0.2, 0.05, 1.0] : [0.133, 0.545, 0.133, 1.0];
    drawShape(landscapeVertices, color, false);
}

function drawTree() {
    const trunkVertices = new Float32Array([
        -0.05, -0.2,
        0.05, -0.2,
        0.05, -0.5,
        -0.05, -0.5
    ]);
    const trunkColor = isNight ? [0.2, 0.1, 0.03, 1.0] : [0.545, 0.271, 0.075, 1.0];
    drawShape(trunkVertices, trunkColor, false);

    const leavesVertices = new Float32Array([
        0.0, 0.1,
        -0.2, -0.2,
        0.2, -0.2
    ]);
    const leavesColor = isNight ? [0.1, 0.35, 0.2, 1.0] : [0.1, 0.35, 0.2, 1.0];
    drawShape(leavesVertices, leavesColor, false);
}

function drawHouse() {
    const houseVertices = new Float32Array([
        0.3, 0.1,
        0.7, 0.1,
        0.7, -0.3,
        0.3, -0.3
    ]);
    const houseColor1 = isNight ? [0.2, 0.05, 0.05, 1.0] : [0.698, 0.133, 0.133, 1.0];
    const houseColor2 = isNight ? [0.3, 0.1, 0.1, 1.0] : [0.933, 0.51, 0.51, 1.0];
    drawShape(houseVertices, houseColor1, true, houseColor1, houseColor2);

    const roofVertices = new Float32Array([
        0.3, 0.1,
        0.5, 0.3,
        0.7, 0.1
    ]);
    const roofColor = isNight ? [0.2, 0.1, 0.03, 1.0] : [0.545, 0.271, 0.075, 1.0];
    drawShape(roofVertices, roofColor, false);
}

function drawRoad() {
    const roadVertices = new Float32Array([
        -1.0, -0.6,
        1.0, -0.6,
        1.0, -0.8,
        -1.0, -0.8
    ]);
    const roadColor = isNight ? [0.2, 0.2, 0.2, 1.0] : [0.5, 0.5, 0.5, 1.0];
    drawShape(roadVertices, roadColor, false);
}

function drawCar() {
    const carVertices = new Float32Array([
        carPosition - 0.1, -0.65,
        carPosition + 0.1, -0.65,
        carPosition + 0.1, -0.75,
        carPosition - 0.1, -0.75
    ]);
    drawShape(carVertices, [1.0, 0.0, 0.0, 1.0], false);
}

function drawShape(vertices, color, useGradient, gradientColor1, gradientColor2) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const colorUniformLocation = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(colorUniformLocation, color);

    const useGradientLocation = gl.getUniformLocation(program, 'u_useGradient');
    gl.uniform1i(useGradientLocation, useGradient);

    if (useGradient) {
        const gradientColor1Location = gl.getUniformLocation(program, 'u_gradientColor1');
        const gradientColor2Location = gl.getUniformLocation(program, 'u_gradientColor2');
        gl.uniform4fv(gradientColor1Location, gradientColor1);
        gl.uniform4fv(gradientColor2Location, gradientColor2);
    }

    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertices.length / 2);
}

window.onload = function() {
    initGL();
    draw();
};

