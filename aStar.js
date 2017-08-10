starPath = function (queue, currentNode, wid, grid, hVal) {
	var nextNode = null;


	lookAroundS(queue, currentNode, wid, grid, hVal);

	nextNode = queue.pluck();
	nextNode.data.check = true;

	if (nextNode.data.hVal === 0) {
		return traceParents(nextNode);
	}

	console.log(queue.list);

	return starPath(queue, nextNode, wid, grid, hVal);

}


lookAroundS = function (queue, parent, wid, grid, hVal) {
	var currentID = parent.data.id;
	var cs = [true, true, true, true, true, true, true, true];
	var spots = [currentID-wid, currentID-wid+1, currentID+1, currentID+wid+1, currentID+wid, currentID+wid-1, currentID-1, currentID-wid-1];

	//console.log(currentID);
	//console.log(grid[currentID].walls);
	//console.log(cs);

	for (var i = 0; i < queue.size; i++) {
		for (var j = 0; j < cs.length; j+=2) {
			if (queue.list[i].data.id === spots[j]) {
				if (queue.list[i].data.pLength > move[j]+parent.data.pLength) {
					queue.list[i].data.pLength = move[j]+parent.data.pLength;
					queue.list[i].parent = parent;
				}
				cs[j] = false;
			}
			
		}
	}

	for (var j = 0; j < cs.length; j++) {
		if (!grid[currentID].walls[j] && grid[currentID].pDir !== j && !grid[currentID].nDir[j]) {
			cs[j] = false;
		}
	}

	console.log(cs);

	for (var i = 0; i < cs.length; i+=2) {
		if (cs[i]) {
			queue.add(hVal[spots[i]], move[i]+parent.data.pLength, spots[i], false, parent);
		}
	}
	
}