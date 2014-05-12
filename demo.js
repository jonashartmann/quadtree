(function() {
	'use strict';
	var points, balls;

	var Demo = function Demo() {
		// Start a new demo
		this.stage = new Kinetic.Stage({
			container: 'container',
			width: 800,
			height: 600,
			draggable: false
		});
		this.mainLayer = new Kinetic.Layer();
		this.setupQuadTree(this.mainLayer);

		this.pointsGroup = new Kinetic.Group();
		this.ballsGroup = new Kinetic.Layer();

		// Start with points as default
		this.pointsDemo();

		this.stage.add(this.mainLayer);
	};

	Demo.prototype.pointsDemo = function pointsDemo() {
		this.clear();
		this.ballsGroup.remove();
		this.mainLayer.add(this.pointsGroup);
		this.mainLayer.draw();

		points = true;
		balls = false;
	};

	Demo.prototype.ballsDemo = function ballsDemo() {
		this.clear();
		this.pointsGroup.remove();
		this.stage.add(this.ballsGroup);
		this.stage.draw();

		balls = true;
		points = false;
	};

	Demo.prototype.setupQuadTree = function setupQuadTree(layer) {
		var self = this;
		self.qt = new QuadTree({
			x: 0,
			y: 0,
			width: 800,
			height: 600
		}, 20);

		var recursiveDrawQt = function recursiveDrawQt (qt, context) {
			if (!qt) { return; }
			context.rect(
				qt.bounds.x,
				qt.bounds.y,
				qt.bounds.width,
				qt.bounds.height
			);
			for (var i = 0; i < qt.nodes.length; i++) {
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

			if (points) {
				self.addRandomPoints(10, x, y);
			}
			if (balls) {
				// self.addRandomBalls(10, x, y);
				self.addBall(x, y);
			}
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
		point.shape = p;
		this.qt.insert(point);

		this.pointsGroup.add(p);
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

	Demo.prototype.changePointsColor = function changePointsColor(x, y) {
		console.log('Changing color of near (%f, %f)', x, y);
		var points = this.qt.retrieve({
			x: x,
			y: y,
			width: 1,
			height: 1
		});

		console.log('Found points: ', points);
		var linePoints = [],
			first;
		for (var i = 0; i < points.length; i++) {
			if (i === 0) {
				first = points[i];
			}
			points[i].shape.stroke('green');
			linePoints.push(points[i].x - x);
			linePoints.push(points[i].y - y);
		}
		if (points.length > 0) {
			// linePoints.push(first.x - x);
			// linePoints.push(first.y - y);
			var l = new Kinetic.Line({
				x: x,
				y: y,
				points: linePoints,
				fill: 'green',
				stroke: 'blue',
				strokeWidth: 1,
				closed: true
			});
			this.pointsGroup.add(l);
		}

		this.stage.draw();
	};

	Demo.prototype.addRandomBalls = function addRandomBalls(num, x, y) {
		var minX = (x - 100) < 0 ? 0 : (x - 100);
		var maxX = (x + 100) > 800 ? 800 : (x + 100);
		var minY = (y - 100) < 0 ? 0 : (y - 100);
		var maxY = (y + 100) > 600 ? 800 : (y + 100);
		for (var i = 0; i < num; i++) {
			this.addBall(
				getRandomArbitrary(minX, maxX),
				getRandomArbitrary(minY, maxY)
			);
		}
	};

	Demo.prototype.addBall = function addBall(x, y) {
		var self = this;
		var ball = {
			x: x,
			y: y,
			radius: 5,
			// for QuadTree
			width: 5,
			height: 5
		};

		var circle = new Kinetic.Circle({
			x: ball.x,
			y: ball.y,
			radius: ball.radius,
			fill: 'red',
			stroke: 'black',
			strokeWidth: 2
		});
		circle.on('click', function clickedCircle (e) {
			console.log('Destroying ball', ball);
			ball.shape.destroy();
			var removedBall = self.qt.remove(ball);
			if (removedBall === ball) {
				console.log('Remove success');
			}

			// Redraw
			self.ballsGroup.draw();
		});
		ball.shape = circle;

		this.qt.insert(ball);

		this.ballsGroup.add(circle);

		this.stage.draw();
	};

	Demo.prototype.startAnimation = function startAnimation() {
		this.anim.start();
	};

	Demo.prototype.stopAnimation = function stopAnimation() {
		this.anim.stop();
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

	/**
	 * Clear quad tree and points
	 * Also reset the zoom and scale
	 */
	Demo.prototype.clear = function clear() {
		this.qt.clear();
		this.pointsGroup.destroyChildren();
		this.ballsGroup.destroyChildren();
		this.resetZoom();
		this.stage.draw();
	};

	/**
	 * Reset the zoom and scale
	 */
	Demo.prototype.resetZoom = function() {
		this.mainLayer.offsetX(0);
		this.mainLayer.offsetY(0);

		this.mainLayer.scale({
			x: 1,
			y: 1
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
		// console.log('Key up!', keyCode);
		if (keyCode === 187) {
			// + sign
			demo.zoom(0.1);
		}
		if (keyCode === 189) {
			// - sign
			demo.zoom(-0.1);
		}
		if (keyCode === 71) {
			// g
			var mpos = demo.stage.getPointerPosition();
			demo.changePointsColor(mpos.x, mpos.y);
		}
	});

	document.addEventListener('keydown', function onKeyDown (e) {
		var keyCode = e.keyCode ? e.keyCode : e.which;
		// console.log('Key down!', keyCode);
	});

	window.demo = demo;
})();