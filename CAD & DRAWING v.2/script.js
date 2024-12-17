var canvas;
var gl;
var maxNumVertices = 200;
var index = 0;

var colors = [
    vec4(1.0, 0.0, 0.0, 1.0),  // red
    vec4(1.0, 1.0, 0.0, 1.0),  // yellow
    vec4(0.0, 1.0, 0.0, 1.0),  // green
    vec4(0.0, 0.0, 1.0, 1.0),  // blue
    vec4(1.0, 0.0, 1.0, 1.0),  // magenta
    vec4(0.0, 1.0, 1.0, 1.0)   // cyan
];

var shapes = []; // Stores completed shapes
var currentVertices = []; // Vertices for the current shape
var currentColors = []; // Colors for the current shape
var selectedColor = 0; // Default color

var isMouseDown = false;

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    var colorSelect = document.getElementById("color-select");
    var fillButton = document.getElementById("fill-shape");
    var clearButton = document.getElementById("clear-canvas");

    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL isn't available");
        return;
    }

    colorSelect.addEventListener("change", function () {
        selectedColor = parseInt(colorSelect.value); // Update selected color
    });

    canvas.addEventListener("mousedown", function (event) {
        isMouseDown = true;
        var [x, y] = getMousePosition(event);
        addVertex(x, y);
    });

    canvas.addEventListener("mousemove", function (event) {
        if (isMouseDown) {
            var [x, y] = getMousePosition(event);
            addVertex(x, y); // Add vertex while moving mouse with button pressed
        }
    });

    canvas.addEventListener("mouseup", function () {
        isMouseDown = false;
    });

    fillButton.addEventListener("click", function () {
        if (currentVertices.length >= 3) {
            closeAndFillShape(); // Close and fill the current shape
        } else {
            alert("You need at least 3 vertices to fill a shape!");
        }
    });

    clearButton.addEventListener("click", function () {
        shapes = []; // Clear all saved shapes
        resetCurrentShape(); // Clear current shape
        render(); // Refresh the canvas
    });

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    // Shader code
    var vertexShaderSource = `
        attribute vec4 vPosition;
        attribute vec4 vColor;
        varying vec4 fColor;

        void main() {
            gl_Position = vPosition;
            fColor = vColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec4 fColor;

        void main() {
            gl_FragColor = fColor;
        }
    `;

    var program = createProgram(vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8 * maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16 * maxNumVertices, gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    render();
};

function getMousePosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = 2 * (event.clientX - rect.left) / canvas.width - 1;
    var y = 2 * (canvas.height - (event.clientY - rect.top)) / canvas.height - 1;
    return [x, y];
}

function addVertex(x, y) {
    currentVertices.push(vec2(x, y));
    currentColors.push(colors[selectedColor]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 8 * index, flatten(vec2(x, y)));

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16 * index, flatten(colors[selectedColor]));

    index++;
}

function closeAndFillShape() {
    currentVertices.push(currentVertices[0]); // Close the shape by connecting to the first vertex
    currentColors.push(colors[selectedColor]);

    saveCurrentShape(); // Save the completed shape
    resetCurrentShape(); // Reset for the next shape
}

function saveCurrentShape() {
    shapes.push({
        vertices: currentVertices.slice(), // Save a copy of vertices
        colors: currentColors.slice()      // Save a copy of colors
    });
}

function resetCurrentShape() {
    currentVertices = [];
    currentColors = [];
    index = 0;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw completed shapes
    for (var i = 0; i < shapes.length; i++) {
        var shape = shapes[i];
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(shape.vertices));

        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(shape.colors));

        gl.drawArrays(gl.TRIANGLE_FAN, 0, shape.vertices.length);
    }

    // Draw current vertices
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(currentVertices));

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(currentColors));

    gl.drawArrays(gl.LINE_STRIP, 0, currentVertices.length);

    window.requestAnimationFrame(render);
}

function vec2(x, y) {
    return [x, y];
}

function vec4(r, g, b, a) {
    return [r, g, b, a];
}

function flatten(arr) {
    return new Float32Array(arr.flat());
}

function createProgram(vertexShaderSource, fragmentShaderSource) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    return program;
}