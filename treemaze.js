function NodeMaze(x, y, wallList, p) {
	this.data = {"x": x, "y": y, "pDir": p};
	this.walls = wallList;
	this.nDir = [false, false, false, false, false, false, false, false];
	this.parent = null;
	this.children = [];
}

NodeMaze.prototype.setData = function(wallList, p) {
	if (this) {
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

NodeMaze.prototype.add = function (x, y, wallList, p) {
	var child;
	child = new NodeMaze(x, y, wallList, p);
	this.children.push(child);
	child.parent = this;
	return child;
}


