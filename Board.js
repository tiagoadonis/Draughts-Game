class Board{
    constructor(x,y,z,side){
		
		// Material
		this.materialConstants = materials.GOLD;
		this.kAmbi = this.materialConstants.slice(0,3);
		this.kDiff = this.materialConstants.slice(3,6);
		this.kSpec = this.materialConstants.slice(6,9);
		this.nPhong = this.materialConstants[9];

		//Slots
		this.slotDraughtDic = new Array();
		var baseVal = x-(side/2);
		var x1 = baseVal;
		var z1 = baseVal;
		var colorBool = true;
		this.slots = new Array(8);
		for (var i = 0; i < this.slots.length; i++) {
			this.slots[i] = new Array(8);
			for (var j = 0; j < this.slots[i].length; j++) {
				this.slots[i][j] = new Slot(colorBool,x1,y,z1,side/8);
				this.slotDraughtDic[8*i+j] = null;
				colorBool = !colorBool;
				z1++;
			}
			colorBool = !colorBool;
			x1++;
			z1 = baseVal;
		}
		this.selectedSlot = [];
		this.overSlot = null;

		// Draugths
		const blackTeamStartPositions = [	[1,0],[3,0],[5,0],[7,0],
											[0,1],[2,1],[4,1],[6,1],
											[1,2],[3,2],[5,2],[7,2] ];
		const whiteTeamStartPositions = [	[0,7],[2,7],[4,7],[6,7],
											[1,6],[3,6],[5,6],[7,6],
											[0,5],[2,5],[4,5],[6,5] ];
		this.draughts = [];

		for (var i = 0; i < blackTeamStartPositions.length; i++) {
			var j = blackTeamStartPositions[i][0];
			var k = blackTeamStartPositions[i][1];
			var coords = this.slots[j][k].getCoords();

			this.draughts[i] = new Draught(false,coords[0],coords[1],coords[2],side/16);
			this.slotDraughtDic[8*j+k] = this.draughts[i];
		}
		for (var i = 0; i < whiteTeamStartPositions.length; i++) {
			var j = whiteTeamStartPositions[i][0];
			var k = whiteTeamStartPositions[i][1];
			var coords = this.slots[j][k].getCoords();

			this.draughts[i + blackTeamStartPositions.length] = new Draught(true,coords[0],coords[1],coords[2],side/16);
			this.slotDraughtDic[8*j+k] = this.draughts[i + blackTeamStartPositions.length];
		}

		// Captured Draughts
		
		this.capturedStack = { true : [], false : [] };
		this.capturedStackBaseLocation = {	true	: [ x-side/2-(2*side/8), y, z-side/2 ],
											false	: [ x+side/2+(2*side/8), y, z+side/2 ] };

		this.vertices = [x-side/2, y, z-side/2,
						 x-side/2, y, z+side/2,
						 x+side/2,y , z-side/2,
						 x+side/2,y , z+side/2];

		// Computing the triangle normal vector for every vertex
        this.normals = [];
        computeVertexNormals( this.vertices, this.normals );

		this.colors = [];
		this.colors.push( 102 / 255 );
		this.colors.push( 51 / 255 );
		this.colors.push( 0 / 255 );

		this.currentTeam = true;

		this.gameOver = false;
	}

	//Getters
	getSlots() {
		return this.slots;
	}

	isPlayablePosition(x,z) {
		return (x+z)%2==1;
	}

	getDraughts() {
		return this.draughts;
	}

	getNumberOfDraughts() {
		return this.draughts.length;
	}

	getNumberOfSlots() {
		return this.slots.length * this.slots[0].length;
	}

	getColors() {
		return this.colors;
	}

	getSelectedSlot() {
		return this.selectedSlot;
	}

	getSelectedSlotObject() {
		return this.slots[this.selectedSlot[0]][this.selectedSlot[1]];
	}

	getOverSlot() {
		return this.overSlot;
	}

	// Playing Logic
	
	isValidPosition(pos) {
		return(pos.length==2 && pos[0]>=0 && pos[0]<=7 && pos[1]>=0 && pos[1]<=7);
	}

	isValidPlay(posI, posF, team) {
		console.log(posI);
		console.log(posF);
		console.log(team);
		if(posI[0]==posF[0] && posI[1]==posF[1]) {
			console.log("1");
			return false;
		}
		if(this.isValidPosition(posI) && this.isValidPosition(posF)) {
			if(this.slotDraughtDic[8*posI[0]+posI[1]].getTeam()==team && this.slotDraughtDic[8*posF[0]+posF[1]]===null) {
				if(team) {	
					// Advance
					if(posF[1]==posI[1]-1) {
						return(posF[0]==posI[0]-1 || posF[0]==posI[0]+1);
					}
					// Capture
					else if(posF[1]==posI[1]-2) {
						if(posF[0]==posI[0]-2) {
							return this.slotDraughtDic[8*(posI[0]-1)+posI[1]-1].getTeam()==(!team);
						}
						else if(posF[0]==posI[0]+2) {
							return this.slotDraughtDic[8*(posI[0]+1)+posI[1]-1].getTeam()==(!team);
						}
					}
					return false;
				}
				else {
					// Advance
					if(posF[1]==posI[1]+1) {
						return(posF[0]==posI[0]-1 || posF[0]==posI[0]+1);
					}
					// Capture
					else if(posF[1]==posI[1]+2) {
						if(posF[0]==posI[0]-2) {
							return this.slotDraughtDic[8*(posI[0]-1)+posI[1]+1].getTeam()==(!team);
						}
						else if(posF[0]==posI[0]+2) {
							return this.slotDraughtDic[8*(posI[0]+1)+posI[1]+1].getTeam()==(!team);
						}
					}
					return false;
				}
			}
			return false;
		}
		return false;
	}

	play(posI, posF, team) {
		// Get initial and final slot
		var posFSlot = this.slots[posF[0]][posF[1]];

		// Update draught information
		var draught = this.slotDraughtDic[8*posI[0]+posI[1]];
		var currentCoords = draught.getCoords();
		var newCoords = posFSlot.getCoords();
		draught.setCoords(newCoords);
		console.log("newCoords= "+newCoords);

		// Compute tx, ty, tz of the draught
		var diffCoords = [];
		diffCoords.push(newCoords[0] - currentCoords[0]);
		diffCoords.push(newCoords[1] - currentCoords[1]);
		diffCoords.push(newCoords[2] - currentCoords[2]);
		draught.setDiffCoords(diffCoords);
		console.log("diffCoords= "+diffCoords);

		// Update slot -> draught dictionary
		this.slotDraughtDic[8*posF[0]+posF[1]] = this.slotDraughtDic[8*posI[0]+posI[1]];
		this.slotDraughtDic[8*posI[0]+posI[1]] = null;

		// Capture
		if(posF[0]==posI[0]-2 || posF[0]==posI[0]+2) {
			// Retrieve captured Draught reference
			var capturedDraught = this.slotDraughtDic[4*(posI[0]+posF[0])+(posI[1]+posF[1])/2];

			// Update draught coordinates
			var capturedCurrentCoords = capturedDraught.getCoords();
			var stackCoords = [this.capturedStackBaseLocation[team][0], this.capturedStackBaseLocation[team][1], this.capturedStackBaseLocation[team][2]];
			console.log(this.capturedStackBaseLocation);
			console.log("stackCoords= "+stackCoords);
			var capturedNewCoords = [this.capturedStackBaseLocation[team][0], this.capturedStackBaseLocation[team][1]+this.capturedStack[team].length*capturedDraught.getHeight(), this.capturedStackBaseLocation[team][2]];
			capturedDraught.setCoords(capturedNewCoords);
			capturedDraught.setDiffCoords([capturedNewCoords[0]-capturedCurrentCoords[0], capturedNewCoords[1]-capturedCurrentCoords[1], capturedNewCoords[2]-capturedCurrentCoords[2]]);
			console.log("capturedNewCoords= "+capturedNewCoords);
			console.log("capturedDiffCoords= "+[capturedNewCoords[0]-capturedCurrentCoords[0], capturedNewCoords[1]-capturedCurrentCoords[1], capturedNewCoords[2]-capturedCurrentCoords[2]]);

			// Insert draught in stack
			this.capturedStack[team].push(capturedDraught);

			// Remove captured
			this.slotDraughtDic[4*(posI[0]+posF[0])+(posI[1]+posF[1])/2] = null;
		}
		this.currentTeam = !this.currentTeam;
		this.gameOver = this.capturedStack[true].length == 12 || this.capturedStack[false].length == 12;
		// To make visible any changes in the draughts
		initBuffersDraughts();
	}

	// Slots Logic
	
	moveOverRight() {
		if(this.overSlot === null) {
			this.overSlot = [0,7];
		}
		else {
			this.resetOverSlot();
			this.overSlot[0] = (this.overSlot[0]+1)%8;
		}

		this.selectOverSlot();
	}

	moveOverLeft() {
		if(this.overSlot === null) {
			this.overSlot = [0,7];
		}
		else {
			this.resetOverSlot();
			this.overSlot[0] = (this.overSlot[0]+7)%8;
		}

		this.selectOverSlot();
	}

	moveOverDown() {
		if(this.overSlot === null) {
			this.overSlot = [0,7];
		}
		else {
			this.resetOverSlot();
			this.overSlot[1] = (this.overSlot[1]+1)%8;
		}

		this.selectOverSlot();
	}

	moveOverUp() {
		if(this.overSlot === null) {
			this.overSlot = [0,7];
		}
		else {
			this.resetOverSlot();
			this.overSlot[1] = (this.overSlot[1]+7)%8;
		}

		this.selectOverSlot();
	}

	selectOverSlot() {
		// obtain the slot
		var xd = this.overSlot[0];
		var yd = this.overSlot[1];
		var slot = this.slots[xd][yd];

		// change the color
		slot.setOverColors();
		initBuffersSlots();
	}

	resetOverSlot() {
		if (this.overSlot[0] != this.selectedSlot[0] ||  this.overSlot[1] != this.selectedSlot[1]) {
			// obtain the slot
			var xd = this.overSlot[0];
			var yd = this.overSlot[1];
			var slot = this.slots[xd][yd];

			// change the color
			slot.resetColors();
			initBuffersSlots();
		}
	}

	selectSlot() {
		if (this.overSlot != null) {
			if (this.selectedSlot == 0) {
				// obtain coordinates of the slot
				var xd = this.overSlot[0];
				var yd = this.overSlot[1];

				// verify if has a draught and if it's the correct team
				if (this.slotDraughtDic[8 * xd + yd] === null || this.slotDraughtDic[8 * xd + yd].getTeam() !== this.currentTeam) {
					return;
				}

				// Select the slot (selected slot = over slot)
				this.selectedSlot = [];
				this.selectedSlot[0] = this.overSlot[0];
				this.selectedSlot[1] = this.overSlot[1];

				// obtain the slot
				var slot = this.slots[x][z];

				// change the slot color
				slot.setSelectedColors();
				initBuffersSlots();
			} else {
				if (this.isValidPlay(this.selectedSlot, this.overSlot, this.currentTeam)) {
					console.log("Valid play");
					this.play(this.selectedSlot, this.overSlot, this.currentTeam);
					this.deselectSlot();
				} else {
					console.log("Invalid play");
				}
			}
		}
	}

	deselectSlot() {
		// Deselect the slot and change its color
		// obtain the slot
		if(this.selectedSlot == []) {
			return;
		}
		var xd = this.selectedSlot[0];
		var yd = this.selectedSlot[1];
		var slot = this.slots[xd][yd];

		// change the color
		slot.resetColors();
		initBuffersSlots();

		// reset the selected slot
		this.selectedSlot = [];
	}

	//Game info

	getGameOver() {
		return this.gameOver;
	}

	getWinningTeam() {
		if (this.capturedStack[true].length == 12) return "Team 1";
		return "Team 2";
	}

	getScores() {
		return [this.capturedStack[true].length, this.capturedStack[false].length]
	}

	changeTeamPieces(team, color) {	
		for (var i = 0; i < this.draughts.length; i++) {
			if (this.draughts[i].getTeam() === team) {
				// change color
				this.draughts[i].setColor(color);
			}
		}

	}

	// For illumination

	//setMaterial()????????????????????????

	getMaterial() {
		return [this.kAmbi, this.kDiff, this.kSpec, this.nPhong];
	}
}

