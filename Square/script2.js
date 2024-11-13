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
        // Positions      // Colors
        -0.5,  0.5,       1.0, 0.0, 0.0,  // Top Left - Red
         0.5,  0.5,       0.0, 1.0, 0.0,  // Top Right - Green
        -0.5, -0.5,       0.0, 0.0, 1.0,  // Bottom Left - Blue

         0.5,  0.5,       0.0, 1.0, 0.0,  // Top Right - Green
         0.5, -0.5,       1.0, 1.0, 0.0,  // Bottom Right - Yellow
        -0.5, -0.5,       0.0, 0.0, 1.0   // Bottom Left - Blue
    ];

    const squareVerticesBuffer = new Float32Array(squareVertices);
    const squareBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, squareVerticesBuffer, gl.STATIC_DRAW);

    const VertexShaderSourceCode = `#version 300 es
    precision mediump float;
    
    in vec2 vertexPosition;
    in vec3 vertexColor;

    out vec3 fragColor; //Passes this color data to the fragment shader.

    void main() {
        gl_Position = vec4(vertexPosition, 0.0, 1.0);
        fragColor = vertexColor;
    }`;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VertexShaderSourceCode);
    gl.compileShader(vertexShader);

    const FragmentShaderSourceCode = `#version 300 es
    precision mediump float;

    in vec3 fragColor;
    out vec4 outputColor;

    void main() {
        outputColor = vec4(fragColor, 1.0);
    }`;

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, FragmentShaderSourceCode);
    gl.compileShader(fragmentShader);

    const squareShaderProgram = gl.createProgram();
    gl.attachShader(squareShaderProgram, vertexShader);
    gl.attachShader(squareShaderProgram, fragmentShader);
    gl.linkProgram(squareShaderProgram);

    const vertexPositionLocation = gl.getAttribLocation(squareShaderProgram, 'vertexPosition');
    const vertexColorLocation = gl.getAttribLocation(squareShaderProgram, 'vertexColor');

    gl.useProgram(squareShaderProgram);

    gl.enableVertexAttribArray(vertexPositionLocation);
    gl.vertexAttribPointer(vertexPositionLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

    gl.enableVertexAttribArray(vertexColorLocation);
    gl.vertexAttribPointer(vertexColorLocation, 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

try {
    square();
} catch (e) {
    showError(`Uncaught JavaScript error: ${e}`);
}
