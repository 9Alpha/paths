

var falsed = [];

var timeA = 0;
var timeB = 0;
var timeDif = 0;

var HValueArr = [];

var lastNode = 0;

var arrForParents = [];

var count = 0;

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcHValue(toSpot, ID) {
	var temp = 0;
	for (var i = 0; i < theGrid.length; i++) {
		temp+=Math.abs(((toSpot%gridWidth)-(i%gridWidth)));
		temp+=Math.abs(parseInt(toSpot/gridWidth)-parseInt(i/gridWidth));

		HValueArr.push(temp);
		temp = 0;
	}
}



function findIndex(arr, data) {
	var index;

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].data.id === data) {
			index = i;
		}
	}

	return index;
}

function Node(A, B, id, dir, check, type) {
	var C = (int)(B+10*A);
	this.data = {"id": id, "H": A, "G": B, "F": C, "dir": dir, "check": check, "type": type};
	this.parent = null;
	this.children = [];
}

function AStarTree(A, B, id, dir, check, type) {
	var node = new Node(A, B, id, dir, check, type);
	this._root = node;
}

AStarTree.prototype.traverseDF = function(callback) {

    // this is a recurse and immediately-invoking function 
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }

        // step 4
        callback(currentNode);

        // step 1
    })(this._root);

};

AStarTree.prototype.traverseBF = function(callback) {
	var queue = [];

	queue.enqueue(this._root);

	currentTree = queue.dequeue();

	while(currentTree){
		for (var i = 0, length = currentTree.children.length; i < length; i++) {
			queue.enqueue(currentTree.children[i]);
		}

		callback(currentTree);
		currentTree = queue.dequeue();
	}
};

AStarTree.prototype.contains = function(callback, traversal) {
	traversal.call(this, callback);
};

AStarTree.prototype.add = function(A, B, id, dir, check, type, toData, traversal) {
	var child = new Node(A, B, id, dir, check, type),
	parent = null,
	callback = function(node) {
		if (node.data.id === toData) {
			parent = node;
		}
	};

	this.contains(callback, traversal);

	if (parent) {
		parent.children.push(child);
		child.parent = parent;
	} else {
		console.log('Cannot add node to a non-existent parent.  Parent--> '+toData);
	}
};

AStarTree.prototype.remove = function(id, fromData, traversal) {
	var tree = this,
	parent = null,
	childToRemove = null,
	index;

	var callback = function(node) {
		if (node.data.id === fromData) {
			parent = node;
		}
	};

	this.contains(callback, traversal);

	if (parent) {
		index = findIndex(parent.children, id);

		if (index === undefined) {
			console.log('Node to remove does not exist.');
		} else {
			childToRemove = parent.children.splice(index, 1);
		}
	} else {
		console.log('Parent does not exist.');
	}

	return childToRemove;
};


var count = 0;
var ID = 0;
var makePath = false;
var position;
var theGrid = [];
var truths = [];
var pathArr = [];
var pathSpot = 0;
var pathDone = false;
var pathing = false;
var to;
var from;
var startL;
var openList;
var useJump = false;
var worldSize = 3000;
var gridWidth = worldSize/20;

function setup() {
	var myCanvas = createCanvas(worldSize, worldSize);

	for (var i = 0; i < (gridWidth*gridWidth); i++) {
		theGrid.push(true);
		truths.push(false);
	}

	updateGrid(ID);
	for (var i = 0; i < (gridWidth*gridWidth); i++) {
		if (i % gridWidth === 0 || i % gridWidth === gridWidth-1 || i < gridWidth || i > (gridWidth*gridWidth)-1) {
			theGrid[i] = false;
		} if (theGrid[i] === false) {
			fill(0);
			rect((i % gridWidth) * 20, (int)(i / gridWidth) * 20, 20, 20);
		}
	}
	
	textSize(8);
	textAlign(CENTER);
	console.log("wefdcDf");
	rectMode(CORNER);
	ellipseMode(CORNER);
}


function mouseDragged() {
	var num = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
	theGrid[num] = false;
	fill(0);
	rect((num % gridWidth) * 20, (int)(num / gridWidth) * 20, 20, 20);
}

