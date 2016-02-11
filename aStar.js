starPath = function (start, target, openS, wid, grid) {
	var spots = [start-wid, start-wid+1, start+1, start+wid+1, start+wid, start+wid-1, start-1, start-wid-1];
	var parentMove = 0;
	var temp  = null;
	var dirNext;
	var lowest = 50000000000000;
	var lowestID = -1;
	var nextID = -1;
	var quit = false;

	openS.contains(function(node) {
		if (node.data.id === start) {
			parentMove = node.data.G;
		} 
	}, openS.traverseDF);

	lookAroundS(start, parentMove, openS, wid, grid);

	openS.traverseDF(function(node) {
		if (node.data.F < lowest && node.data.check === 'false') {
			lowest = node.data.F;
			lowestID = node.data.id;
			dirNext = node.data.dir;
		}
	});

	openS.traverseDF(function(node) {
		if (node.data.id === lowestID) {
			if (node.data.H === 0) {
				quit = true;
			}
			else {
				node.data.check = 'true';
			}
		}
	});

	if (quit) return traceParents(openS, lowestID);


	return starPath(lowestID, target, openS, wid, grid);

}


lookAroundS = function (start, parentMove, openS, wid, grid) {
	var cs = [true, true, true, true, true, true, true, true];
	var inOpen = [false, false, false, false, false, false, false, false];
	var spots = [start-wid, start-wid+1, start+1, start+wid+1, start+wid, start+wid-1, start-1, start-wid-1];
	var parent;

	for (var i = 0; i < 8; i++) {
		if (grid[spots[i]] === false || spots[i] < 0 || spots[i] >= 2500) {
			cs[i] = false;
		}
	}


	openS.contains(function(node) {
		if (node.data.id === start) {
			parent = node;
		}
	}, openS.traverseDF);

	openS.traverseDF(function(node) {
		for (var i = 0; i < 8; i++) {
			if (node.data.id === spots[i]) {
				inOpen[i] = true;
			}
		}
	});

	for (var i = 0; i < 8; i++) {
		if (cs[i]) {
			if (inOpen[i]) {
				openS.contains(function(node) {
					if (node.data.id === spots[i]) {
						if (node.data.G > move[i]+parentMove) {
							node.data.G = move[i]+parentMove;
							node.parent = parent;
						}
					}
				}, openS.traverseDF);
				cs[i] = false;
			}
			else {
				openS.add(HValueArr[spots[i]], move[i]+parentMove, spots[i], i, 'false', start, openS.traverseDF);
			}
		}
	}
}