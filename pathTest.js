var drawHere = document.getElementById('drawHere');
var timeA, timeB, timeDif;
var HValueArr = [];
var lastNode = 0;
var count = 0;
var ID = 0;
var makePath = false;
var startingSquare;
var endingSquare;
var theGrid = [];
var pathArr = [];
var pathSpot = 0;
var pathDone = false;
var pathing = false;
var startL;
var useJump = false;
var wWid = 5;
var wHig = 5;
var roomSize = 40;

var drawMazeUtil = false;

var animateMaze = false;
var startMaze = false;
var x;
var y;
var hig;
var wid;
var maze;


var move = [10, 14, 10, 14, 10, 14, 10, 14];

function setup() {
	var myCanvas = createCanvas(wWid*roomSize+10, wHig*roomSize+100);
	myCanvas.parent('drawHere');

	startingSquare = Math.floor(wWid/2);
	endingSquare = Math.floor(wWid * wHig - wWid/2);

	textSize(8);
	textAlign(CENTER);
	rectMode(CORNER);
	ellipseMode(CORNER);

	for (var i = 0; i < wHig; i++) {
		for (var j = 0; j < wWid; j++) {
			theGrid.push(new NodeMaze(j, i, [true, true, true, true, true, true, true, true], -1));
		}
	}

	theGrid = updateGrid(wWid, wHig, theGrid);
	fill(0);
	stroke(0);
	var c = 0;
	for (var i = 0; i < wHig; i++) {
		for (var j = 0; j < wWid; j++) {
			drawNode(theGrid[c], roomSize, drawMazeUtil);
			c++;
		}
	}
	/*
	var pTest = new pQueue(1, 1, 0, false);
	pTest.add(3, 6, 1, false, 0);
	pTest.add(1, 2, 2, false, 0);
	pTest.add(0, 0, 3, false, 0);
	pTest.add(1, 5, 4, false, 0);
	pTest.toString();
	pTest.pluck();
	pTest.toString();
	pTest.pluck();
	pTest.toString();
	pTest.pluck();
	pTest.toString();
	*/
	
}


function mouseDragged() {
	var num = ((int)(mouseY/roomSize)*wWid)+(int)(mouseX/roomSize);
	for (var i = 0; i < theGrid[num].walls.length; i++) {
		theGrid[num].walls = false;
	}
	drawNode(theGrid[num], roomSize, drawMazeUtil);
}

function keyTyped () {
	//console.log("key pressed");
	if (key === 't') {
		//console.log("ttttt");
		endingSquare = ((int)(mouseY/roomSize)*wWid)+(int)(mouseX/roomSize);
		noStroke();
		fill(100, 0, 255, 40);
		rect((endingSquare % wWid) * roomSize, (int)(endingSquare / wWid) * roomSize, roomSize, roomSize);
		//console.log(endingSquare);
	}

	else if (key === 's') {
		//console.log("ssss");
		startingSquare = ((int)(mouseY/roomSize)*wWid)+(int)(mouseX/roomSize);
		noStroke();
		fill(255, 0, 0, 40);
		rect((startingSquare % wWid) * roomSize, (int)(startingSquare / wWid) * roomSize, roomSize, roomSize);
		//console.log(startingSquare);
	}

	else if (key === 'p') {
		//console.log("pppp");
		background(255);
		//theGrid = updateGrid(wWid, wHig, theGrid);
		var c = 0;
		for (var i = 0; i < wHig; i++) {
			for (var j = 0; j < wWid; j++) {
				drawNode(theGrid[c], roomSize, drawMazeUtil);
				c++;
			}
		}
		HValueArr = calcHValue(endingSquare, wWid, wHig, HValueArr);
		fill(0);
		strokeWeight(.1);
		var c = 0;;
		for (var i = 0; i < wWid; i++) {
			for (var j = 0; j < wHig; j++) {
				text(HValueArr[c], i * roomSize + roomSize/2, j * roomSize + roomSize*.75);
				c++;
			}
		}
		strokeWeight(1);

		arrForParents = [];
		makePath = true;
	} 

	else if (key === 'c') {
		var num = ((int)(mouseY/roomSize)*wWid)+(int)(mouseX/roomSize);
		theGrid[num] = true;
		fill(255);
		rect((num % wWid) * roomSize, (int)(num / wWid) * roomSize, roomSize, roomSize);
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
			var wallList = [true, true, true, true, true, true, true, true];
			var mazeTree = makeMaze(0, wHig-1, wWid, wHig, new NodeMaze(0, wHig-1, wallList, -1), -1);
			mazeTree.traverseDF(function (node) {		
				drawNode(node, roomSize, drawMazeUtil);
				theGrid[node.data.y*wWid+node.data.x] = node;
				fillCorners(node);
			});
		} else {
			background(255);
			maze = new TreeMaze(0, 0, false, true, true, false, false, false, false, true);
			x = 0;
			y = 0;
			wid = wWid;
			hig = wWid;
			startMaze = true;
		}

	}
}





