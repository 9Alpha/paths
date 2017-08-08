function PathNode(A, B, id, check) {
	var C = (int)(B+10*A);
	this.data = {"id": id, "H": A, "G": B, "F": C, "check": check};
	this.parent = null;
	this.children = [];
}

traverse = function(currentNode, callback) {
	if (currentNode.children) {
		for (var i = 0; i < currentNode.children.length; i++) {
			traverse(currentNode.children[i], callback);
		}
		callback(currentNode);
	}
}

PathNode.prototype.findHead = function() {
	if (this.parent === null) {
		return this;
	}
	return this.parent.findHead();
}

PathNode.prototype.traverseDF = function(callback) {
	traverse(this.findHead(), callback);
}

PathNode.prototype.add = function (A, B, id, check, toData) {
	var child;
	child = new PathNode(A, B, id, check);
	this.children.push(child);
	child.parent = this;
	return child;
}

