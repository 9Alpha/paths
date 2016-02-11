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
var gridWidth = worldSize/20;

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
			rect((i % gridWidth) * 20, (int)(i / gridWidth) * 20, 20, 20);
		}
	}
	
	textSize(8);
	textAlign(CENTER);
	console.log("wefdcDf");
	rectMode(CORNER);
	ellipseMode(CORNER);
}


function mouseDragged() {
	var num = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
	theGrid[num] = false;
	fill(0);
	rect((num % gridWidth) * 20, (int)(num / gridWidth) * 20, 20, 20);
}

function keyTyped () {
	//console.log("key pressed");
	if (key === 't') {
		//console.log("ttttt");
		to = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		fill(255, 0, 255);
		rect((to % gridWidth) * 20, (int)(to / gridWidth) * 20, 20, 20);
		//console.log(to);
	}

	else if (key === 's') {
		//console.log("ssss");
		position = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		fill(255, 0, 0);
		rect((position % gridWidth) * 20, (int)(position / gridWidth) * 20, 20, 20);
		//console.log(position);
	}

	else if (key === 'p') {
		//console.log("pppp");
		background(255);
		theGrid = updateGrid(gridWidth, theGrid);
		for (var i = 0; i < (gridWidth*gridWidth); i++) {
			if (theGrid[i] === false) {
				fill(0);
				rect((i % gridWidth) * 20, (int)(i / gridWidth) * 20, 20, 20);
			}
		}
		makePath = true;
	} 

	else if (key === 'c') {
		var num = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		theGrid[num] = true;
		fill(255);
		rect((num % gridWidth) * 20, (int)(num / gridWidth) * 20, 20, 20);
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
		for (var i = 0; i < (gridWidth*gridWidth); i++) {
			theGrid[i] = false;
		}
		mazeTree.traverseDF(function (node) {
			var num = node.data.y*gridWidth + node.data.x;
			theGrid[num] = true;
		});
		theGrid = updateGrid(gridWidth, theGrid);
		for (var i = 0; i < (gridWidth*gridWidth); i++) {
			if (theGrid[i] === false) {
				fill(0);
				rect((i % gridWidth) * 20, (int)(i / gridWidth) * 20, 20, 20);
			}
		}
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
			text(HValueArr[i], (i % gridWidth) * 20 + 10, (int)(i / gridWidth) * 20 + 15);
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
				rect((node.data.id % gridWidth) * 20, (int)(node.data.id / gridWidth) * 20, 20, 20);
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
				rect((node.data.id % gridWidth) * 20, (int)(node.data.id / gridWidth) * 20, 20, 20);
			});
			console.log("starred");
		}
		
		

		fill(255, 0, 0);
		rect((position % gridWidth) * 20, (int)(position / gridWidth) * 20, 20, 20);
		fill(255, 0, 255);
		rect((to % gridWidth) * 20, (int)(to / gridWidth) * 20, 20, 20);

		stroke(255, 0, 0);
		strokeWeight(5);
		for (var i = 1; i < pathArr.length; i++) {
			line((pathArr[i-1] % gridWidth) * 20 + 10, (int)(pathArr[i-1] / gridWidth) * 20 + 10, (pathArr[i] % gridWidth) * 20 + 10, (int)(pathArr[i] / gridWidth) * 20 + 10);
		}
		stroke(0);
		strokeWeight(1);
		makePath = false;
		timeDif = 0;
	}


count++;
}





