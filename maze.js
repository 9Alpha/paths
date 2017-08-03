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
			neighborsM[0] = false;
			openSpotsM--;
		} if (neighborsM[2] && node.data.x === x+1 && node.data.y === y) { 
			neighborsM[2] = false;
			openSpotsM--;
		} if (neighborsM[4] && node.data.x === x && node.data.y === y+1) { 
			neighborsM[4] = false;
			openSpotsM--;
		} if (neighborsM[6] && node.data.x === x-1 && node.data.y === y) { 
			neighborsM[6] = false;
			openSpotsM--;
		}
	});

	if (maze.children.length === 0) {
		if (!neighborsM[0] && !neighborsM[2]) neighborsM[1] = false;
		if (!neighborsM[2] && !neighborsM[4]) neighborsM[3] = false;
		if (!neighborsM[4] && !neighborsM[6]) neighborsM[5] = false;
		if (!neighborsM[6] && !neighborsM[0]) neighborsM[7] = false;
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
			child = new NodeMaze(x, y-1, neighborsM, pDir);
			child.parent = maze;
			maze.children.push(child);
			return makeMaze(x, y-1, wid, hig, child, pDir);
		} else if (randSpotM === 1) {
			child = new NodeMaze(x+1, y, neighborsM, pDir);
			child.parent = maze;
			maze.children.push(child);
			return makeMaze(x+1, y, wid, hig, child, pDir);
		} else if (randSpotM === 2) {
			child = new NodeMaze(x, y+1, neighborsM, pDir);
			child.parent = maze;
			maze.children.push(child);
			return makeMaze(x, y+1, wid, hig, child, pDir);
		} else if (randSpotM === 3) {
			child = new NodeMaze(x-1, y, neighborsM, pDir);
			child.parent = maze;
			maze.children.push(child);
			return makeMaze(x-1, y, wid, hig, child, pDir);
		}
	}



	if (maze.parent === null) {
		return maze;
	}

	return makeMaze(maze.parent.data.x, maze.parent.data.y, wid, hig, maze.parent, maze.parent.data.pDir);

}