function draw() {
	//background(255);
	//text(mouseX+", "+mouseY, mouseX, mouseY-5);

	//console.log(useJump);

	
	if (makePath) {
		




		if (useJump) {
			var jumpList = new Tree(HValueArr[0], 0, 0, 8, false);
			//var closed = [];
			var date1 = new Date();
			timeA = date1.getMilliseconds();
			pathArr = jumpPath(startingSquare, endingSquare, jumpList, wWid, theGrid);
			var date2 = new Date();
			timeB = date2.getMilliseconds();

			timeDif = timeB - timeA;
			strokeWeight(.1);
			text(timeDif+" Ms", width/2, height-20);
			strokeWeight(1);

			fill(0, 255, 0);
			jumpList.traverseDF(function(node) {
				rect((node.data.id % wWid) * roomSize, (int)(node.data.id / wWid) * roomSize, roomSize, roomSize);
			});
			console.log("jumpped");
		} 


		else {
			var starQueue = new pQueue(HValueArr[startingSquare], 0, startingSquare, true);
			var nextNode = starQueue.pluck();
			var listOfNodes = new Array(wWid*wHig);
			listOfNodes[startingSquare] = null;
			var date1 = new Date();
			timeA = date1.getMilliseconds();

			pathArr = starPath(starQueue, nextNode, wWid, theGrid, HValueArr, listOfNodes);

			var date2 = new Date();
			timeB = date2.getMilliseconds();

			timeDif = timeB - timeA;
			strokeWeight(.1);
			text(timeDif+" Ms", width/2, height-20);
			strokeWeight(1);

			/*noStroke();
			fill(0, 255, 0, 40);
			starNode.traverseDF(function(node) {
				rect((node.data.id % wWid) * roomSize, (int)(node.data.id / wWid) * roomSize, roomSize, roomSize);
			});*/
			console.log("starred");
		}
		
		

		fill(255, 0, 0, 40);
		rect((startingSquare % wWid) * roomSize, (int)(startingSquare / wWid) * roomSize, roomSize, roomSize);
		fill(255, 0, 255, 40);
		rect((endingSquare % wWid) * roomSize, (int)(endingSquare / wWid) * roomSize, roomSize, roomSize);

		stroke(255, 0, 0);
		strokeWeight(roomSize/4);
		for (var i = 1; i < pathArr.length; i++) {
			line((pathArr[i-1] % wWid) * roomSize + roomSize/2, (int)(pathArr[i-1] / wWid) * roomSize + roomSize/2, (pathArr[i] % wWid) * roomSize + roomSize/2, (int)(pathArr[i] / wWid) * roomSize + roomSize/2);
		}
		stroke(0);
		strokeWeight(1);
		makePath = false;
		timeDif = 0;
	}


	count++;

/*
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
*/
}





