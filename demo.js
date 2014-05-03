(function() {
	'use strict';

	var Demo = function Demo() {
		// Start a new demo
		this.stage = new Kinetic.Stage({
			container: 'container',
			width: 800,
			height: 600,
			draggable: true
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
			// self.addPoint(x, y);
			self.addRandomPoints(10, x, y);
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
			stroke: 'red',
			strokeWidth: 1,
		});
		this.mainLayer.add(p);
		this.qt.insert(point);
		// refresh layer
		this.mainLayer.draw();
	};

	/**
	 * Add num random points around x and y coordinates
	 */
	Demo.prototype.addRandomPoints = function addRandomPoints(num, x, y) {
		var minX = (x - 100) < 0 ? 0 : (x - 100);
		var maxX = (x + 100) > 800 ? 800 : (x + 100);
		var minY = (y - 100) < 0 ? 0 : (y - 100);
		var maxY = (y + 100) > 600 ? 800 : (y + 100);
		for (var i = 0; i < num; i++) {
			this.addPoint(
				getRandomArbitrary(minX, maxX),
				getRandomArbitrary(minY, maxY)
			);
		}
	};

	Demo.prototype.zoom = function zoom(zoomAmount) {
		var origin = {
			x: this.mainLayer.offsetX(),
			y: this.mainLayer.offsetY()
		};
		var scale = this.mainLayer.scale().x;
		var newScale = scale + zoomAmount;
		if (newScale < 1) {
			newScale = 1;
		}

		var mpos = this.stage.getPointerPosition();

		origin.x = origin.x + (mpos.x / scale) - (mpos.x / newScale);
		origin.y = origin.y + (mpos.y / scale) - (mpos.y / newScale);

		this.mainLayer.offsetX(origin.x);
		this.mainLayer.offsetY(origin.y);

		this.mainLayer.scale({
			x: newScale,
			y: newScale
		});
		this.mainLayer.draw();
	};

	// Returns a random number between min and max
	function getRandomArbitrary(min, max) {
		return Math.random() * (max - min) + min;
	}

	var demo = new Demo();

	document.addEventListener('keyup', function onKeyUp (e) {
		var keyCode = e.keyCode ? e.keyCode : e.which;
		console.log('Key up!', keyCode);
		if (keyCode === 187) {
			// + sign
			demo.zoom(0.1);
		}
		if (keyCode === 189) {
			// - sign
			demo.zoom(-0.1);
		}
	});
})();