class Slot {

	// colorBool is boolean for there are two and only two colors
	// x, y and z are idCoord (center of top face)
	// s is side
	// h is height
	constructor(color,x,y,z,s) {
		this.colorBool = color;
		this.idCoords = [x,y,z];
		this.vertices = [	x-s/2,	y,	z-s/2,
							x-s/2,	y,	z+s/2,
							x+s/2,	y,	z-s/2,
							x+s/2,	y,	z+s/2];
		this.colors = [];
		this.resetColors();
	}

	getCoords() {
		return this.idCoords;
	}

	getColorBool() {
		return this.colorBool;
	}

	getVertices() {
		return this.vertices;
	}

	getColors() {
		return this.colors;
	}

	setSelectedColors() {
		console.log("before" + this.colors);
		for (var i = 0; i < this.colors.length; i+= 3) {
			this.colors[i] = 1.0;
			this.colors[i+1] = 0.27;
			this.colors[i+2] = 0;
		}
		console.log("after" + this.colors);
	}

	setOverColors() {
		if(	this.colors[0]!=1 || this.colors[1]!=0.27 || this.colors[2]!=0) {
			for (var i = 0; i < this.colors.length; i+= 3) {
				this.colors[i] = 0.48;
				this.colors[i+1] = 0.98;
				this.colors[i+2] = 0;
			}
		}
	}

