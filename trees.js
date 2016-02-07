

function Node(A, B, id, dir, check) {
	var C = (int)(B+10*A);
	this.data = {"id": id, "H": A, "G": B, "F": C, "dir": dir, "check": check};
	this.parent = null;
	this.children = [];
}

function Tree(A, B, id, dir, check) {
	var node = new Node(A, B, id, dir, check);
	this._root = node;
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

Tree.prototype.traverseDF = function(callback) {

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

Tree.prototype.contains = function(callback, traversal) {
	traversal.call(this, callback);
};

Tree.prototype.add = function(A, B, id, dir, check, toData, traversal) {
	var child = new Node(A, B, id, dir, check),
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

Tree.prototype.remove = function(id, fromData, traversal) {
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
			console.log('Node to remove does not exist. ID--> '+id);
		} else {
			childToRemove = parent.children.splice(index, 1);
		}
	} else {
		console.log('Parent does not exist. Parent--> '+fromData);
	}

	return childToRemove;
};

