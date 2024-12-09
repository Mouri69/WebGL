const vertexShaderSource = `
attribute vec2 a_position;
attribute vec3 a_color;
varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_color = a_color;
}
`;

const fragmentShaderSource = `
precision mediump float;
varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
`;

function compileShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const canvas = document.getElementById('webgl-canvas');
const gl = canvas.getContext('webgl');

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
  console.error(gl.getProgramInfoLog(program));
}
gl.useProgram(program);

// Define the vertices for the octagon split into two halves
const vertices = new Float32Array([
  // Center point
  0.0, 0.0, 1.0, 0.0, 0.0, // Red center
  
  // First half (Red)
  0.0, 1.0, 1.0, 0.0, 0.0, // Top
  0.71, 0.71, 1.0, 0.0, 0.0, // Top-right
  1.0, 0.0, 1.0, 0.0, 0.0, // Right
  0.71, -0.71, 1.0, 0.0, 0.0, // Bottom-right
  0.0, -1.0, 1.0, 0.0, 0.0, // Bottom

  // Center point (again for continuity)
  0.0, 0.0, 0.0, 0.0, 1.0, // Blue center

  // Second half (Blue)
  0.0, -1.0, 0.0, 0.0, 1.0, // Bottom
  -0.71, -0.71, 0.0, 0.0, 1.0, // Bottom-left
  -1.0, 0.0, 0.0, 0.0, 1.0, // Left
  -0.71, 0.71, 0.0, 0.0, 1.0, // Top-left
  0.0, 1.0, 0.0, 0.0, 1.0, // Top
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, 'a_position');
const aColor = gl.getAttribLocation(program, 'a_color');

gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5 * 4, 0);
gl.enableVertexAttribArray(aPosition);

gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5 * 4, 2 * 4);
gl.enableVertexAttribArray(aColor);

// Clear the canvas
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the two halves of the octagon
gl.drawArrays(gl.TRIANGLE_FAN, 0, 6); // Red half
gl.drawArrays(gl.TRIANGLE_FAN, 6, 6); // Blue half