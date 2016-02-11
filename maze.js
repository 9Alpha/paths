function makeMaze(x, y, wid, hig, maze) {
	var neighbors = [true, true, true, true];
	var randSpot;
	var spotChosen = false;
	var complete = false;
	var openSpots = false;
	var px, py;


	//console.log(x+", "+y);

	maze.traverseDF(function (node) {
		if (node.data.x === x-2 || node.data.x === x-1 || x-1 < 1) { 
			if (node.data.y === y || node.data.y === y+1 || node.data.y === y-1) {
				neighbors[3] = false;
			}
		} if (node.data.x === x+2 || node.data.x === x+1 || x+1 >= wid-1) { 
			if (node.data.y === y || node.data.y === y+1 || node.data.y === y-1) {
				neighbors[1] = false;
			}
		} if (node.data.y === y+2 || node.data.y === y+1 || y+1 >= hig-1) { 
			if (node.data.x === x || node.data.x === x+1 || node.data.x === x-1) {
				neighbors[2] = false;
			}
		} if (node.data.y === y-2 || node.data.y === y-1 || y-1 < 1) { 
			if (node.data.x === x || node.data.x === x+1 || node.data.x === x-1) {
				neighbors[0] = false;
			}
		}
	});


	for (var i = 0; i < neighbors.length; i++) {
		if (neighbors[i]) {
			openSpots = true;
		}
	}


	if (openSpots) {
		
		while(spotChosen === false) {
			randSpot = randomInt(0, 4);
			if (neighbors[randSpot]) {
				spotChosen = true;
			}
		}

		if (randSpot === 0) {
			maze.add(x, y-1, x, y, maze.traverseDF);
			return makeMaze(x, y-1, wid, hig, maze);
		} else if (randSpot === 1) {
			maze.add(x+1, y, x, y, maze.traverseDF);
			return makeMaze(x+1, y, wid, hig, maze);
		} else if (randSpot === 2) {
			maze.add(x, y+1, x, y, maze.traverseDF);
			return makeMaze(x, y+1, wid, hig, maze);
		} else if (randSpot === 3) {
			maze.add(x-1, y, x, y, maze.traverseDF);
			return makeMaze(x-1, y, wid, hig, maze);
		}

	}

	else {
		maze.contains(maze.traverseDF, function (node) {
			if (node.data.x === x && node.data.y === y) {
				if (node.parent === null) {
					complete = true;
				} else {
					px = node.parent.data.x;
					py = node.parent.data.y;
					return false;
				}
			}
		});

		if (complete) {
			return maze;
		} else {
			return makeMaze(px, py, wid, hig, maze);
		}
	}

}