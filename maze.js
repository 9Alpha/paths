function makeMaze(x, y, wid, hig, maze) {
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
			return makeMaze(x, y-1, wid, hig, maze);
		} else if (randSpotM === 1) {
			maze.add(x+1, y, neighborsM, x, y);
			return makeMaze(x+1, y, wid, hig, maze);
		} else if (randSpotM === 2) {
			maze.add(x, y+1, neighborsM, x, y);
			return makeMaze(x, y+1, wid, hig, maze);
		} else if (randSpotM === 3) {
			maze.add(x-1, y, neighborsM, x, y);
			return makeMaze(x-1, y, wid, hig, maze);
		}
	}



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
		return maze;
	}
	return makeMaze(pxM, pyM, wid, hig, maze);

}