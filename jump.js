
jumpPath = function (start, target, openJ, wid, grid) {
	var spots = [start-wid, start-wid+1, start+1, start+wid+1, start+wid, start+wid-1, start-1, start-wid-1];
	var parentMove = 0;
	var temp  = null;
	var closed = [];
	var dirNext;
	var lowest = 50000000000000;
	var lowestID = -1;
	var nextID = -1;
	var quit = false;

	openJ.contains(function(node) {
		if (node.data.id === start) {
			parentMove = node.data.G;
		} 
	}, openJ.traverseDF);

	var temp = lookAroundJ(start, target, parentMove, openJ, wid, grid, closed);

	if (temp !== null) 
		openJ.add(HValueArr[temp.id], temp.cost, temp.id, temp.dir, 'false', start, openJ.traverseDF);

	openJ.traverseDF(function(node) {
		if (node.data.F < lowest && node.data.check === 'false') {
			lowest = node.data.F;
			lowestID = node.data.id;
			dirNext = node.data.dir;
		}
	});


	openJ.traverseDF(function(node) {
		if (node.data.id === lowestID) {
			if (node.data.H === 0) {
				quit = true;
			}
			else {
				node.data.check = 'true';
			}
		}
	});


	if (quit) return traceParents(openJ, lowestID);


	return jumpPath(lowestID, target, openJ, wid, grid);

}


lookAroundJ = function (start, target, parentMove, openJ, wid, grid, closed) {
	var inOpen = [false, false, false, false, false, false, false, false];
	var cs = [true, true, true, true, true, true, true, true];
	var spots = [start-wid, start-wid+1, start+1, start+wid+1, start+wid, start+wid-1, start-1, start-wid-1];
	var parent;
	var goodToGo = false;


	for (var i = 0; i < 8; i++) {
		if (grid[spots[i]] === false || spots[i] < 0 || spots[i] >= 2500) {
			cs[i] = false;
		}
	}

	openJ.contains(function(node) {
		if (node.data.id === start) {
			parent = node;
		}
	}, openJ.traverseDF);

	openJ.traverseDF(function(node) {
		for (var i = 0; i < 8; i++) {
			if (node.data.id === spots[i]) {
				inOpen[i] = true;
			}
		}
	});

	for (var i = 0; i < closed.length; i++) {
		for (var j = 0; j < 8; j++) {
			if (closed[i] === spots[j]) {
				cs[j] = false;
			}
		}
	}

	for (var i = 0; i < 8; i++) {
		if (cs[i]) {
			if (inOpen[i]) {
				openJ.contains(function(node) {
					if (node.data.id === spots[i]) {
						if (node.data.G > move[i]+parentMove) {
							node.data.G = move[i]+parentMove;
							node.parent = parent;
						}
					}
				}, openJ.traverseDF);
				cs[i] = false;
			}
			else {
				cs[i] = HValueArr[spots[i]]*10+move[i]+parentMove;
			}
		}
	}

	var lowest = 500000000;
	var dirNext = 2;

	for (var i = 0; i < 8; i++) {
		if (cs[i] < lowest && cs[i]) {
			lowest = cs[i];
			dirNext = i;
			goodToGo = true;
		}
	}


	if (!goodToGo) {
		return null;
	}

	var temp = jump(spots[dirNext], target, dirNext, parentMove+move[dirNext], openJ, wid, grid);

	if (temp !== null) {
		return temp;
	} 

	console.log(cs+"   "+start);

	closed.push(spots[dirNext]);
	return lookAroundJ(start, target, parentMove, openJ, wid, grid, closed);

}


