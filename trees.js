function PathNode(H, G, id, check) {
	var F = (int)(G+10*H);
	this.data = {"id": id, "hVal": H, "pLength": G, "pWeight": F, "check": check};
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

PathNode.prototype.add = function (H, G, id, check) {
	var child;
	child = new PathNode(H, G, id, check);
	this.children.push(child);
	child.parent = this;
	return child;
}

