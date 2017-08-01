var drawHere = document.getElementById('drawHere');
var timeA, timeB, timeDif;
var HValueArr = [];
var lastNode = 0;
var count = 0;
var ID = 0;
var makePath = false;
var position;
var theGrid = [];
var pathArr = [];
var pathSpot = 0;
var pathDone = false;
var pathing = false;
var to = 100;
var startL;
var useJump = false;
var worldSize = 400;
var roomSize = 40;
var gridWidth = worldSize/roomSize;

var animateMaze = false;
var startMaze = false;
var x;
var y;
var hig;
var wid;
var maze;


var move = [10, 14, 10, 14, 10, 14, 10, 14];

function setup() {
	var myCanvas = createCanvas(worldSize+10, worldSize+100);
	myCanvas.parent('drawHere');

	for (var i = 0; i < (gridWidth*gridWidth); i++) {
		theGrid.push(true);
	}

	theGrid = updateGrid(gridWidth, theGrid);
	for (var i = 0; i < (gridWidth*gridWidth); i++) {
		if (theGrid[i] === false) {
			fill(0);
			rect((i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize, roomSize, roomSize);
		}
	}
	
	textSize(8);
	textAlign(CENTER);
	rectMode(CORNER);
	ellipseMode(CORNER);
}


function mouseDragged() {
	var num = ((int)(mouseY/roomSize)*gridWidth)+(int)(mouseX/roomSize);
	theGrid[num] = false;
	fill(0);
	rect((num % gridWidth) * roomSize, (int)(num / gridWidth) * roomSize, roomSize, roomSize);
}

function keyTyped () {
	//console.log("key pressed");
	if (key === 't') {
		//console.log("ttttt");
		to = ((int)(mouseY/roomSize)*gridWidth)+(int)(mouseX/roomSize);
		fill(255, 0, 255);
		rect((to % gridWidth) * roomSize, (int)(to / gridWidth) * roomSize, roomSize, roomSize);
		//console.log(to);
	}

	else if (key === 's') {
		//console.log("ssss");
		position = ((int)(mouseY/roomSize)*gridWidth)+(int)(mouseX/roomSize);
		fill(255, 0, 0);
		rect((position % gridWidth) * roomSize, (int)(position / gridWidth) * roomSize, roomSize, roomSize);
		//console.log(position);
	}

	else if (key === 'p') {
		//console.log("pppp");
		background(255);
		theGrid = updateGrid(gridWidth, theGrid);
		for (var i = 0; i < (gridWidth*gridWidth); i++) {
			if (theGrid[i] === false) {
				stroke(0);
				strokeWeight(1);
				if (i < (gridWidth*gridWidth) - 1 && theGrid[i+1])
					line((i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize, 
						(i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize + roomSize);
				if (i > 0 && theGrid[i-1])
					line((i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize, 
						(i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize + roomSize);
				if (i < (gridWidth*gridWidth) - gridWidth && theGrid[i+gridWidth])
					line((i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize + roomSize, 
						(i % gridWidth) * roomSize + roomSize, (int)(i / gridWidth) * roomSize + roomSize);
				if (i > gridWidth && theGrid[i-gridWidth])
					line((i % gridWidth) * roomSize, (int)(i / gridWidth) * roomSize + roomSize, 
						(i % gridWidth) * roomSize + roomSize, (int)(i / gridWidth) * roomSize + roomSize);
			}
		}
		makePath = true;
	} 

	else if (key === 'c') {
		var num = ((int)(mouseY/roomSize)*gridWidth)+(int)(mouseX/roomSize);
		theGrid[num] = true;
		fill(255);
		rect((num % gridWidth) * roomSize, (int)(num / gridWidth) * roomSize, roomSize, roomSize);
	} 

	else if (key === 'j') {
		if (useJump) {
			useJump = false;
		} else {
			useJump = true;
		}
	}

	else if (key === 'm') {
		if (!animateMaze) {
			background(255);
			var mazeTree = new TreeMaze(0, 0, false, true, true, false, false, false, false, true);
			mazeTree = makeMaze(0, 0, gridWidth, gridWidth, mazeTree);
			mazeTree.traverseDF(function (node) {
				
				stroke(0);
				strokeWeight(1);
				if (!node.data.u && !node.data.ut) line(node.data.x * roomSize, node.data.y * roomSize, node.data.x * roomSize + roomSize, node.data.y * roomSize);

				if (!node.data.r && !node.data.rt) line(node.data.x * roomSize + roomSize, node.data.y * roomSize, node.data.x * roomSize + roomSize, node.data.y * roomSize + roomSize);

				if (!node.data.d && !node.data.dt) line(node.data.x * roomSize, node.data.y * roomSize + roomSize, node.data.x * roomSize + roomSize, node.data.y * roomSize + roomSize);

				if (!node.data.l && !node.data.lt) line(node.data.x * roomSize, node.data.y * roomSize, node.data.x * roomSize, node.data.y * roomSize + roomSize);



				stroke(255, 0, 0);
				if (node.parent != null)
					line(node.data.x * roomSize + roomSize/2, node.data.y * roomSize + roomSize/2, 
						node.parent.data.x * roomSize + roomSize/2, node.parent.data.y * roomSize + roomSize/2);

				stroke(0);
				if (!node.data.u) rect(node.data.x * roomSize + roomSize/2 - roomSize/10, node.data.y * roomSize, roomSize/5, roomSize/5);
				if (!node.data.r) rect(node.data.x * roomSize + roomSize - roomSize/5, node.data.y * roomSize + roomSize/2 - roomSize/10, roomSize/5, roomSize/5);
				if (!node.data.d) rect(node.data.x * roomSize + roomSize/2 - roomSize/10, node.data.y * roomSize + roomSize - roomSize/5, roomSize/5, roomSize/5);
				if (!node.data.l) rect(node.data.x * roomSize, node.data.y * roomSize + roomSize/2 - roomSize/10, roomSize/5, roomSize/5);

				stroke(255, 0, 0);

				if (node.data.ut) rect(node.data.x * roomSize + roomSize/2 - roomSize/10, node.data.y * roomSize, roomSize/7, roomSize/7);
				if (node.data.rt) rect(node.data.x * roomSize + roomSize - roomSize/5, node.data.y * roomSize + roomSize/2 - roomSize/10, roomSize/7, roomSize/7);
				if (node.data.dt) rect(node.data.x * roomSize + roomSize/2 - roomSize/10, node.data.y * roomSize + roomSize - roomSize/5, roomSize/7, roomSize/7);
				if (node.data.lt) rect(node.data.x * roomSize, node.data.y * roomSize + roomSize/2 - roomSize/10, roomSize/7, roomSize/7);

			});
} else {
	background(255);
	maze = new TreeMaze(0, 0, false, true, true, false, false, false, false, true);
	x = 0;
	y = 0;
	wid = gridWidth;
	hig = gridWidth;
	startMaze = true;
}

}
}





function draw() {
	//background(255);
	//text(mouseX+", "+mouseY, mouseX, mouseY-5);

	//console.log(useJump);

	if (animateMaze && startMaze) {
		var neighborsM = [true, true, true, true, false, false, false, false];
		var randSpotM;
		var spotChosenM = false;
		var completeM = false;
		var openSpotsM = 4;
		var pxM, pyM;

		console.log(x+", "+y);

		if (y-1 < 0) { 
			neighborsM[0] = false;
			openSpotsM--;
		} if (x+1 > wid-1) { 
			neighborsM[1] = false;
			openSpotsM--;
		} if (y+1 > hig-1) { 
			neighborsM[2] = false;
			openSpotsM--;
		} if (x-1 < 0) { 
			neighborsM[3] = false;
			openSpotsM--;
		}


		maze.traverseDF(function (node) {
			if (neighborsM[0] && node.data.x === x && node.data.y === y-1) { 
				neighborsM[0] = false;
				openSpotsM--;
			} if (neighborsM[1] && node.data.x === x+1 && node.data.y === y) { 
				neighborsM[1] = false;
				openSpotsM--;
			} if (neighborsM[2] && node.data.x === x && node.data.y === y+1) { 
				neighborsM[2] = false;
				openSpotsM--;
			} if (neighborsM[3] && node.data.x === x-1 && node.data.y === y) { 
				neighborsM[3] = false;
				openSpotsM--;
			}
		});


		if (openSpotsM > 0) {

			while(spotChosenM === false) {
				randSpotM = randomInt(0, 3);
				if (neighborsM[randSpotM]) {
					spotChosenM = true;
				}
			}

			neighborsM[((randSpotM+2)%4)+4] = true;

			if (randSpotM === 0) {
				maze.add(x, y-1, neighborsM, x, y);
				y--;
			} else if (randSpotM === 1) {
				maze.add(x+1, y, neighborsM, x, y);
				x++;
			} else if (randSpotM === 2) {
				maze.add(x, y+1, neighborsM, x, y);
				y++;
			} else if (randSpotM === 3) {
				maze.add(x-1, y, neighborsM, x, y);
				x--;
			}
		}


		else {
			maze.traverseDF (function (node) {
				if (node.data.x === x && node.data.y === y) {
					if (node.parent === null) {
						completeM = true;
					} else {
						pxM = node.parent.data.x;
						pyM = node.parent.data.y;
						return false;
					}
				}
			});

			if (completeM) {
				startMaze = false;
				console.log("Done");
			} else {
				x = pyM;
				y = pyM;
			}
		}


		stroke(0);
		strokeWeight(1);
		if (!neighborsM[0] && !neighborsM[4]) line(x * roomSize, y * roomSize, x * roomSize + roomSize, y * roomSize);

		if (!neighborsM[1] && !neighborsM[5]) line(x * roomSize + roomSize, y * roomSize, x * roomSize + roomSize, y * roomSize + roomSize);

		if (!neighborsM[2] && !neighborsM[6]) line(x * roomSize, y * roomSize + roomSize, x * roomSize + roomSize, y * roomSize + roomSize);

		if (!neighborsM[3] && !neighborsM[7]) line(x * roomSize, y * roomSize, x * roomSize, y * roomSize + roomSize);

		stroke(255, 0, 0);

		if (neighborsM[4]) rect(x * roomSize + roomSize/2 - roomSize/10, y * roomSize, roomSize/7, roomSize/7);
		if (neighborsM[5]) rect(x * roomSize + roomSize - roomSize/5, y * roomSize + roomSize/2 - roomSize/10, roomSize/7, roomSize/7);
		if (neighborsM[6]) rect(x * roomSize + roomSize/2 - roomSize/10, y * roomSize + roomSize - roomSize/5, roomSize/7, roomSize/7);
		if (neighborsM[7]) rect(x * roomSize, y * roomSize + roomSize/2 - roomSize/10, roomSize/7, roomSize/7);

		for (var h = 0; h < 10000; h++){for (var r = 0; r < 100000; r++){}}
	}

	if (makePath) {
		HValueArr = [];
		calcHValue(to, 0);
		strokeWeight(.1);
		for (var i = 0; i < HValueArr.length; i++) {
			text(HValueArr[i], (i % gridWidth) * roomSize + roomSize/2, (int)(i / gridWidth) * roomSize + roomSize*.75);
		}
		strokeWeight(1);

		arrForParents = [];




		if (useJump) {
			var jumpList = new Tree(HValueArr[position], 0, position, 8, 'false');
			//var closed = [];
			var date1 = new Date();
			timeA = date1.getMilliseconds();
			pathArr = jumpPath(position, to, jumpList, gridWidth, theGrid);
			var date2 = new Date();
			timeB = date2.getMilliseconds();

			timeDif = timeB - timeA;
			strokeWeight(.1);
			text(timeDif+" Ms", width/2, height-20);
			strokeWeight(1);

			fill(0, 255, 0);
			jumpList.traverseDF(function(node) {
				rect((node.data.id % gridWidth) * roomSize, (int)(node.data.id / gridWidth) * roomSize, roomSize, roomSize);
			});
			console.log("jumpped");
		} 


		else {
			var starList = new Tree(HValueArr[position], 0, position, 8, 'true');
			var date1 = new Date();
			timeA = date1.getMilliseconds();
			pathArr = starPath(position, to, starList, gridWidth, theGrid);
			var date2 = new Date();
			timeB = date2.getMilliseconds();

			timeDif = timeB - timeA;
			strokeWeight(.1);
			text(timeDif+" Ms", width/2, height-20);
			strokeWeight(1);

			fill(0, 255, 0);
			starList.traverseDF(function(node) {
				rect((node.data.id % gridWidth) * roomSize, (int)(node.data.id / gridWidth) * roomSize, roomSize, roomSize);
			});
			console.log("starred");
		}
		
		

		fill(255, 0, 0);
		rect((position % gridWidth) * roomSize, (int)(position / gridWidth) * roomSize, roomSize, roomSize);
		fill(255, 0, 255);
		rect((to % gridWidth) * roomSize, (int)(to / gridWidth) * roomSize, roomSize, roomSize);

		stroke(255, 0, 0);
		strokeWeight(5);
		for (var i = 1; i < pathArr.length; i++) {
			line((pathArr[i-1] % gridWidth) * roomSize + roomSize/2, (int)(pathArr[i-1] / gridWidth) * roomSize + roomSize/2, (pathArr[i] % gridWidth) * roomSize + roomSize/2, (int)(pathArr[i] / gridWidth) * roomSize + roomSize/2);
		}
		stroke(0);
		strokeWeight(1);
		makePath = false;
		timeDif = 0;
	}


	count++;
}





