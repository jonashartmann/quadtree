(function(window) {
	'use strict';
	// maximum amount of items in a quad tree
	// If an insertion exceeds this value,
	// the quad tree will split.
	var MAX_ITEMS;

	/**
	 * Creates a new QuadTree with the given bounds
	 *
	 * @param object	bound - Bounds of the QuadTree
	 *						Like: {x:0, y:0, width:100, height:100}
	 * @param number	max - (optional) Maximum amount of items before splitting
	 */
	var QuadTree = function QuadTree(bounds, max) {
		// Array of four sub quad trees after splitting
		this.nodes = [];
		// Container for items in this tree
		this.items = [];
		this.bounds = bounds;
		MAX_ITEMS = max || 10;
	};

	/**
	 * Inserts an item into the quad tree.
	 *
	 * @param object	item - Has at least x, y, width, height
	 */
	QuadTree.prototype.insert = function insert (item) {
		var index = this.getNodeIndex(item);

		if (index !== -1 && this.nodes[index]) {
			// This QuadTree has already split
			this.nodes[index].insert(item);
		} else {
			this.items.push(item);
			if (index !== -1 && this.items.length > MAX_ITEMS) {
				this.splitTree();
			}
		}
	};

	/**
	 * Finds the index of the node which an item belongs to
	 * Node indexes are as below:
	 * 0 | 1
	 * -----
	 * 2 | 3
	 * Return	0-3 or -1 if not completely inside boundaries
	 */
	QuadTree.prototype.getNodeIndex = function getNodeIndex (item) {
		var index = -1,
			xHalf = this.bounds.x + (this.bounds.width / 2),
			yHalf = this.bounds.y + (this.bounds.height / 2),
			xLimit = this.bounds.x + this.bounds.width,
			yLimit = this.bounds.y + this.bounds.height,

			onLeftQuad = (item.x >= this.bounds.x && item.x + item.width < xHalf),
			onRightQuad = (item.x > xHalf && item.x + item.width <= xLimit),
			onTopQuad = (item.y >= this.bounds.y && item.y + item.height < yHalf),
			onBottomQuad = (item.y > yHalf && item.y + item.height <= yLimit);

		if (onLeftQuad && onTopQuad) {
			return 0;
		}
		if (onRightQuad && onTopQuad) {
			return 1;
		}
		if (onLeftQuad && onBottomQuad) {
			return 2;
		}
		if (onRightQuad && onBottomQuad) {
			return 3;
		}

		// Did not fit in any of the quads.
		return -1;
	};

	/**
	 * Splits this QuadTree in four
	 * and reindexes all items contained in it
	 * Node indexes are as below:
	 * 0 | 1
	 * -----
	 * 2 | 3
	 */
	QuadTree.prototype.splitTree = function splitTree() {
		this.nodes.push(new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y,
			width: this.bounds.width / 4,
			height: this.bounds.height / 4
		}, MAX_ITEMS));
		this.nodes.push(new QuadTree({
			x: this.bounds.x + (this.bounds.width / 2),
			y: this.bounds.y,
			width: this.bounds.width / 4,
			height: this.bounds.height / 4
		}, MAX_ITEMS));
		this.nodes.push(new QuadTree({
			x: this.bounds.x,
			y: this.bounds.y + (this.bounds.height / 2),
			width: this.bounds.width / 4,
			height: this.bounds.height / 4
		}, MAX_ITEMS));
		this.nodes.push(new QuadTree({
			x: this.bounds.x + (this.bounds.width / 2),
			y: this.bounds.y + (this.bounds.height / 2),
			width: this.bounds.width / 4,
			height: this.bounds.height / 4
		}, MAX_ITEMS));

		this.reindexTree();
	};

	QuadTree.prototype.reindexTree = function reindexTree() {
		// create a copy of the items list
		var notIndexedItems = this.items.slice(0);
		// remove all items from the tree
		this.items = [];
		// reindexes the items
		for (var i = 0; i < notIndexedItems.length; i++) {
			this.insert(notIndexedItems[i]);
		}
	};

	QuadTree.prototype.retrieve = function retrieve() {
		// TODO: implement
	};

	window.QuadTree = QuadTree;
})(window);