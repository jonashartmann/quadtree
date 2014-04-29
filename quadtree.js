(function(window) {
	'use strict';
	// maximum amount of items in a quad
	// If an insertion exceeds this value,
	// the quad will split.
	var MAX_ITEMS;

	var QuadTree = function QuadTree(bounds) {
		this.nodes = [];
		this.bounds = bounds;
	};

	/**
	 * Inserts an item into the quad tree.
	 *
	 * @param object	item - Has at least x, y, width, height
	 */
	QuadTree.prototype.insert = function insert (item) {
		
	};

	/**
	 * Finds the index of the node which an item belongs to
	 * We count clockwise from the left top node
	 * 0 | 1
	 * -----
	 * 2 | 3
	 * Return	0-3 or -1 if not completely inside boundaries
	 */
	QuadTree.prototype.getNodeIndex = function getNodeIndex (item) {
		var index = -1;
		var xHalf = this.bounds.x + (this.bounds.width / 2);
		var yHalf = this.bounds.y + (this.bounds.height / 2);
		var onLeftQuad = false,
			onRightQuad = false;

		onLeftQuad = (item.x + item.width < xHalf);
		onRightQuad = (item.x > xHalf);

		// TODO: continue logic
	};

	window.QuadTree = QuadTree;
})(window);