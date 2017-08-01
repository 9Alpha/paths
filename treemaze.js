function NodeMaze(x, y, u, r, d, l, ut, rt, dt, lt) {
	this.data = {"x": x, "y": y, "u": u, "r": r, "d": d, "l": l, "ut": ut, "rt": rt, "dt": dt, "lt": lt, "vPrev": false};
	this.parent = null;
	this.children = [];
}

function TreeMaze(x, y, u, r, d, l, ut, rt, dt, lt) {
	var node = new NodeMaze(x, y, u, r, d, l, ut, rt, dt, lt);
	this._root = node;
}


function findIndex(arr, x, y) {
	var index;

	for (var i = 0; i < arr.length; i++) {
		if (arr[i].data.x === px && arr[i].data.y === py) {
			index = i;
		}
	}

	return index;
}

function traverse(currentNode, callback) {
	for (var i = 0; i < currentNode.children.length; i++) {
		traverse(currentNode.children[i], callback);
	}
	callback(currentNode);
}

TreeMaze.prototype.traverseDF = function(callback) {
	traverse(this._root, callback);
};

TreeMaze.prototype.add = function(x, y, wallList, px, py) {
	var child = new NodeMaze(x, y, wallList[0], wallList[1], wallList[2], wallList[3], wallList[4], wallList[5], wallList[6], wallList[7]);
	var parent = null;

	traverse(this._root, function (node) {
		if (node.data.x === px && node.data.y === py) {
			parent = node;
		}
	});

	if (parent) {
		parent.children.push(child);
		child.parent = parent;
	} else {
		console.log('Cannot add node to a non-existent parent.  (x, y)--> ('+px+", "+py+")");
	}
};

TreeMaze.prototype.remove = function(x, y, px, py, traversal) {
	var tree = this,
	parent = null,
	childToRemove = null,
	index;

	var callback = function(node) {
		if (node.data.x === px && node.data.y === py) {
			parent = node;
		}
	};

	this.contains(traversal, callback);

	if (parent) {
		index = findIndex(parent.children, x, y);

		if (index === undefined) {
			console.log('Node to remove does not exist. (x, y)--> ('+x+", "+y+")");
		} else {
			childToRemove = parent.children.splice(index, 1);
		}
	} else {
		console.log('Parent does not exist. (x, y)--> ('+px+", "+py+")");
	}

	return childToRemove;
};

