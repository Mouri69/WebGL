let gl;
let program;
let carPosition = -0.5;
let carDirection = 1;
let sunOffset = 0;
let sunDirection = 1;
let isNight = false;
let isDoorOpen = false;
let doorAngle = 0;
let isAnimatingDoor = false;

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

    // Check if click is on door handle
    if (x >= 0.52 && x <= 0.53 && y >= -0.22 && y <= -0.20) {
        isAnimatingDoor = true;
        isDoorOpen = !isDoorOpen;
    }
}

function draw() {
    // Create gradient background instead of solid color
    const skyVertices = new Float32Array([
        -1.0, 1.0,   // Top left
        1.0, 1.0,    // Top right
        1.0, -0.2,   // Bottom right
        -1.0, -0.2   // Bottom left
    ]);
    
    // Define gradient colors for day and night
    const skyColorTop = isNight ? [0.0, 0.0, 0.2, 1.0] : [0.2, 0.6, 1.0, 1.0];
    const skyColorBottom = isNight ? [0.1, 0.1, 0.3, 1.0] : [0.529, 0.808, 0.922, 1.0];
    
    // Draw sky with gradient
    drawShape(skyVertices, skyColorTop, true, skyColorTop, skyColorBottom);

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
    // Main house body
    const houseVertices = new Float32Array([
        0.3, 0.1,
        0.7, 0.1,
        0.7, -0.3,
        0.3, -0.3
    ]);
    const houseColor1 = isNight ? [0.2, 0.05, 0.05, 1.0] : [0.698, 0.133, 0.133, 1.0];
    const houseColor2 = isNight ? [0.3, 0.1, 0.1, 1.0] : [0.933, 0.51, 0.51, 1.0];
    drawShape(houseVertices, houseColor1, true, houseColor1, houseColor2);

    // Roof
    const roofVertices = new Float32Array([
        0.3, 0.1,
        0.5, 0.3,
        0.7, 0.1
    ]);
    const roofColor = isNight ? [0.2, 0.1, 0.03, 1.0] : [0.545, 0.271, 0.075, 1.0];
    drawShape(roofVertices, roofColor, false);

    // Door frame/background (darker area behind door)
    const doorFrameVertices = new Float32Array([
        0.45, -0.1,    // Top left
        0.55, -0.1,    // Top right
        0.55, -0.3,    // Bottom right
        0.45, -0.3     // Bottom left
    ]);
    const doorFrameColor = isNight ? [0.1, 0.05, 0.02, 1.0] : [0.3, 0.15, 0.05, 1.0];
    drawShape(doorFrameVertices, doorFrameColor, false);

    // Update door angle if animating
    if (isAnimatingDoor) {
        if (isDoorOpen) {
            doorAngle = Math.min(doorAngle + 0.03, Math.PI / 2.5);
            if (doorAngle >= Math.PI / 2) isAnimatingDoor = false;
        } else {
            doorAngle = Math.max(doorAngle - 0.03, 0);
            if (doorAngle <= 0) isAnimatingDoor = false;
        }
    }

    // Door
    const doorPivotX = 0.45;  // Left edge of door (pivot point)
    const doorWidth = 0.1;    // Width of door
    const doorTop = -0.1;     // Top of door
    const doorBottom = -0.3;  // Bottom of door

    // Calculate door vertices based on rotation
    const cosAngle = Math.cos(doorAngle);
    const sinAngle = Math.sin(doorAngle);
    
    const doorVertices = new Float32Array([
        doorPivotX, doorTop,    // Top left (pivot point)
        doorPivotX + doorWidth * cosAngle, doorTop,    // Top right
        doorPivotX + doorWidth * cosAngle, doorBottom, // Bottom right
        doorPivotX, doorBottom  // Bottom left
    ]);
    
    const doorColor = isNight ? [0.2, 0.1, 0.03, 1.0] : [0.545, 0.271, 0.075, 1.0];
    drawShape(doorVertices, doorColor, false);

    // Door handle - moves with the door
    const handleVertices = new Float32Array([
        doorPivotX + 0.07 * cosAngle, -0.2,    // Center of handle
        doorPivotX + 0.08 * cosAngle, -0.2,    // Right edge
        doorPivotX + 0.08 * cosAngle, -0.22,   // Bottom right
        doorPivotX + 0.07 * cosAngle, -0.22    // Bottom left
    ]);
    const handleColor = isNight ? [0.4, 0.4, 0.4, 1.0] : [0.8, 0.8, 0.8, 1.0];
    drawShape(handleVertices, handleColor, false);

    // Windows
    const window1Vertices = new Float32Array([
        0.35, -0.05,
        0.42, -0.05,
        0.42, -0.15,
        0.35, -0.15
    ]);
    const window2Vertices = new Float32Array([
        0.58, -0.05,
        0.65, -0.05,
        0.65, -0.15,
        0.58, -0.15
    ]);
    const windowColor = isNight ? [0.9, 0.8, 0.2, 1.0] : [0.529, 0.808, 0.922, 1.0];
    drawShape(window1Vertices, windowColor, false);
    drawShape(window2Vertices, windowColor, false);
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
    // Car body
    const carVertices = new Float32Array([
        carPosition - 0.1, -0.65,
        carPosition + 0.1, -0.65,
        carPosition + 0.1, -0.75,
        carPosition - 0.1, -0.75
    ]);
    drawShape(carVertices, [1.0, 0.0, 0.0, 1.0], false);

    // Front wheel
    const frontWheelVertices = createWheelVertices(carPosition + 0.06, -0.75, 0.02);
    drawShape(new Float32Array(frontWheelVertices), [0.3, 0.3, 0.3, 1.0], false);

    // Back wheel
    const backWheelVertices = createWheelVertices(carPosition - 0.06, -0.75, 0.02);
    drawShape(new Float32Array(backWheelVertices), [0.3, 0.3, 0.3, 1.0], false);
}

// Helper function to create wheel vertices
function createWheelVertices(centerX, centerY, radius) {
    const segments = 16;
    const vertices = [];

    // Create a circle using triangle fan vertices
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const x = centerX + radius * Math.cos(theta);
        const y = centerY + radius * Math.sin(theta);
        vertices.push(x, y);
    }

    return vertices;
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

