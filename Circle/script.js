const vertexShaderSource = `
attribute vec2 aPosition;
attribute vec3 aColor;
varying vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1.0);
}
`;

function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

// Compile and link shaders
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

// Circle vertices
const numSegments = 100;
const radius = 0.5;
const circleVertices = [];
const edgeColor = [0.75, 0.0, 0.75];   

// Center of the circle ----- for gradient coloring ---------
// const centerColor = [1.0, 1.0, 1.0];  // White color for the center
// circleVertices.push(0.0, 0.0, ...centerColor);

for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    circleVertices.push(x, y, ...edgeColor);
}

const vertices = new Float32Array(circleVertices);



const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, 'aPosition');
const aColor = gl.getAttribLocation(program, 'aColor');

gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * 4, 0);
gl.enableVertexAttribArray(aPosition);

gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
gl.enableVertexAttribArray(aColor);

// Clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the circle using TRIANGLE_FAN
// gl.drawArrays(gl.TRIANGLE_FAN, 0, numSegments);
gl.drawArrays(gl.LINE_LOOP, 0, numSegments); //draws line border 