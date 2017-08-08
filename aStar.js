starPath = function (currentNode, wid, grid, hVal) {
	var lowest = 50000000000000;
	var nextNode = null;

	//console.log(currentNode);

	lookAroundS(currentNode.data.G, currentNode, wid, grid, hVal);

	currentNode.traverseDF(function(node) {
		if (node.data.F < lowest && !node.data.check) {
			lowest = node.data.F;
			nextNode = node;
		}
	});

	nextNode.data.check = true;

	if (nextNode.data.H === 0) {
		return traceParents(nextNode);
	}

	return starPath(nextNode, wid, grid, hVal);

}


lookAroundS = function (parentMove, parent, wid, grid, hVal) {
	var currentID = parent.data.id;
	var cs = [true, true, true, true, true, true, true, true];
	var spots = [currentID-wid, currentID-wid+1, currentID+1, currentID+wid+1, currentID+wid, currentID+wid-1, currentID-1, currentID-wid-1];

	for (var i = 0; i < cs.length; i+=2) {
		if (!grid[currentID].walls[i] && grid[currentID].pDir !== i && !grid[currentID].nDir[i]) {
			cs[i] = false;
		}
	}

	//console.log(currentID);
	//console.log(grid[currentID].walls);
	//console.log(cs);


	parent.traverseDF(function(node) {
		for (var i = 0; i < cs.length; i+=2) {
			if (node.data.id === spots[i]) {
				if (node.data.G > move[i]+parentMove) {
					node.data.G = move[i]+parentMove;
					node.parent = parent;
				}
				cs[i] = false;
			}
		}
	});

	for (var i = 0; i < cs.length; i+=2) {
		if (cs[i]) {
			parent.add(hVal[spots[i]], move[i]+parentMove, spots[i], false, currentID);
		}
	}
	
}