	resetColors() {

		var color = 0.25;
		if (this.colorBool) {
			color = 0.75;
		}

		var length = this.vertices.length;
		for (var i = 0; i < length; i++) {
			this.colors[i] = color;
		}
	}
}

class Draught {

	constructor(team, x, y, z, r, h=0.5) {
		this.height = h;
		this.radius = r;
		this.team = team;
		this.idCoords = [x,y,z];
		this.colors = [];
		this.setColor(0);
		this.diffCoords = [0, 0, 0];
	}

	getCoords() {
		return this.idCoords;
	}

	getTeam() {
		return this.team;
	}

	getColors() {
		return this.colors;
	}

	getDiffCoords(coords) {
		return this.diffCoords;
	}

	getHeight() {
		return this.height;
	}

	getRadius() {
		return this.radius;
	}

	setCoords(newCoords) {
		this.idCoords = newCoords;
	}

	setDiffCoords(coords) {
		this.diffCoords = coords;
	}

	//Color

	setColor(colorCode) {
		if (this.team) {
			switch (colorCode) {
				case 1:
					// Color 0 red
					this.setColorDraught([255, 0, 0]);
					break;
				default:
					// Color 1 Gray
					this.setColorDraught([127, 127, 127]);
					break;
			}
		}
		else {
			switch (colorCode) {
				case 1:
					// Color 0 green
					this.setColorDraught([0, 255, 0]);
					break;
				default:
					// Color 1 Black
					this.setColorDraught([0, 0, 0]);
					break;
			}
		}

	}

