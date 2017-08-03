

randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

calcHValue = function(toSpot, wid, hig, hval) {
	var temp = 0;
	for (var i = 0; i < wid; i++) {
		for (var j = 0; j < hig; j++) {
			temp+=Math.abs((toSpot%wid)-i);
			temp+=Math.abs(Math.floor(toSpot/wWid)-j);
			hval.push(temp);
			temp = 0;
		}
	}
	return hval;
}

updateGrid = function (wid, hig, grid) {
	var c = 0;
	for (var i = 0; i < wid; i++) {
		for (var j = 0; j < hig; j++) {
			grid[c].setData([true, true, true, true, true, true, true, true], -1);
			if (i === 0) {
				grid[c].walls[6] = false;
				if (j === 0) grid[c].walls[7] = false;
				if (j === hig-1) grid[c].walls[5] = false;
			}
			else if (i === wid-1) {
				grid[c].walls[2] = false;
				if (j === 0) grid[c].walls[1] = false;
				if (j === hig-1) grid[c].walls[3] = false;
			}
			if (j === 0) grid[c].walls[0] = false;
			else if (j === hig-1) grid[c].walls[4] = false;
			c++;
		}
	}
	return grid;
}

traceParents = function (list, start) {
	var next = true;
	var toLook = start;
	var end = 0;
	var arrForParents = [];
	arrForParents.push(start);
	while (next) {
		//console.log("looking for parents");
		list.traverseDF(function(node){
			if (node.data.id === toLook) {
				if (node.parent !== null) {
					arrForParents.push(node.parent.data.id);
					toLook = node.parent.data.id;
					//console.log(toLook);
					end++;
				} 
				else {
					next = false;
				}

				
			}
		});
		if (end > 10000000) {
			next = false;
		}
	}
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
