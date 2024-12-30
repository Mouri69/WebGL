const vertexShaderSource = `
    attribute vec3 a_position;
    attribute vec3 a_normal;
    uniform bool u_is3D;
    uniform mat4 u_modelMatrix;
    uniform mat4 u_viewMatrix;
    uniform mat4 u_projectionMatrix;
    
    varying vec3 v_normal;
    varying vec2 v_position;
    
    void main() {
        if (u_is3D) {
            gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);
            v_normal = a_normal;
        } else {
            gl_Position = vec4(a_position.xy, 0.0, 1.0);
            v_position = a_position.xy;
        }
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 u_color;
    uniform bool u_useGradient;
    uniform bool u_is3D;
    uniform vec4 u_gradientColor1;
    uniform vec4 u_gradientColor2;
    uniform vec3 u_lightDirection;
    
    varying vec3 v_normal;
    varying vec2 v_position;
    
    void main() {
        if (u_is3D) {
            vec3 normal = normalize(v_normal);
            float light = max(dot(normal, normalize(u_lightDirection)), 0.2);
            gl_FragColor = vec4(u_color.rgb * light, u_color.a);
        } else if (u_useGradient) {
            gl_FragColor = mix(u_gradientColor1, u_gradientColor2, v_position.y);
        } else {
            gl_FragColor = u_color;
        }
    }
`;

