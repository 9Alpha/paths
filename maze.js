function makeMaze(x, y, wid, hig, maze, pDir) {
	var neighborsM = [true, true, true, true, true, true, true, true];
	var randSpotM;
	var spotChosenM = false;
	var completeM = false;
	var openSpotsM = 4;
	var pxM, pyM;
	var child;

	//console.log(x+", "+y);

	if (y-1 < 0) { 
		neighborsM[0] = false;
		openSpotsM--;
	} if (x+1 > wid-1) { 
		neighborsM[2] = false;
		openSpotsM--;
	} if (y+1 > hig-1) { 
		neighborsM[4] = false;
		openSpotsM--;
	} if (x-1 < 0) { 
		neighborsM[6] = false;
		openSpotsM--;
	}

	maze.traverseDF(function (node) {
		if (neighborsM[0] && node.data.x === x && node.data.y === y-1) { 
			node.walls[4] = false;
			neighborsM[0] = false;
			openSpotsM--;
		} if (neighborsM[2] && node.data.x === x+1 && node.data.y === y) { 
			node.walls[6] = false;
			neighborsM[2] = false;
			openSpotsM--;
		} if (neighborsM[4] && node.data.x === x && node.data.y === y+1) { 
			node.walls[0] = false;
			neighborsM[4] = false;
			openSpotsM--;
		} if (neighborsM[6] && node.data.x === x-1 && node.data.y === y) { 
			node.walls[2] = false;
			neighborsM[6] = false;
			openSpotsM--;
		}
	});


	

	if (maze.children.length === 0) {
		maze.setData(neighborsM, pDir);
	}
	


	if (openSpotsM > 0) {

		
		while(spotChosenM === false) {
			randSpotM = randomInt(0, 3);
			if (neighborsM[randSpotM*2]) {
				spotChosenM = true;
			}
		}

		

		pDir = 2*((randSpotM+2)%4);


		if (randSpotM === 0) {
			maze.nDir[0] = true;
			return makeMaze(x, y-1, wid, hig, maze.add(x, y-1, neighborsM, pDir), pDir);
		} else if (randSpotM === 1) {
			maze.nDir[2] = true;
			return makeMaze(x+1, y, wid, hig, maze.add(x+1, y, neighborsM, pDir), pDir);
		} else if (randSpotM === 2) {
			maze.nDir[4] = true;
			return makeMaze(x, y+1, wid, hig, maze.add(x, y+1, neighborsM, pDir), pDir);
		} else if (randSpotM === 3) {
			maze.nDir[6] = true;
			return makeMaze(x-1, y, wid, hig, maze.add(x-1, y, neighborsM, pDir), pDir);
		}
	}



	if (maze.parent === null) {
		return maze;
	}

	return makeMaze(maze.parent.data.x, maze.parent.data.y, wid, hig, maze.parent, maze.parent.data.pDir);

}