	setColorDraught(color) {
		this.colors = [];

		this.colors.push( color[0] / 255);
		this.colors.push( color[1] / 255);
		this.colors.push( color[2] / 255);

	}
}

const materials = {
	BRONZE:			    [0.21,0.13,0.05,    0.71,0.43,0.18,		0.39,0.27,0.17,		25.6],
	POLISHED_BRONZE:    [0.25,0.15,0.06,	0.40,0.24,0.10,		0.77,0.46,0.20,		76.8],
    COPPER: 			[0.19,0.07,0.02,	0.70,0.27,0.08,		0.26,0.14,0.08,		12.8],
	POLISHED_COPPER:	[0.23,0.08,0.03,	0.55,0.21,0.07,		0.58,0.22,0.07,		51.2],
	CHROMIUM:			[0.25,0.25,0.25,	0.40,0.40,0.40,		0.77,0.77,0.77,		76.8],
	BRASS:				[0.33,0.22,0.03,	0.78,0.57,0.11,		0.99,0.94,0.81,		27.9],
	GOLD:				[0.25,0.20,0.07,	0.75,0.60,0.23,		0.63,0.56,0.37,		51.2],
	POLISHED_GOLD:		[0.25,0.22,0.06,	0.35,0.31,0.09,		0.80,0.73,0.21,		83.2],
	POLISHED_SILVER:	[0.23,0.23,0.23,	0.28,0.28,0.28,		0.77,0.77,0.77,		89.6],
	RED_PLASTIC:		[0.30,0.00,0.00,	0.60,0.00,0.00,		0.80,0.60,0.60,		32.0],
	SHINY_BLUE: 		[0.00,0.00,0.50,	0.00,0.00,1.00,		1.00,1.00,1.00,		125.0],
	GRAY:				[0.10,0.10,0.10,	0.50,0.50,0.50,     0.70,0.70,0.70,	    1.0	]	
};