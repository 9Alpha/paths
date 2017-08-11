drawNode = function(node, rSize, seePath) {
	strokeWeight(1);
	stroke(0);
	if (!node.walls[0] && node.data.pDir !== 0 && !node.nDir[0]) {
		line(node.data.x * rSize, node.data.y * rSize, node.data.x * rSize + rSize, node.data.y * rSize);
	}
	if (!node.walls[2] && node.data.pDir !== 2 && !node.nDir[2]) {
		line(node.data.x * rSize + rSize, node.data.y * rSize, node.data.x * rSize + rSize, node.data.y * rSize + rSize);
	}
	if (!node.walls[4] && node.data.pDir !== 4 && !node.nDir[4]) {
		line(node.data.x * rSize, node.data.y * rSize + rSize, node.data.x * rSize + rSize, node.data.y * rSize + rSize);
	}
	if (!node.walls[6] && node.data.pDir !== 6 && !node.nDir[6]) {
		line(node.data.x * rSize, node.data.y * rSize, node.data.x * rSize, node.data.y * rSize + rSize);
	}

	if (seePath) {
		fill(255, 0, 0);
		if (node.data.pDir === 0) rect(node.data.x * rSize + rSize/2, node.data.y * rSize, rSize/10, rSize/10);
		if (node.data.pDir === 2) rect(node.data.x * rSize + rSize*.9, node.data.y * rSize + rSize/2, rSize/10, rSize/10);
		if (node.data.pDir === 4) rect(node.data.x * rSize + rSize/2, node.data.y * rSize + rSize*.9, rSize/10, rSize/10);
		if (node.data.pDir === 6) rect(node.data.x * rSize, node.data.y * rSize + rSize/2, rSize/10, rSize/10);

		fill(0, 255, 0);
		if (node.nDir[0]) rect(node.data.x * rSize + rSize/2, node.data.y * rSize, rSize/10, rSize/10);
		if (node.nDir[2]) rect(node.data.x * rSize + rSize*.9, node.data.y * rSize + rSize/2, rSize/10, rSize/10);
		if (node.nDir[4]) rect(node.data.x * rSize + rSize/2, node.data.y * rSize + rSize*.9, rSize/10, rSize/10);
		if (node.nDir[6]) rect(node.data.x * rSize, node.data.y * rSize + rSize/2, rSize/10, rSize/10);

		fill(0);
	}

}

fillCorners = function(node) {
	for (var i = 0; i < 4; i++) {
		if (!node.walls[i*2] && !node.walls[(i*2+2)%8]) node.walls[i*2+1] = false;
	}
}

randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

calcHValue = function(toSpot, wid, hig) {
	var hValArray = [];
	var temp = 0;
	for (var i = 0; i < hig; i++) {
		for (var j = 0; j < wid; j++) {
			temp+=Math.abs((toSpot%wid)-j);
			temp+=Math.abs(Math.floor(toSpot/wWid)-i);
			hValArray.push(temp);
			temp = 0;
		}
	}
	return hValArray;
}

updateGrid = function (wid, hig, grid) {
	strokeWeight(1);
	stroke(0);
	var c = 0;
	for (var i = 0; i < hig; i++) {
		for (var j = 0; j < wid; j++) {
			grid[c].setData([true, true, true, true, true, true, true, true], -1);
			if (j === 0) {
				grid[c].walls[6] = false;
				if (i === 0) grid[c].walls[7] = false;
				if (i === hig-1) grid[c].walls[5] = false;
			}
			else if (j === wid-1) {
				grid[c].walls[2] = false;
				if (i === 0) grid[c].walls[1] = false;
				if (i === hig-1) grid[c].walls[3] = false;
			}
			if (i === 0) grid[c].walls[0] = false;
			else if (i === hig-1) grid[c].walls[4] = false;
			c++;
		}
	}
	return grid;
}

traceParents = function (node) {
	var arrForParents = [];
	while (node.parent) {
		arrForParents.push(node.data.id);
		node = node.parent;
	}
	arrForParents.push(node.data.id);
	return arrForParents.reverse();
}

checkIfTrue = function(spot, list) {
	var good = true;
	list.traverseDF(function(node) {
		if (node.data.id === spot) {
			if (node.data.check === 'true') {
				good = false;
			}
		}
	});

	if (good) return true;
	return false;
}
