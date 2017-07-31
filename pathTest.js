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
var worldSize = 800;
var roomSize = 20;
var gridWidth = worldSize/roomSize;


var move = [10, 14, 10, 14, 10, 14, 10, 14];

function setup() {
	var myCanvas = createCanvas(worldSize, worldSize+100);
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
	console.log("wefdcDf");
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
		background(255);
		var mazeTree = new TreeMaze(1, 1);
		mazeTree = makeMaze(1, 1, gridWidth, gridWidth, mazeTree);
		/*for (var i = 0; i < (gridWidth*gridWidth); i++) {
			theGrid[i] = false;
		}*/
		mazeTree.traverseDF(function (node) {
			//var num = node.data.y*gridWidth + node.data.x;
			//theGrid[num] = true;
			stroke(0);
			strokeWeight(1);
			if (!node.data.u) line(node.data.x, node.data.y, node.data.x + roomSize, node.data.y);
			if (!node.data.d) line(node.data.x, node.data.y + roomSize, node.data.x + roomSize, node.data.y + roomSize);
			if (!node.data.l) line(node.data.x, node.data.y, node.data.x, node.data.y + roomSize);
			if (!node.data.r) line(node.data.x + roomSize, node.data.y, node.data.x + roomSize, node.data.y + roomSize);
		});
		/*theGrid = updateGrid(gridWidth, theGrid);
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
		}*/
	}
}



function draw() {
	//background(255);
	//text(mouseX+", "+mouseY, mouseX, mouseY-5);

	//console.log(useJump);
	
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





