describe("QuadTree", function() {
  var tree;

  beforeEach(function() {
    tree = new QuadTree({
      x: 0,
      y: 0,
      width: 100,
      height: 100
    });
  });

  it("should exist", function () {
    expect(tree).not.toBeNull();
  });

  describe("on node index calculation ", function () {
    it("should have top left as 0", function () {
      var item = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(0);
    });

    it("should have top right as 1", function () {
      var item = {
        x: 51,
        y: 0,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(1);
    });

    it("should have bottom left as 2", function () {
      var item = {
        x: 0,
        y: 51,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(2);
    });

    it("should have bottom right as 3", function () {
      var item = {
        x: 51,
        y: 51,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(3);
    });

    describe("when it does not fit ", function () {
      it("on top", function () {
        var item = {
          x: 45,
          y: 0,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on bottom", function () {
        var item = {
          x: 45,
          y: 45,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on left", function () {
        var item = {
          x: 15,
          y: 45,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on right", function () {
        var item = {
          x: 65,
          y: 45,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on out of bounds right", function () {
        var item = {
          x: 99,
          y: 0,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on out of bounds left", function () {
        var item = {
          x: -5,
          y: 0,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on out of bounds top", function () {
        var item = {
          x: 0,
          y: -5,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("on out of bounds bottom", function () {
        var item = {
          x: 0,
          y: 99,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });
    });
  });

  describe("on item insertion", function () {

    beforeEach(function () {
      spyOn(tree, 'splitTree');
    });

    it("should insert item correctly", function () {
      var item = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      };

      tree.insert(item);

      expect(tree.items.length).toBe(1);
      expect(tree.splitTree).not.toHaveBeenCalled();
      expect(tree.nodes.length).toBe(0);
    });

    it("should split after exceeding the maximum if it fits", function () {
      for (var i = 0; i < 10; i++) {
        tree.insert({
          x: i,
          y: 0,
          width: 10,
          height: 10
        });
      }
      expect(tree.items.length).toBe(10);
      expect(tree.splitTree).not.toHaveBeenCalled();

      tree.insert({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      });

      expect(tree.items.length).toBe(11);
      expect(tree.splitTree).toHaveBeenCalled();
    });

    it("should NOT split after exceeding the maximum if it does NOT fit", function () {
      for (var i = 0; i < 10; i++) {
        tree.insert({
          x: i,
          y: 0,
          width: 10,
          height: 10
        });
      }
      expect(tree.items.length).toBe(10);
      expect(tree.splitTree).not.toHaveBeenCalled();

      tree.insert({
        x: -5,
        y: 0,
        width: 10,
        height: 10
      });

      expect(tree.items.length).toBe(11);
      expect(tree.splitTree).not.toHaveBeenCalled();
    });
  });

  describe("on split ", function () {
    beforeEach(function () {
      tree = new QuadTree({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }, 1);
      spyOn(tree, 'reindexTree');
      tree.splitTree();
    });

    it("should create 4 nodes", function () {
      expect(tree.nodes.length).toBe(4);
    });

    it("should reindex the tree", function () {
      expect(tree.reindexTree).toHaveBeenCalled();
    });

    it("should have the same maximum amount", function () {
      spyOn(tree.nodes[0], 'splitTree');
      tree.insert({x: 0, y:1, width:5, height:5});
      expect(tree.nodes[0].items.length).toBe(1);
      // test a split of the first node
      tree.insert({x: 0, y:2, width:5, height:5});
      expect(tree.nodes[0].splitTree).toHaveBeenCalled();
    });

    it("should distribute correct bounds", function () {
      expect(tree.bounds.x).toBe(0);
      expect(tree.bounds.y).toBe(0);
      expect(tree.bounds.width).toBe(100);
      expect(tree.bounds.height).toBe(100);
      expect(tree.nodes[0].bounds.x).toBe(0);
      expect(tree.nodes[0].bounds.y).toBe(0);
      expect(tree.nodes[0].bounds.width).toBe(50);
      expect(tree.nodes[0].bounds.height).toBe(50);
      expect(tree.nodes[1].bounds.x).toBe(50);
      expect(tree.nodes[1].bounds.y).toBe(0);
      expect(tree.nodes[1].bounds.width).toBe(50);
      expect(tree.nodes[1].bounds.height).toBe(50);
      expect(tree.nodes[2].bounds.x).toBe(0);
      expect(tree.nodes[2].bounds.y).toBe(50);
      expect(tree.nodes[2].bounds.width).toBe(50);
      expect(tree.nodes[2].bounds.height).toBe(50);
      expect(tree.nodes[3].bounds.x).toBe(50);
      expect(tree.nodes[3].bounds.y).toBe(50);
      expect(tree.nodes[3].bounds.width).toBe(50);
      expect(tree.nodes[3].bounds.height).toBe(50);
    });
  });

  describe("on reindexing the tree ", function () {

    beforeEach(function () {
      tree = new QuadTree({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }, 4);
      // one item per node
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          tree.insert({
            x: i*51,
            y: j*51,
            width: 10,
            height: 10
          });
        }
      }
      expect(tree.items.length).toBe(4);

      // and one item that does not fit
      tree.insert({
        x: 45,
        y: 0,
        width: 10,
        height: 10
      });
      expect(tree.items.length).toBe(5);
    });

    it("should distribute the items across the new nodes", function () {
      // force a split
      tree.insert({
        x: 0,
        y: 66,
        width: 10,
        height: 10
      });
      // add another one after the split
      tree.insert({
        x: 66,
        y: 66,
        width: 10,
        height: 10
      });

      expect(tree.items.length).toBe(1);
      expect(tree.nodes.length).toBe(4);
      expect(tree.nodes[0].items.length).toBe(1);
      expect(tree.nodes[1].items.length).toBe(1);
      expect(tree.nodes[2].items.length).toBe(2);
      expect(tree.nodes[3].items.length).toBe(2);
    });
  });

  it("should remove all items and nodes on clear", function () {
    tree.splitTree();
    expect(tree.nodes.length).toBe(4);
    tree.insert({
      x: 45,
      y: 66,
      width: 10,
      height: 10
    });
    expect(tree.items.length).toBe(1);

    tree.insert({
      x: 0,
      y: 1,
      width: 10,
      height: 10
    });
    expect(tree.nodes[0].items.length).toBe(1);

    tree.clear();
    expect(tree.items.length).toBe(0);
    expect(tree.nodes.length).toBe(0);
  });

  describe("on retrieval ", function () {
    beforeEach(function () {
      tree = new QuadTree({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }, 2);
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          tree.insert({
            id: i + '' + j,
            x: i*55,
            y: j*55,
            width: 10,
            height: 10
          });
          tree.insert({
            id: i + '' + j + '2',
            x: i*55 + 1,
            y: j*55 + 1,
            width: 10,
            height: 10
          });
        }
      }

      expect(tree.nodes.length).toBe(4);
      expect(tree.nodes[0].items.length).toBe(2);
    });

    it("should retrieve from correct node", function () {
      var items = tree.retrieve({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      });

      expect(items.length).toBe(2);
      expect(items[0].id).toBe("00");
      expect(items[1].id).toBe("002");

      items = tree.retrieve({
        x: 55,
        y: 15,
        width: 10,
        height: 10
      });

      expect(items.length).toBe(2);
      expect(items[0].id).toBe("10");
      expect(items[1].id).toBe("102");
    });

    it("should retrieve all children", function () {
      var items = tree.retrieve({
        x: 45,
        y: 0,
        width: 10,
        height: 10
      });

      expect(items.length).toBe(8);
    });

    it("should retrieve from sub children", function () {
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 2; j++) {
          tree.insert({
            id: 'sub' + i + '' + j,
            x: i*55,
            y: j*55,
            width: 10,
            height: 10
          });
          tree.insert({
            id: 'sub' + i + '' + j + '2',
            x: i*55 + 1,
            y: j*55 + 1,
            width: 10,
            height: 10
          });
        }
      }

      // debugger;
      var items = tree.retrieve({
        x: 0,
        y: 0,
        width: 10,
        height: 10
      });

      expect(tree.nodes[0].nodes[0].nodes[0].items.length).toBe(4);
      expect(items.length).toBe(4);
    });

    it("should retrieve all children and not fitting items", function () {
      tree.insert({
        id: 'notfit',
        x: 45,
        y: 45,
        width: 10,
        height: 10
      });
      var items = tree.retrieve({
        x: 46,
        y: 0,
        width: 10,
        height: 10
      });

      expect(tree.items.length).toBe(1);
      expect(items.length).toBe(9);
    });
  });

  describe("on removal ", function () {
    beforeEach(function () {
      tree = new QuadTree({
        x: 0,
        y: 0,
        width: 100,
        height: 100
      }, 2);
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 1; j++) {
          tree.insert({
            id: i + '' + j,
            x: i*55,
            y: j*55,
            width: 10,
            height: 10
          });
          tree.insert({
            id: i + '' + j + '2',
            x: i*55 + 1,
            y: j*55 + 1,
            width: 10,
            height: 10
          });
        }
      }

      expect(tree.nodes.length).toBe(4);
      expect(tree.nodes[0].items.length).toBe(2);
    });


    it("should remove an item from root", function () {
      var item = {
        id: 'notfit',
        x: 45,
        y: 45,
        width: 10,
        height: 10
      };
      tree.insert(item);
      expect(tree.items.length).toBe(1);
      tree.remove(item);
      expect(tree.items.length).toBe(0);
    });

    it("should remove an item from child", function() {
      var item = {
        x: 55,
        y: 55,
        width: 10,
        height: 10
      };
      // debugger;
      tree.insert(item);
      expect(tree.nodes[3].items.length).toBe(1);
      tree.remove(item);
      expect(tree.nodes[3].items.length).toBe(0);
    });

    it("should reindex the tree when necessary", function() {
      var item = {
        x: 10,
        y: 0,
        width: 10,
        height: 10
      };
      var item2 = {
        x: 24,
        y: 0,
        width: 10,
        height: 10
      };
      tree.insert(item);
      tree.insert(item2);
      expect(tree.nodes[0].nodes.length).toBe(4);
      expect(tree.nodes[0].nodes[0].items.length).toBe(3);

      spyOn(tree, 'reindexTree');
      spyOn(tree.nodes[0], 'reindexTree');
      tree.remove(item);
      expect(tree.reindexTree).not.toHaveBeenCalled();
      // debugger;
      expect(tree.nodes[0].reindexTree).not.toHaveBeenCalled();
      expect(tree.nodes[0].nodes[0].items.length).toBe(1);
      tree.remove(item2);
      expect(tree.reindexTree).not.toHaveBeenCalled();
      expect(tree.nodes[0].reindexTree).toHaveBeenCalledWith(true);
      expect(tree.nodes[0].nodes.length).toBe(0);
      expect(tree.nodes[0].items.length).toBe(2);
    });
  });

  //demonstrates use of expected exceptions
  // describe("#resume", function() {
  //   it("should throw an exception if song is already playing", function() {
  //     player.play(song);

  //     expect(function() {
  //       player.resume();
  //     }).toThrowError("song is already playing");
  //   });
  // });
});