function keyTyped () {
	console.log("key pressed");
	if (key === 't') {
		console.log("ttttt");
		to = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		fill(255, 0, 255);
		rect((to % gridWidth) * 20, (int)(to / gridWidth) * 20, 20, 20);
		console.log(to);
	}

	else if (key === 's') {
		console.log("ssss");
		position = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		fill(255, 0, 0);
		rect((position % gridWidth) * 20, (int)(position / gridWidth) * 20, 20, 20);
		console.log(position);
	}

	else if (key === 'p') {
		console.log("pppp");
		background(255);
		for (var i = 0; i < 2500; i++) {
			if (i % gridWidth === 0 || i % gridWidth === gridWidth-1 || i < gridWidth || i > (gridWidth*gridWidth)-1) {
				theGrid[i] = false;
			} if (theGrid[i] === false) {
				fill(0);
				rect((i % gridWidth) * 20, (int)(i / gridWidth) * 20, 20, 20);
			}
		}
		makePath = true;
	} else if (key === 'c') {
		var num = ((int)(mouseY/20)*gridWidth)+(int)(mouseX/20);
		theGrid[num] = true;
		fill(255);
		rect((num % gridWidth) * 20, (int)(num / gridWidth) * 20, 20, 20);
	} else if (key === 'j') {
		if (useJump) {
			useJump = false;
		} else {
			useJump = true;
		}
	}
}



function draw() {
	//background(255);
	//text(mouseX+", "+mouseY, mouseX, mouseY-5);

	//console.log(useJump);
	
	if (makePath) {
		from = position;
		startL = from;
		/*to = 0;
		var goodTarget = false;
		while(goodTarget === false) {
			to = randomInt(0, 2500);
			if (theGrid[to]) {
				goodTarget = true;
			}
		}*/
		HValueArr = [];
		calcHValue(to, 0);
		for (var i = 0; i < HValueArr.length; i++) {
			text(HValueArr[i], (i % gridWidth) * 20 + 10, (int)(i / gridWidth) * 20 + 15);
		}
		fill(255, 0, 0);
		rect((position % gridWidth) * 20 + 5, (int)(position / gridWidth) * 20 + 5, 10, 10);
		fill(255, 0, 255);
		rect((to % gridWidth) * 20, (int)(to / gridWidth) * 20, 20, 20);
		openList = new AStarTree(HValueArr[from], 0, from, 8, 'true', 0);
		makePath = false;
		pathing = true;
	}


	if (pathing && count % 1 === 0) {
		//console.log(startL+"   "+to);
		var move = [10, 14, 10, 14, 10, 14, 10, 14];
		var spots = [startL-gridWidth, startL-gridWidth+1, startL+1, startL+gridWidth+1, startL+gridWidth, startL+gridWidth-1, startL-1, startL-gridWidth-1];
		var parentMove = 0;
		var temp  = null;
		var dirNext;
		var lowest = 50000000000000;
		var lowestID = -1;
		var nextID = -1;
		var quit = false;
		//var parent;



		openList.contains(function(node) {
			if (node.data.id === startL) {
				parentMove = node.data.G;
				//parent = node;
			}
		}, openList.traverseDF);

		var cs = lookAround(startL, parentMove, openList, closed, ID);

		for (var i = 0; i < cs.length; i++) {
			if (cs[i]) {
				fill(0, 0, 255);
				rect((spots[i] % gridWidth) * 20 + 5, (int)(spots[i] / gridWidth) * 20 + 5, 10, 10);
			}
		}

		
		openList.traverseDF(function(node) {
			if (node.data.F < lowest && node.data.check === 'false') {
				//console.log("id: "+node.data.id+" check: "+node.data.check+"  F: "+node.data.F);
				//console.log(lowest+"  lowest");
				lowest = node.data.F;
				lowestID = node.data.id;
				dirNext = node.data.dir;
			}
		});



		openList.traverseDF(function(node) {
			if (node.data.id === lowestID) {
				if (node.data.H === 0) {
					console.log("finished path");
					quit = true;
					pathDone = true;
					return false;
				}
				else {
					node.data.check = 'true';
					node.data.type = 0;
					fill(0, 255, 0);
					rect((lowestID % gridWidth) * 20, (int)(lowestID / gridWidth) * 20, 20, 20);
				}
			}
		});

		if (quit === false && useJump) {

			temp = jump(lowestID, to, dirNext, parentMove+move[dirNext], openList, ID);
			console.log(temp);


			if (temp !== null) {
				openList.add(HValueArr[temp.id], temp.cost, temp.id, temp.dir, 'true', 1, lowestID, openList.traverseDF);
				if (temp.id === to) {
					console.log("path finished");
					lowestID = temp.id;
					pathDone = true;
				}
				else {
					lowestID = temp.id;
					fill(255, 255, 0);
					rect((temp.id % gridWidth) * 20, (int)(temp.id / gridWidth) * 20, 20, 20);
				}
			}
		}

		/*lowest = 5000000000000;
		openList.traverseDF(function(node) {
		//console.log("id: "+node.data.id+" check: "+node.data.check);
		if (node.data.F < lowest && node.data.check === 'true' && node.data.id !== start) {
			lowest = node.data.F;
			nextID = node.data.id;
		}
	});
*/

if (pathDone === false) {

	startL = lowestID;
	fill(0);
	openList.contains(function(node) {
		if (node.data.id === startL) {
			//text(node.data.F, (startL % (width/20)) * 20 + 10, (int)(startL / (width/20)) * 20 + 15);
			if (node.data.type === 0) {
				fill(0, 255, 0);
			} else {
				fill(0, 0, 255);
			}
		}
	}, openList.traverseDF);

	rect((startL % gridWidth) * 20, (int)(startL / gridWidth) * 20, 20, 20);

	

}



}

if (pathDone) {
	pathing = false;
	pathDone = false;
	arrForParents = [];
	pathArr = traceParents(openList, to).reverse();

	fill(0);
	for (var i = 0; i < pathArr.length; i++) {
		ellipse((pathArr[i] % gridWidth) * 20 + 5, (int)(pathArr[i] / gridWidth) * 20 + 5, 10, 10);
	}
}


/*
	if (count%10 === 0) {
		if (pathSpot < pathArr.length) {
			theGrid[position] = true;
			position = pathArr[pathSpot];
			pathSpot++;
		} else {
			makePath = true;
			pathSpot = 0;
		}
	}
	*/

	updateGrid(ID);
	//console.log("-------------------------------------");
	count++;
}


