starPath = function (currentNode, wid, grid, hVal) {
	var lowest = 50000000000000;
	var nextNode = null;

	console.log(currentNode.data.id+" "+currentNode.data.hVal);

	lookAroundS(currentNode, wid, grid, hVal);

	currentNode.traverseDF(function(node) {
		if (node.data.pWeight < lowest && !node.data.check) {
			lowest = node.data.pWeight;
			nextNode = node;
		}
	});

	nextNode.data.check = true;

	if (nextNode.data.hVal === 0) {
		return traceParents(nextNode);
	}

	return starPath(nextNode, wid, grid, hVal);

}


lookAroundS = function (parent, wid, grid, hVal) {
	var cs = [true, true, true, true, true, true, true, true];
	var spots = [parent.data.id-wid, parent.data.id-wid+1, parent.data.id+1, parent.data.id+wid+1, parent.data.id+wid, parent.data.id+wid-1, parent.data.id-1, parent.data.id-wid-1];

	for (var i = 0; i < cs.length; i+=2) {
		if (!grid[parent.data.id].walls[i] && grid[parent.data.id].pDir !== i && !grid[parent.data.id].nDir[i]) {
			cs[i] = false;
		}
	}

	//console.log(parent.data.id);
	//console.log(grid[parent.data.id].walls);
	//console.log(cs);


	parent.traverseDF(function(node) {
		for (var i = 0; i < cs.length; i+=2) {
			if (node.data.id === spots[i]) {
				if (node.data.pLength > move[i]+parent.data.pLength) {
					node.data.pLength = move[i]+parent.data.pLength;
					node.parent = parent;
				}
				cs[i] = false;
			}
		}
	});

	for (var i = 0; i < cs.length; i+=2) {
		if (cs[i]) {
			parent.add(hVal[spots[i]], move[i]+parent.data.pLength, spots[i], false, parent.data.id);
		}
	}
	
}