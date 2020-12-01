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
				this.slots[i][j] = new Slot(colorBool,x1,0,z1);
				this.slotDraughtDic[8*i+j] = null;
				colorBool = !colorBool;
				z1++;
			}
			colorBool = !colorBool;
			x1++;
			z = baseVal;
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

			this.draughts[i] = new Draught(false,coords[0],coords[1],coords[2]);
			this.slotDraughtDic[8*j+k] = this.draughts[i];
		}
		for (var i = 0; i < whiteTeamStartPositions.length; i++) {
			var j = whiteTeamStartPositions[i][0];
			var k = whiteTeamStartPositions[i][1];
			var coords = this.slots[j][k].getCoords();

			this.draughts[i + blackTeamStartPositions.length] = new Draught(true,coords[0],coords[1],coords[2]);
			this.slotDraughtDic[8*j+k] = this.draughts[i + blackTeamStartPositions.length];
		}

		// Captured Draughts
		//TO DO
		//
		//
		//
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