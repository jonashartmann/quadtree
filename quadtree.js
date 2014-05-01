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

	window.QuadTree = QuadTree;
})(window);