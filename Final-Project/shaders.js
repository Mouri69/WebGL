const vertexShaderSource = `
    attribute vec2 a_position;
    varying vec2 v_position;
    void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_position = a_position;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    uniform bool u_useGradient;
    uniform vec4 u_gradientColor1;
    uniform vec4 u_gradientColor2;
    varying vec2 v_position;
    void main() {
        if (u_useGradient) {
            gl_FragColor = mix(u_gradientColor1, u_gradientColor2, v_position.y);
        } else {
            gl_FragColor = u_color;
        }
    }
`;

