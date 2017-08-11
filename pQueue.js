pQueue = function(H, G, id, check) {
	this.list = [];
	this.size = 0;
	this.add(H, G, id, check, null);
}


pathNode = function(H, G, id, check, parent) {
	var F = (int)(G+10*H);
	this.data = {"id": id, "hVal": H, "pLength": G, "pWeight": F, "check": check};
	this.parent = parent;
}

pQueue.prototype.toString = function() {
	console.log("pQueue: Size "+this.size);
	for (var i = 0; i < this.size; i++) {
		console.log("["+i+"] pWeight: "+this.list[i].data.pWeight+" id: "+this.list[i].data.id);
	}
}

pQueue.prototype.add = function(H, G, id, check, parent) {
	var child;
	child = new pathNode(H, G, id, check, parent);
	//console.log("Real Size: "+this.list.length+"  Size: "+this.size);
	if (this.list.length === this.size) {
		this.list.push(child);
	} else {
		this.list[this.size] = child;
	}
	this.percolateUp(this.size);
	this.size++;
}

pQueue.prototype.pluck = function() {
	var tmp = this.list[0];
	this.list[0] = this.list[this.size-1];
	this.list[this.size-1] = null;
	this.size--;
	this.percolateDown(0);
	return tmp;
}

pQueue.prototype.percolateUp = function(index) {
	var nIndex = Math.floor((index-1)/2);
	if (nIndex < 0) {
		return index;
	} else if (this.list[index].data.pWeight >= this.list[nIndex].data.pWeight) {
		return index;
	}
	var tmp = this.list[nIndex];
	this.list[nIndex] = this.list[index];
	this.list[index] = tmp;
	return this.percolateUp(nIndex);
}

pQueue.prototype.percolateDown = function(index) {
	var lIndex = index*2+1;
	var rIndex = index*2+2;
	if (lIndex >= this.size && rIndex >= this.size) {
		return index;
	} else if (rIndex >= this.size) {
		if (this.list[index].data.pWeight >= this.list[lIndex].data.pWeight) {
			var tmp = this.list[lIndex];
			this.list[lIndex] = this.list[index];
			this.list[index] = tmp;
			return this.percolateDown(lIndex);
		}
	} else {
		if (this.list[lIndex].data.pWeight >= this.list[rIndex].data.pWeight && this.list[index].data.pWeight >= this.list[rIndex].data.pWeight) {
			var tmp = this.list[rIndex];
			this.list[rIndex] = this.list[index];
			this.list[index] = tmp;
			return this.percolateDown(rIndex);
		} else if (this.list[lIndex].data.pWeight < this.list[rIndex].data.pWeight && this.list[index].data.pWeight >= this.list[lIndex].data.pWeight) {
			var tmp = this.list[lIndex];
			this.list[lIndex] = this.list[index];
			this.list[index] = tmp;
			return this.percolateDown(lIndex);
		}
	}
	return index;
}

