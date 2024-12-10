
var gl; // Global variable for the WebGL rendering context
window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    
    // FIVE Vertices
    var A=vec2(-.3,-.3)
    var B=vec2(-.5,.4)
    var C=vec2(0,.7)
    var D=vec2(.5,.4)
    var E=vec2(.3,-.3)


 //shape 1 (LINE LOOP)
    //var vertices = [A,B ,B,C, C,D, D,E];
   // var vertices = [A,B,C,D,E];

    var vertices = [ A,B,C,A,C,D,A,D,E];

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height ); //Lower-Left Corner
    gl.clearColor( 0, 0, 0, 1 ); //Black Background
    
    //  Load shaders and initialize attribute buffers (Render pixels on the screen)
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" ); //(initShaders) automatically tell whether the parameters are strings of shader programs or the tag ids of the shader programs.
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); //(Convert vertices array into flat formate )

    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" ); //This links vertex data with the shader.
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 ); //2: Each vertex has two components (x, y). // gl.FLOAT: Data type is float. // false: Data is not normalized. // 0: No stride (data is tightly packed). // 0: Offset is zero (starts at the beginning of the buffer).
    gl.enableVertexAttribArray( vPosition );
    

    render();
};


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
   // in case vertices = [A,B,C,D,E];
    //gl.drawArrays( gl.LINE_LOOP, 0, 5);
    //gl.drawArrays( gl.TRIANGLE_FAN, 0, 5);

    //in case vertices = [A,B ,B,C, C,D, D,E, E,A];
   //gl.drawArrays( gl.TRIANGLE_FAN, 0, 8);
    //gl.drawArrays( gl.LINE_LOOP, 0, 8);

   gl.drawArrays( gl.TRIANGLES, 0, 9);
  //gl.drawArrays( gl.LINE_LOOP, 0, 9);



    
}