traceParents = function (list, start) {
	var next = true;
	var toLook = start;
	var end = 0;
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
		if (end > 10000) {
			next = false;
		}
	}
	return arrForParents;
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

jump = function (start, target, dir, parentMove, open, ID) {
	
	var move = [10, 14, 10, 14, 10, 14, 10, 14];
	var spots = [start-gridWidth, start-gridWidth+1, start+1, start+gridWidth+1, start+gridWidth, start+gridWidth-1, start-1, start-gridWidth-1];

	//console.log(ID+"   in jump");
	if (theGrid[start] === false) {
		//fill(255, 0, 0);
		//rect((start % (width/20)) * 20, (int)(start / (width/20)) * 20, 20, 20);
		return null;
	}

	if (spots[dir] === target) {
		return {"id": spots[dir], "dir": dir, "cost": parentMove};
	}

	else if (dir === 1 || dir === 3 || dir === 5 || dir === 7) {
		if (dir === 1) {//up-right
			if (!theGrid[spots[6]]) {
				if (theGrid[spots[0]]) {
					if (checkIfTrue(spots[0], open))
						return {"id": spots[0], "dir": dir, "cost": parentMove};
				}
			}
			if (!theGrid[spots[4]]) {
				if (theGrid[spots[2]]) {
					if (checkIfTrue(spots[2], open))
						return {"id": spots[2], "dir": dir, "cost": parentMove};
				}
			}
		} else if (dir === 3) {//down-right
			if (!theGrid[spots[0]]) {
				if (theGrid[spots[2]]) {
					if (checkIfTrue(spots[2], open))
						return {"id": spots[2], "dir": dir, "cost": parentMove};
				}
			}
			if (!theGrid[spots[6]]) {
				if (theGrid[spots[4]]) {
					if (checkIfTrue(spots[4], open))
						return {"id": spots[4], "dir": dir, "cost": parentMove};
				}
			}
		} else if (dir === 5) {//down-left
			if (!theGrid[spots[2]]) {
				if (theGrid[spots[4]]) {
					if (checkIfTrue(spots[4], open))
						return {"id": spots[4], "dir": dir, "cost": parentMove};
				}
			}
			if (!theGrid[spots[0]]) {
				if (theGrid[spots[6]]) {
					if (checkIfTrue(spots[6], open))
						return {"id": spots[6], "dir": dir, "cost": parentMove};
				}
			}
		} else if (dir === 7) {//up-left
			if (!theGrid[spots[4]]) {
				if (theGrid[spots[6]]) {
					if (checkIfTrue(spots[6], open))
						return {"id": spots[6], "dir": dir, "cost": parentMove};
				}
			}
			if (!theGrid[spots[2]]) {
				if (theGrid[spots[0]]) {
					if (checkIfTrue(spots[0], open))
						return {"id": spots[0], "dir": dir, "cost": parentMove};
				}
			}
		}

		if (dir === 1) {
			if (jump(spots[2], target, 2, parentMove+move[2], open, ID) !== null) { 
				return {"id": start, "dir": 2, "cost": parentMove};
			}  if (jump(spots[0], target, 0, parentMove+move[0], open, ID) !== null) {
				return {"id": start, "dir": 0, "cost": parentMove};
			}
		}
		else if (dir === 3) {
			if (jump(spots[2], target, 2, parentMove+move[2], open, ID) !== null) { 
				return {"id": start, "dir": 2, "cost": parentMove};
			}  if (jump(spots[4], target, 4, parentMove+move[4], open, ID) !== null) {
				return {"id": start, "dir": 4, "cost": parentMove};
			}
		}
		else if (dir === 5) {
			if (jump(spots[6], target, 6, parentMove+move[6], open, ID) !== null) { 
				return {"id": start, "dir": 6, "cost": parentMove};
			}  if (jump(spots[4], target, 4, parentMove+move[4], open, ID) !== null) {
				return {"id": start, "dir": 4, "cost": parentMove};
			}
		}
		else if (dir === 7) {
			if (jump(spots[6], target, 6, parentMove+move[6], open, ID) !== null) { 
				return {"id": start, "dir": 6, "cost": parentMove};
			}  if (jump(spots[0], target, 0, parentMove+move[0], open, ID) !== null) {
				return {"id": start, "dir": 0, "cost": parentMove};
			}
		}
	} else {
    	if (dir === 0) {//up
    		if (!theGrid[spots[6]]) {
    			if (theGrid[spots[7]]) {
    				if (checkIfTrue(spots[7], open))
    					return {"id": spots[7], "dir": dir, "cost": parentMove};
    			}
    		}
    		if (!theGrid[spots[2]]) {
    			if (theGrid[spots[1]]) {
    				if (checkIfTrue(spots[1], open))
    					return {"id": spots[1], "dir": dir, "cost": parentMove};
    			}
    		}
    	} else if (dir === 4) {//down
    		if (!theGrid[spots[6]]) {
    			if (theGrid[spots[5]]) {
    				if (checkIfTrue(spots[5], open))
    					return {"id": spots[5], "dir": dir, "cost": parentMove};
    			}
    		}
    		if (!theGrid[spots[2]]) {
    			if (theGrid[spots[3]]) {
    				if (checkIfTrue(spots[3], open))
    					return {"id": spots[3], "dir": dir, "cost": parentMove};
    			}
    		}
    	} else if (dir === 2) {//right
    		if (!theGrid[spots[0]]) {
    			if (theGrid[spots[1]]) {
    				if (checkIfTrue(spots[1], open))
    					return {"id": spots[1], "dir": dir, "cost": parentMove};
    			}
    		}
    		if (!theGrid[spots[4]]) {
    			if (theGrid[spots[3]]) {
    				if (checkIfTrue(spots[3], open))
    					return {"id": spots[3], "dir": dir, "cost": parentMove};
    			}
    		}
    	} else if (dir === 6) {//left
    		if (!theGrid[spots[0]]) {
    			if (theGrid[spots[7]]) {
    				if (checkIfTrue(spots[7], open))
    					return {"id": spots[7], "dir": dir, "cost": parentMove};
    			}
    		}
    		if (!theGrid[spots[4]]) {
    			if (theGrid[spots[5]]) {
    				if (checkIfTrue(spots[5], open))
    					return {"id": spots[5], "dir": dir, "cost": parentMove};
    			}
    		}
    	}
    }

    fill(120, 50);
    rect((start % gridWidth) * 20, (int)(start / gridWidth) * 20, 20, 20);

    return jump(spots[dir], target, dir, parentMove+move[dir], open, ID);
}


