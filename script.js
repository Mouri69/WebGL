function showError(message) {
    console.error(message);  // Logs the error to the console
    alert(message);          // Optionally shows an alert with the error message
}

function square() {
    const canvas = document.getElementById('demo-canvas');
    if (!canvas) {
        showError('Cannot get the canvas');
        return;
    }
    const gl = canvas.getContext('webgl2');
    if (!gl) {
        showError('This browser does not support WebGL2');
        return;
    }

    gl.clearColor(0.08, 0.08, 0.08, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    const squareVertices = [
        -0.5,  0.5,  // Top Left
         0.5,  0.5,  // Top Right
        -0.5, -0.5,  // Bottom Left

         0.5,  0.5,  // Top Right
         0.5, -0.5,  // Bottom Right
        -0.5, -0.5   // Bottom Left
    ];

    const squareVerticesBuffer = new Float32Array(squareVertices);
    const squareBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, squareVerticesBuffer, gl.STATIC_DRAW);

    const VertexShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec2 vertexPosition;

    void main() {
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VertexShaderSourceCode);
    gl.compileShader(vertexShader);

    const FragmentShaderSourceCode = `#version 300 es
    precision mediump float;
    
    out vec4 outputColor;

    void main() {
        outputColor = vec4(0.44, 0.0, 0.44, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, FragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    const squareShaderProgram = gl.createProgram();
    gl.attachShader(squareShaderProgram, vertexShader);
    gl.attachShader(squareShaderProgram, fragmentShader);
    gl.linkProgram(squareShaderProgram);

    const vertexPositionLocation = gl.getAttribLocation(squareShaderProgram, 'vertexPosition');
    gl.useProgram(squareShaderProgram);
    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

try {
    square();
} catch (e) {
    showError(`Uncaught javascript error: ${e}`);
}
