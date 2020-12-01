//  Drawing the 3D scene
function drawScene() {
	var pMatrix;

	// Clearing with the background color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// NEW --- Computing the Projection Matrix
	if( projectionType == 0 ) {
		// For now, the default orthogonal view volume
		pMatrix = ortho( -1.0, 1.0, -1.0, 1.0, -1.0, 1.0 );
		
		// No need to move the model into the view volume !!
		tz = 0;
		// TO BE DONE !
		// Allow the user to control the size of the view volume
	}
	else {
		// A standard view volume.
		// Viewer is at (0,0,0)
		// Ensure that the model is "inside" the view volume
		pMatrix = perspective( 45, 1, 0.05, 10 );
		
		tz = -1.5;
	}
	// Passing the Projection Matrix to apply the current projection
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(flatten(pMatrix)));
	
	// Computing the Model-View Matrix
	// Pay attention to the matrix multiplication order!!
	var mvMatrix = mult( rotationZZMatrix( angleZZ ), scalingMatrix( sx, sy, sz ) );
	mvMatrix = mult( rotationYYMatrix( angleYY ), mvMatrix );
	mvMatrix = mult( rotationXXMatrix( angleXX ), mvMatrix );
	mvMatrix = mult( translationMatrix( tx, ty, tz ), mvMatrix );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
	
	// Drawing the contents of the vertex buffer
	// primitiveType allows drawing as filled triangles / wireframe / vertices
	if( primitiveType == gl.LINE_LOOP ) {
		// To simulate wireframe drawing!
		// No faces are defined! There are no hidden lines!
		// Taking the vertices 3 by 3 and drawing a LINE_LOOP
		var i;
		for( i = 0; i < triangleVertexPositionBuffer.numItems / 3; i++ ) {
			gl.drawArrays( primitiveType, 3 * i, 3 ); 
		}
	}	
	else {		
		gl.drawArrays(primitiveType, 0, triangleVertexPositionBuffer.numItems); 
	}
}

// Animation --- Updating transformation parameters
var lastTime = 0;

function animate() {
	var timeNow = new Date().getTime();
	
	if (lastTime != 0) {
		var elapsed = timeNow - lastTime;		
		if (rotationYY_ON) {
			angleYY += rotationYY_DIR * rotationYY_SPEED * (90 * elapsed) / 1000.0;
		}
		else if (rotationXX_ON){
			angleXX += rotationXX_DIR * rotationXX_SPEED * (90 * elapsed) / 1000.0;
		}
		else if (rotationZZ_ON){
			angleZZ += rotationZZ_DIR * rotationZZ_SPEED * (90 * elapsed) / 1000.0;
		}
	}
	lastTime = timeNow;
}

// Timer
function tick() {
	requestAnimFrame(tick);
	drawScene();	
	animate();
}
//  User Interaction
function outputInfos(){
}

function setEventListeners(){
	// Dropdown list
	var projection = document.getElementById("projection-selection");
	
	projection.addEventListener("click", function(){
		// Getting the selection
		var p = projection.selectedIndex;
				
		switch(p){
			case 0 : projectionType = 0;
				break;
			case 1 : projectionType = 1;
				break;
		}  	
	});   
	
	// Dropdown list
	
	var list = document.getElementById("rendering-mode-selection");
	
	list.addEventListener("click", function(){
				
		// Getting the selection
		
		var mode = list.selectedIndex;
				
		switch(mode){
			
			case 0 : primitiveType = gl.TRIANGLES;
				break;
			
			case 1 : primitiveType = gl.LINE_LOOP;
				break;
			
			case 2 : primitiveType = gl.POINTS;
				break;
		}
	});      

	// Button events
	document.getElementById("YY-on-off-button").onclick = function(){
		// Switching on / off
		if( rotationYY_ON ) {
			rotationYY_ON = 0;
		}
		else {
			rotationYY_ON = 1;
		}  
	};

	document.getElementById("XX-on-off-button").onclick = function(){
		// Switching on / off
		if( rotationXX_ON ) {
			rotationXX_ON = 0;
		}
		else {
			rotationXX_ON = 1;
		}  
	};

	document.getElementById("ZZ-on-off-button").onclick = function(){
		// Switching on / off
		if( rotationZZ_ON ) {
			rotationZZ_ON = 0;
		}
		else {
			rotationZZ_ON = 1;
		}  
	};

	document.getElementById("YY-direction-button").onclick = function(){
		// Switching the direction
		if( rotationYY_DIR == 1 ) {
			rotationYY_DIR = -1;
		}
		else {
			rotationYY_DIR = 1;
		}  
	};      

	document.getElementById("XX-direction-button").onclick = function(){
		// Switching the direction
		if( rotationXX_DIR == 1 ) {
			rotationXX_DIR = -1;
		}
		else {
			rotationXX_DIR = 1;
		}  
	}; 

	document.getElementById("ZZ-direction-button").onclick = function(){
		// Switching the direction
		if( rotationZZ_DIR == 1 ) {
			rotationZZ_DIR = -1;
		}
		else {
			rotationZZ_DIR = 1;
		}  
	}; 

	document.getElementById("YY-slower-button").onclick = function(){
		rotationYY_SPEED *= 0.75;  
	};      

	document.getElementById("XX-slower-button").onclick = function(){
		rotationXX_SPEED *= 0.75;  
	};

	document.getElementById("ZZ-slower-button").onclick = function(){
		rotationZZ_SPEED *= 0.75;  
	};

	document.getElementById("YY-faster-button").onclick = function(){	
		rotationYY_SPEED *= 1.25;  
	};      

	document.getElementById("XX-faster-button").onclick = function(){	
		rotationXX_SPEED *= 1.25;  
	};  
	
	document.getElementById("ZZ-faster-button").onclick = function(){	
		rotationZZ_SPEED *= 1.25;  
	};  

	document.getElementById("reset-button").onclick = function(){
		// The initial values
		// YY axes
		tx = 0.0;
		ty = 0.0;
		tz = 0.0;
		angleXX = 0.0;
		angleYY = 0.0;
		angleZZ = 0.0;
		sx = 0.8;
		sy = 0.8;
		sz = 0.8;

		// YY axes
		rotationYY_ON = 0;
		rotationYY_DIR = 1;
		rotationYY_SPEED = 1;

		// XX axes
		rotationXX_ON = 0;
		rotationXX_DIR = 1;
		rotationXX_SPEED = 1;

		// ZZ axes
		rotationZZ_ON = 0;
		rotationZZ_DIR = 1;
		rotationZZ_SPEED = 1;
	};      

	document.getElementById("face-culling-button").onclick = function(){
		
		if( gl.isEnabled( gl.CULL_FACE ) )
		{
			gl.disable( gl.CULL_FACE );
		}
		else
		{
			gl.enable( gl.CULL_FACE );
		}
	};
}