(function() {
	'use strict';

	var Demo = function Demo() {
		// Start a new demo
		this.stage = new Kinetic.Stage({
			container: 'container',
			width: 800,
			height: 600
		});
		this.mainLayer = new Kinetic.Layer();
		this.setupQuadTree(this.mainLayer);
		this.stage.add(this.mainLayer);
	};

	Demo.prototype.setupQuadTree = function setupQuadTree(layer) {
		var self = this;
		self.qt = new QuadTree({
			x: 0,
			y: 0,
			width: 800,
			height: 600
		}, 5);

		var recursiveDrawQt = function recursiveDrawQt (qt, context) {
			if (!qt) { return; }
			// console.log('drawing qt: ', qt);
			context.rect(
				qt.bounds.x,
				qt.bounds.y,
				qt.bounds.width,
				qt.bounds.height
			);
			for (var i = 0; i < qt.nodes.length; i++) {
				// console.log('drawing node: ', i);
				recursiveDrawQt(qt.nodes[i], context);
			}
		};

		var qtShape = new Kinetic.Shape({
			sceneFunc: function (context) {
				context.beginPath();
				recursiveDrawQt(self.qt, context);
				context.closePath();
				context.fillStrokeShape(this);
			},
			stroke: 'black',
			strokeWidth: 2
		});
		qtShape.on('click', function () {
			var mousepos = self.stage.getPointerPosition();
			var x = mousepos.x;
			var y = mousepos.y;
			console.log('(%s, %s)', x, y);
			self.addPoint(x, y);
		});
		layer.add(qtShape);
	};

	Demo.prototype.addPoint = function addPoint(x, y) {
		var point = {
			x: x,
			y: y,
			width: 1,
			height: 1
		};
		var p = new Kinetic.Rect({
			x: point.x,
			y: point.y,
			width: point.width,
			height: point.height,
			fill: 'green',
			stroke: 'blue',
			strokeWidth: 1,
		});
		this.mainLayer.add(p);
		this.qt.insert(point);
		// refresh layer
		this.mainLayer.draw();
	};

	var demo = new Demo();
})();