jump = function (start, target, dir, parentMove, openJ, wid, grid) {
	
	var spots = [start-wid, start-wid+1, start+1, start+wid+1, start+wid, start+wid-1, start-1, start-wid-1];

	if (grid[start] === false) {
		return null;
	}

	if (start === target) {
		return {"id": start, "dir": dir, "cost": parentMove};
	}

	else if (dir === 1 || dir === 3 || dir === 5 || dir === 7) {
		if (dir === 1) {//up-right
			if (!grid[spots[6]] || !grid[spots[4]]) {
				if (checkIfTrue(start, openJ))
					return {"id": start, "dir": dir, "cost": parentMove};
			}
		} else if (dir === 3) {//down-right
			if (!grid[spots[0]] || !grid[spots[6]]) {
				if (checkIfTrue(start, openJ))
					return {"id": start, "dir": dir, "cost": parentMove};
			}
		} else if (dir === 5) {//down-left
			if (!grid[spots[2]] || !grid[spots[0]]) {
				if (checkIfTrue(start, openJ))
					return {"id": start, "dir": dir, "cost": parentMove};
			}
		} else if (dir === 7) {//up-left
			if (!grid[spots[4]] || !grid[spots[2]]) {
				if (checkIfTrue(start, openJ))
					return {"id": start, "dir": dir, "cost": parentMove};
			}
		}

		if (dir === 1) {//up-right
			if (jump(spots[2], target, 2, parentMove+move[2], openJ, wid, grid) !== null) { 
				return {"id": start, "dir": 2, "cost": parentMove};
			}  if (jump(spots[0], target, 0, parentMove+move[0], openJ, wid, grid) !== null) {
				return {"id": start, "dir": 0, "cost": parentMove};
			}
		}
		else if (dir === 3) {//down-right
			if (jump(spots[2], target, 2, parentMove+move[2], openJ, wid, grid) !== null) { 
				return {"id": start, "dir": 2, "cost": parentMove};
			}  if (jump(spots[4], target, 4, parentMove+move[4], openJ, wid, grid) !== null) {
				return {"id": start, "dir": 4, "cost": parentMove};
			}
		}
		else if (dir === 5) {//down-left
			if (jump(spots[6], target, 6, parentMove+move[6], openJ, wid, grid) !== null) { 
				return {"id": start, "dir": 6, "cost": parentMove};
			}  if (jump(spots[4], target, 4, parentMove+move[4], openJ, wid, grid) !== null) {
				return {"id": start, "dir": 4, "cost": parentMove};
			}
		}
		else if (dir === 7) {//up-left
			if (jump(spots[6], target, 6, parentMove+move[6], openJ, wid, grid) !== null) { 
				return {"id": start, "dir": 6, "cost": parentMove};
			}  if (jump(spots[0], target, 0, parentMove+move[0], openJ, wid, grid) !== null) {
				return {"id": start, "dir": 0, "cost": parentMove};
			}
		}
	} else {
    	if (dir === 0 || dir === 4) {//up and down
    		if (!grid[spots[6]] || !grid[spots[2]]) {
    			if (checkIfTrue(start, openJ))
    				return {"id": start, "dir": dir, "cost": parentMove};
    		}
    	}  else {//right and left
    		if (!grid[spots[0]] || !grid[spots[4]]) {
    			if (checkIfTrue(start, openJ))
    				return {"id": start, "dir": dir, "cost": parentMove};
    		}
    	} 
    }

    return jump(spots[dir], target, dir, parentMove+move[dir], openJ, wid, grid);
}






justInCase = function(openJ, spots, inOpen, grid, cs) {
	openJ.traverseDF(function(node) {
		for (var i = 0; i < 8; i++) {
			if (node.data.id === spots[i]) {
				inOpen[i] = true;
			} 
		}
		if (node.data.id === start) {
			if (node.data.dir === 0 && grid[spots[0]]) {
				if (grid[spots[7]])
					cs[7] = true;
				cs[0] = true;
				if (grid[spots[1]])
					cs[1] = true;
			} else if (node.data.dir === 1 && grid[spots[1]]) {
				if (grid[spots[0]])
					cs[0] = true;
				cs[1] = true;
				if (grid[spots[2]])
					cs[2] = true;
			} else if (node.data.dir === 2 && grid[spots[2]]) {
				if (grid[spots[1]])
					cs[1] = true;
				cs[2] = true;
				if (grid[spots[3]])
					cs[3] = true;
			} else if (node.data.dir === 3 && grid[spots[3]]) {
				if (grid[spots[2]])
					cs[2] = true;
				cs[3] = true;
				if (grid[spots[4]])
					cs[4] = true;
			} else if (node.data.dir === 4 && grid[spots[4]]) {
				if (grid[spots[3]])
					cs[3] = true;
				cs[4] = true;
				if (grid[spots[5]])
					cs[5] = true;
			} else if (node.data.dir === 5 && grid[spots[5]]) {
				if (grid[spots[4]])
					cs[4] = true;
				cs[5] = true;
				if (grid[spots[6]])
					cs[6] = true;
			} else if (node.data.dir === 6 && grid[spots[6]]) {
				if (grid[spots[5]])
					cs[5] = true;
				cs[6] = true;
				if (grid[spots[7]])
					cs[7] = true;
			} else if (node.data.dir === 7 && grid[spots[7]]) {
				if (grid[spots[6]])
					cs[6] = true;
				cs[7] = true;
				if (grid[spots[0]])
					cs[0] = true;
			} else {
				for (var i = 0; i < 8; i++) {
					if (grid[spots[i]]) {
						cs[i] = true;
					}
				}
			}
		}
	});
}