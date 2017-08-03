function NodeMaze(x, y, wallList, p) {
	this.data = {"x": x, "y": y, "pDir": p};
	this.walls = wallList;
	this.data.pDir = p;
	this.parent = null;
	this.children = [];
}

NodeMaze.prototype.setData = function(wallList, p) {
	if (this.data) {
		this.walls = wallList;
		this.data.pDir = p;
	}
}

NodeMaze.prototype.findHead = function() {
	if (this.parent === null) {
		return this;
	}
	return this.parent.findHead();
}

traverse = function(currentNode, callback) {
	if (currentNode.children) {
		for (var i = 0; i < currentNode.children.length; i++) {
			traverse(currentNode.children[i], callback);
		}
		callback(currentNode);
	}
}

NodeMaze.prototype.traverseDF = function(callback) {
	traverse(this.findHead(), callback);
}

NodeMaze.prototype.add = function (x, y, wallList, p, node) {
	var child;
	if (node) {
		child = new NodeMaze(x, y, wallList, p);
		node.children.push(child);
	} else {
		console.log("Cannot add node to a non-existent parent");
	}
}

/*TreeMaze.prototype.remove = function(x, y, px, py, traversal) {
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
};*/