lookAround = function (start, parentMove, open, closed, ID) {
	var cs = [false, false, false, false, false, false, false, false];
	var move = [10, 14, 10, 14, 10, 14, 10, 14];
	var opens = [false, false, false, false, false, false, false, false];
	var spots = [start-gridWidth, start-gridWidth+1, start+1, start+gridWidth+1, start+gridWidth, start+gridWidth-1, start-1, start-gridWidth-1];
	var parent;



	open.contains(function(node) {
		if (node.data.id === start) {
			parent = node;
		}
	}, open.traverseDF);

	open.traverseDF(function(node) {
		for (var i = 0; i < 8; i++) {
			if (node.data.id === spots[i]) {
				opens[i] = true;
			} 
		}
		if (node.data.id === start) {
			if (node.data.dir === 0 && theGrid[spots[0]]) {
				if (theGrid[spots[7]])
					cs[7] = true;
				cs[0] = true;
				if (theGrid[spots[1]])
					cs[1] = true;
			} else if (node.data.dir === 1 && theGrid[spots[1]]) {
				if (theGrid[spots[0]])
					cs[0] = true;
				cs[1] = true;
				if (theGrid[spots[2]])
					cs[2] = true;
			} else if (node.data.dir === 2 && theGrid[spots[2]]) {
				if (theGrid[spots[1]])
					cs[1] = true;
				cs[2] = true;
				if (theGrid[spots[3]])
					cs[3] = true;
			} else if (node.data.dir === 3 && theGrid[spots[3]]) {
				if (theGrid[spots[2]])
					cs[2] = true;
				cs[3] = true;
				if (theGrid[spots[4]])
					cs[4] = true;
			} else if (node.data.dir === 4 && theGrid[spots[4]]) {
				if (theGrid[spots[3]])
					cs[3] = true;
				cs[4] = true;
				if (theGrid[spots[5]])
					cs[5] = true;
			} else if (node.data.dir === 5 && theGrid[spots[5]]) {
				if (theGrid[spots[4]])
					cs[4] = true;
				cs[5] = true;
				if (theGrid[spots[6]])
					cs[6] = true;
			} else if (node.data.dir === 6 && theGrid[spots[6]]) {
				if (theGrid[spots[5]])
					cs[5] = true;
				cs[6] = true;
				if (theGrid[spots[7]])
					cs[7] = true;
			} else if (node.data.dir === 7 && theGrid[spots[7]]) {
				if (theGrid[spots[6]])
					cs[6] = true;
				cs[7] = true;
				if (theGrid[spots[0]])
					cs[0] = true;
			} else {
				for (var i = 0; i < 8; i++) {
					if (theGrid[spots[i]]) {
						cs[i] = true;
					}
				}
			}
		}
	});

for (var i = 0; i < 8; i++) {
	if (cs[i]) {
		if (opens[i]) {
			open.contains(function(node) {
				if (node.data.id === spots[i]) {
					if (node.data.G > move[i]+parentMove) {
						node.data.G = move[i]+parentMove;
						node.parent = parent;
					}
				}
			}, open.traverseDF);
			cs[i] = false;
		}
		else {
			open.add(HValueArr[spots[i]], move[i]+parentMove, spots[i], i, 'false', 0, start, open.traverseDF);
		}
	}
}

return cs;
}

updateGrid = function (ID) {
	theGrid[position] = false;
}

