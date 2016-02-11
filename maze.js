function makeMaze(x, y, wid, hig, maze) {
	var neighborsM = [true, true, true, true];
	var randSpotM;
	var spotChosenM = false;
	var completeM = false;
	var openSpotsM = false;
	var pxM, pyM;


	//console.log(x+", "+y);

	maze.traverseDF(function (node) {
		if (node.data.x === x-2 || node.data.x === x-1 || x-1 < 1) { 
			if (node.data.y === y || node.data.y === y+1 || node.data.y === y-1) {
				neighborsM[3] = false;
			}
		} if (node.data.x === x+2 || node.data.x === x+1 || x+1 >= wid-1) { 
			if (node.data.y === y || node.data.y === y+1 || node.data.y === y-1) {
				neighborsM[1] = false;
			}
		} if (node.data.y === y+2 || node.data.y === y+1 || y+1 >= hig-1) { 
			if (node.data.x === x || node.data.x === x+1 || node.data.x === x-1) {
				neighborsM[2] = false;
			}
		} if (node.data.y === y-2 || node.data.y === y-1 || y-1 < 1) { 
			if (node.data.x === x || node.data.x === x+1 || node.data.x === x-1) {
				neighborsM[0] = false;
			}
		}
	});


	for (var i = 0; i < neighborsM.length; i++) {
		if (neighborsM[i]) {
			openSpotsM = true;
		}
	}


	if (openSpotsM) {
		
		while(spotChosenM === false) {
			randSpotM = randomInt(0, 4);
			if (neighborsM[randSpotM]) {
				spotChosenM = true;
			}
		}

		if (randSpotM === 0) {
			maze.add(x, y-1, x, y, maze.traverseDF);
			return makeMaze(x, y-1, wid, hig, maze);
		} else if (randSpotM === 1) {
			maze.add(x+1, y, x, y, maze.traverseDF);
			return makeMaze(x+1, y, wid, hig, maze);
		} else if (randSpotM === 2) {
			maze.add(x, y+1, x, y, maze.traverseDF);
			return makeMaze(x, y+1, wid, hig, maze);
		} else if (randSpotM === 3) {
			maze.add(x-1, y, x, y, maze.traverseDF);
			return makeMaze(x-1, y, wid, hig, maze);
		}

	}

	else {
		maze.contains(maze.traverseDF, function (node) {
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
			return maze;
		} else {
			return makeMaze(pxM, pyM, wid, hig, maze);
		}
	}

}