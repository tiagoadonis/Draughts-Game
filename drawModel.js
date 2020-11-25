function drawModel( model,
					mvMatrix,
					primitiveType ) {

	// The the global model transformation is an input
	// Concatenate with the particular model transformations
    // Pay attention to transformation order !!
	mvMatrix = mult( mvMatrix, translationMatrix( model.tx, model.ty, model.tz ) );
	mvMatrix = mult( mvMatrix, rotationZZMatrix( model.rotAngleZZ ) );
	mvMatrix = mult( mvMatrix, rotationYYMatrix( model.rotAngleYY ) );
	mvMatrix = mult( mvMatrix, rotationXXMatrix( model.rotAngleXX ) );
	mvMatrix = mult( mvMatrix, scalingMatrix( model.sx, model.sy, model.sz ) );
						 
	// Passing the Model View Matrix to apply the current transformation
	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(flatten(mvMatrix)));
    
	// Associating the data to the vertex shader
	// This can be done in a better way !!
	// Vertex Coordinates and Vertex Normal Vectors
	initBuffers(model);
	
	// Material properties
	gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_ambient"), 
		flatten(model.kAmbi) );
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_diffuse"),
        flatten(model.kDiff) );
    gl.uniform3fv( gl.getUniformLocation(shaderProgram, "k_specular"),
        flatten(model.kSpec) );
	gl.uniform1f( gl.getUniformLocation(shaderProgram, "shininess"), 
		model.nPhong );

    // Light Sources
	var numLights = lightSources.length;
	gl.uniform1i( gl.getUniformLocation(shaderProgram, "numLights"), 
		numLights );

	//Light Sources
	for(var i = 0; i < lightSources.length; i++ ){
		gl.uniform1i( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].isOn"),
			lightSources[i].isOn );
		gl.uniform4fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].position"),
			flatten(lightSources[i].getPosition()) );
		gl.uniform3fv( gl.getUniformLocation(shaderProgram, "allLights[" + String(i) + "].intensities"),
			flatten(lightSources[i].getIntensity()) );
    }
        
	// Drawing 
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