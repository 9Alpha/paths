

randomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

calcHValue = function(toSpot) {
	var temp = 0;
	for (var i = 0; i < theGrid.length; i++) {
		temp+=Math.abs(((toSpot%gridWidth)-(i%gridWidth)));
		temp+=Math.abs(parseInt(toSpot/gridWidth)-parseInt(i/gridWidth));

		HValueArr.push(temp);
		temp = 0;
	}
}

updateGrid = function (wid, grid) {
	for (var i = 0; i < (wid*wid); i++) {
		if (i % wid === 0 || i % wid === wid-1 || i < wid || i > (wid*wid)-1-wid) {
			grid[i] = false;
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
