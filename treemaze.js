

function Node(x, y) {
	this.data = {"x": x, "y": y};
	this.parent = null;
	this.children = [];
}

function TreeMaze(x, y) {
	var node = new Node(x, y);
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

TreeMaze.prototype.traverseDF = function(callback) {

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

TreeMaze.prototype.contains = function(traversal, callback) {
	traversal.call(this, callback);
};

TreeMaze.prototype.add = function(x, y, px, py, traversal) {
	var child = new Node(x, y),
	parent = null,
	callback = function(node) {
		if (node.data.x === px && node.data.y === py) {
			parent = node;
		}
	};

	this.contains(traversal, callback);

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

