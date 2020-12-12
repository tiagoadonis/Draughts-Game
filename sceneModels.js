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
sceneModels[1].sx = 0.045; sceneModels[1].sy = 0.045; sceneModels[1].sz = 0.045;
sceneModels[1].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[1].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[1].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[1].nPhong = 1.0;
sceneModels[1].tx = - 0.24; sceneModels[1].ty = - 0.2; sceneModels[1].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[2].sx = 0.045; sceneModels[2].sy = 0.045; sceneModels[2].sz = 0.045;
sceneModels[2].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[2].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[2].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[2].nPhong = 1.0;
sceneModels[2].tx = - 0.172; sceneModels[2].ty = - 0.2; sceneModels[2].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[3].sx = 0.045; sceneModels[3].sy = 0.045; sceneModels[3].sz = 0.045;
sceneModels[3].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[3].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[3].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[3].nPhong = 1.0;
sceneModels[3].tx = - 0.104; sceneModels[3].ty = - 0.2; sceneModels[3].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[4].sx = 0.045; sceneModels[4].sy = 0.045; sceneModels[4].sz = 0.045;
sceneModels[4].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[4].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[4].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[4].nPhong = 1.0;
sceneModels[4].tx = - 0.036; sceneModels[4].ty = - 0.2; sceneModels[4].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[5].sx = 0.045; sceneModels[5].sy = 0.045; sceneModels[5].sz = 0.045;
sceneModels[5].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[5].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[5].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[5].nPhong = 1.0;
sceneModels[5].tx = 0.031; sceneModels[5].ty = - 0.2; sceneModels[5].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[6].sx = 0.045; sceneModels[6].sy = 0.045; sceneModels[6].sz = 0.045;
sceneModels[6].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[6].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[6].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[6].nPhong = 1.0;
sceneModels[6].tx = 0.099; sceneModels[6].ty = - 0.2; sceneModels[6].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[7].sx = 0.045; sceneModels[7].sy = 0.045; sceneModels[7].sz = 0.045;
sceneModels[7].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[7].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[7].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[7].nPhong = 1.0;
sceneModels[7].tx = 0.166; sceneModels[7].ty = - 0.2; sceneModels[7].tz = 1.55;

sceneModels.push( new cubeModel( 1 ) );
sceneModels[8].sx = 0.045; sceneModels[8].sy = 0.045; sceneModels[8].sz = 0.045;
sceneModels[8].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[8].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[8].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[8].nPhong = 1.0;
sceneModels[8].tx = 0.235; sceneModels[8].ty = - 0.2; sceneModels[8].tz = 1.55;

//----------------------------------------------------------------------------------------

sceneModels.push( new cubeModel( 1 ) );
sceneModels[9].sx = 0.056; sceneModels[9].sy = 0.056; sceneModels[9].sz = 0.056;
sceneModels[9].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[9].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[9].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[9].nPhong = 1.0;
sceneModels[9].tx = - 0.298; sceneModels[9].ty = - 0.2; sceneModels[9].tz = 1.25;

//----------------------------------------------------------------------------------------

sceneModels.push( new cubeModel( 1 ) );
sceneModels[10].sx = 0.071; sceneModels[10].sy = 0.071; sceneModels[10].sz = 0.071;
sceneModels[10].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[10].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[10].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[10].nPhong = 1.0;
sceneModels[10].tx = - 0.3799; sceneModels[10].ty = - 0.2; sceneModels[10].tz = 0.828;

//----------------------------------------------------------------------------------------

sceneModels.push( new cubeModel( 1 ) );
sceneModels[11].sx = 0.102; sceneModels[11].sy = 0.102; sceneModels[11].sz = 0.102;
sceneModels[11].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[11].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[11].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[11].nPhong = 1.0;
sceneModels[11].tx = - 0.534; sceneModels[11].ty = - 0.19; sceneModels[11].tz = 0.02;

//----------------------------------------------------------------------------------------

sceneModels.push( new cubeModel( 1 ) );
sceneModels[12].sx = 0.053; sceneModels[12].sy = 0.053; sceneModels[12].sz = 0.053;
sceneModels[12].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[12].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[12].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[12].nPhong = 1.0;
sceneModels[12].tx = - 0.2738; sceneModels[12].ty = - 0.05; sceneModels[12].tz = 1.16;

//----------------------------------------------------------------------------------------

sceneModels.push( new cubeModel( 1 ) );
sceneModels[13].sx = 0.03; sceneModels[13].sy = 0.03; sceneModels[13].sz = 0.03;
sceneModels[13].kAmbi = [ 0.0, 0.0, 0.0 ]; sceneModels[13].kDiff = [ 0.0, 0.0, 0.0 ]; 
sceneModels[13].kSpec = [ 0.0, 0.0, 0.0 ]; sceneModels[13].nPhong = 1.0;
sceneModels[13].tx = - 0.1489; sceneModels[13].ty = 0.00; sceneModels[13].tz = 1.73;

//----------------------------------------------------------------------------------------

/*sceneModels.push( new cubeModel( 1 ) );
sceneModels[14].sx = 0.04; sceneModels[14].sy = 0.04; sceneModels[14].sz = 0.04;
sceneModels[14].kAmbi = [ 0.1, 0.1, 0.1 ]; sceneModels[14].kDiff = [ 0.5, 0.5, 0.5 ]; 
sceneModels[14].kSpec = [ 0.7, 0.7, 0.7 ]; sceneModels[14].nPhong = 1.0;
sceneModels[14].tx = - 0.25; sceneModels[14].ty = 0.0; sceneModels[14].tz = 1.8;*/
