var gl;
var points;

var A = vec2(-0.4, -0.3);
var B = vec2(-0.4, 0.3);
var C = vec2(-0.2, 0.3);
var D = vec2(-0.2, 0.1);
var E = vec2(0.1, 0.1);
var F = vec2(0.1, 0.3);
var G = vec2(0.4, 0.3);
var H = vec2(0.4, 0.0);
var I = vec2(0.2, 0.0);
var J = vec2(0.2, -0.3);


window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    var vertices = [
        A, B, C, D, E, I, J,   // First triangle fan
        E, F, G, H, I // Second triangle fan (shares E)
    ];

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 1);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
        // Draw filled shapes using TRIANGLE_FAN
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 7); // First fan
        gl.drawArrays(gl.TRIANGLE_FAN, 7, 5); // Second fan

}