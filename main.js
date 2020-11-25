// Global Variables
var gl = null;	// WebGL context
var shaderProgram = null; 
var triangleVertexPositionBuffer = null;
var triangleVertexColorBuffer = null;

// The global transformation parameters
// The translation vector
var tx = 0.0;
var ty = 0.0;
var tz = 0.0;

// The rotation angles in degrees
var angleXX = 0.0;
var angleYY = 0.0;
var angleZZ = 0.0;

// The scaling factors
var sx = 1.0;
var sy = 1.0;
var sz = 1.0;

// Animation controls
// YY axes
var rotationYY_ON = 1;
var rotationYY_DIR = 1;
var rotationYY_SPEED = 1;
 
// XX axes
var rotationXX_ON = 1
var rotationXX_DIR = 1;
var rotationXX_SPEED = 1;

// ZZ axes
var rotationZZ_ON = 1
var rotationZZ_DIR = 1;
var rotationZZ_SPEED = 1;

// To allow choosing the way of drawing the model triangles
var primitiveType = null;

// To allow choosing the projection type
var projectionType = 0;

// For storing the vertices defining the triangles
var vertices = [
	// FRONT FACE
	-0.25, -0.25,  0.25,
	 0.25, -0.25,  0.25, 
	 0.25,  0.25,  0.25,
	 
	 0.25,  0.25,  0.25,
	-0.25,  0.25,  0.25,		 
	-0.25, -0.25,  0.25,
	
	// TOP FACE
	-0.25,  0.25,  0.25,
	 0.25,  0.25,  0.25,
	 0.25,  0.25, -0.25,
	 0.25,  0.25, -0.25,
	-0.25,  0.25, -0.25,
	-0.25,  0.25,  0.25,
	
	// BOTTOM FACE 
	-0.25, -0.25, -0.25,
	 0.25, -0.25, -0.25,
	 0.25, -0.25,  0.25,
	 0.25, -0.25,  0.25,
	-0.25, -0.25,  0.25,
	-0.25, -0.25, -0.25,
	
	// LEFT FACE 
	-0.25,  0.25,  0.25,
	-0.25, -0.25, -0.25,
	-0.25, -0.25,  0.25,
	-0.25,  0.25,  0.25,
	-0.25,  0.25, -0.25,
	-0.25, -0.25, -0.25,
	
	// RIGHT FACE 
	 0.25,  0.25, -0.25,
	 0.25, -0.25,  0.25,
	 0.25, -0.25, -0.25,
	 0.25,  0.25, -0.25,
	 0.25,  0.25,  0.25,
	 0.25, -0.25,  0.25,
	
	// BACK FACE 
	-0.25,  0.25, -0.25,
	 0.25, -0.25, -0.25,
	-0.25, -0.25, -0.25,	 
	-0.25,  0.25, -0.25,
	 0.25,  0.25, -0.25,
	 0.25, -0.25, -0.25,			 
];

// And their colour
var colors = [
	// FRONT FACE
	0.0,  0.0,  1.0,
	1.0,  0.75,  0.79,
	1.0,  0.75,  0.79,

	0.00,  1.00,  0.00,
	0.00,  1.00,  0.00,
	0.00,  1.00,  0.00,
				 
	// TOP FACE
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
				 
	// BOTTOM FACE
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
				 
	// LEFT FACE
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
				 
	// RIGHT FACE
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
				 
	// BACK FACE
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,
	1.00,  0.00,  0.00,			 			 
];

// Based on Given Code from Practical Classes
function runWebGL() {
	var canvas = document.getElementById("my-canvas");
	
	initWebGL( canvas );
	shaderProgram = initShaders( gl );
	
	setEventListeners();
	initBuffers();
	tick();		// NEW --- A timer controls the rendering / animation    
	outputInfos();
}

// Based on Given Code from Practical Classes
function initWebGL(canvas) {
	try {	
		// Create the WebGL context
		// Some browsers still need "experimental-webgl"
		gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        
		primitiveType = gl.TRIANGLES;
		
		// DEFAULT: Face culling is DISABLED
		// Enable FACE CULLING
		gl.enable( gl.CULL_FACE );

	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry! :-(");
	}        
}

function render() {
	// Clearing with the background color
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function initBuffers() {	
	// Coordinates
	triangleVertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	triangleVertexPositionBuffer.itemSize = 3;
	triangleVertexPositionBuffer.numItems = vertices.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 
			triangleVertexPositionBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
	
	// Colors	
	triangleVertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	triangleVertexColorBuffer.itemSize = 3;
	triangleVertexColorBuffer.numItems = colors.length / 3;			

	// Associating to the vertex shader
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
			triangleVertexColorBuffer.itemSize, 
			gl.FLOAT, false, 0, 0);
}


// TODO 
/*function resetGame(){

}

function info(){

}*/

