function emptyModelFeatures() {
	// EMPTY MODEL
	this.vertices = [];
	this.normals = [];

	// Transformation parameters
	// Displacement vector
	this.tx = 0.0;
	this.ty = 0.0;
	this.tz = 0.0;	
	
	// Rotation angles	
	this.rotAngleXX = 35.0;
	this.rotAngleYY = 0.0;
	this.rotAngleZZ = 0.0;	

	// Scaling factors
	this.sx = 0.90;
	this.sy = 0.90;
	this.sz = 0.90;		
	
	// Animation controls
	this.rotXXOn = false;
	this.rotYYOn = false;
	this.rotZZOn = false;
	
	this.rotXXSpeed = 1.0;
	this.rotYYSpeed = 1.0;
	this.rotZZSpeed = 1.0;
	
	this.rotXXDir = 1;
	this.rotYYDir = 1;
	this.rotZZDir = 1;
	
	// Material features
	this.kAmbi = [ 0.21,0.13,0.05 ];
	this.kDiff = [ 0.71,0.43,0.18 ];
	this.kSpec = [ 0.39,0.27,0.17 ];
	this.nPhong = 25.6;
}

function singleTriangleModel( ) {
	var triangle = new emptyModelFeatures();
	
	// Default model has just ONE TRIANGLE
	triangle.vertices = [
		// FRONTAL TRIANGLE
		-0.5, -0.5,  0.5,
		 0.5, -0.5,  0.5,
		 0.5,  0.5,  0.5,
	];

	triangle.normals = [
		// FRONTAL TRIANGLE
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
		 0.0,  0.0,  1.0,
	];

	return triangle;
}

function simpleCubeModel( ) {	
	var cube = new emptyModelFeatures();
	
	cube.vertices = [
			// FRONT FACE
			-0.75, -0.25,  0.75,
			 0.75, -0.25,  0.75, 
			 0.75, -0.20,  0.75,
			 0.75, -0.20,  0.75,
			-0.75, -0.20,  0.75,		 
			-0.75, -0.25,  0.75,
   
			// TOP FACE
			-0.75, -0.20,  0.75,
			 0.75, -0.20,  0.75,
			 0.75, -0.20, -0.75,
			 0.75, -0.20, -0.75,
			-0.75, -0.20, -0.75,
			-0.75, -0.20,  0.75,

			// BOTTOM FACE 
			-0.75, -0.25, -0.75,
			 0.75, -0.25, -0.75,
			 0.75, -0.25,  0.75,
			 0.75, -0.25,  0.75,
			-0.75, -0.25,  0.75,
			-0.75, -0.25, -0.75,
   
			// LEFT FACE 
			-0.75, -0.20,  0.75,
			-0.75, -0.25, -0.75,
			-0.75, -0.25,  0.75,
			-0.75, -0.20,  0.75,
			-0.75, -0.20, -0.75,
			-0.75, -0.25, -0.75,
   
			// RIGHT FACE 
			0.75, -0.20, -0.75,
			0.75, -0.25,  0.75,
			0.75, -0.25, -0.75,
			0.75, -0.20, -0.75,
			0.75, -0.20,  0.75,
			0.75, -0.25,  0.75,
   
			// BACK FACE 
			-0.75, -0.20, -0.75,
			 0.75, -0.25, -0.75,
			-0.75, -0.25, -0.75,
			-0.75, -0.20, -0.75,
			 0.75, -0.20, -0.75,
			 0.75, -0.25, -0.75,	 
	];
	computeVertexNormals( cube.vertices, cube.normals );
	return cube;
}

function cubeModel( subdivisionDepth = 0 ) {	
	var cube = new simpleCubeModel();
	
	midPointRefinement( cube.vertices, subdivisionDepth );
	
	computeVertexNormals( cube.vertices, cube.normals );
	
	return cube;
}

function simpleTetrahedronModel( ) {	
	var tetra = new emptyModelFeatures();
	
	tetra.vertices = [
		-1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000,  1.000000,  0.707000, 
         0.000000, -1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000, 
         0.000000,  1.000000,  0.707000, 
        -1.000000,  0.000000, -0.707000, 
         1.000000,  0.000000, -0.707000, 
         0.000000, -1.000000,  0.707000,
	];

	computeVertexNormals( tetra.vertices, tetra.normals );

	return tetra;
}

function tetrahedronModel( subdivisionDepth = 0 ) {	
	var tetra = new simpleTetrahedronModel();
	
	midPointRefinement( tetra.vertices, subdivisionDepth );
	
	computeVertexNormals( tetra.vertices, tetra.normals );
	
	return tetra;
}

function sphereModel( subdivisionDepth = 2 ) {	
	var sphere = new simpleCubeModel();
	
	midPointRefinement( sphere.vertices, subdivisionDepth );
	
	moveToSphericalSurface( sphere.vertices )
	
	computeVertexNormals( sphere.vertices, sphere.normals );
	
	return sphere;
}

var sceneModels = [];

// Board
sceneModels.push( new cubeModel( 1 ) );

// Checkered Panel
sceneModels.push( new cubeModel( 1 ) );
sceneModels[1].sx = 0.72; sceneModels[1].sy = 0.72; sceneModels[1].sz = 0.72;
sceneModels[1].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[1].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[1].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[1].nPhong = 1.0;
sceneModels[1].tx = 0.0; sceneModels[1].ty = - 0.04; sceneModels[1].tz = 0.0;

/*sceneModels[1].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[1].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[1].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[1].nPhong = 1.0;
sceneModels[1].tx = -0.50; sceneModels[1].ty = - 0.205; sceneModels[1].tz = 0.0;
sceneModels[1].sx = 0.05; sceneModels[1].sy = 0.05; sceneModels[1].sz = 0.05;*/