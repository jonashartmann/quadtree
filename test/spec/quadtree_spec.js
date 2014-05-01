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

  describe("should calculate correct node index: ", function () {
    it("top left", function () {
      var item = {
        x: 0,
        y: 0,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(0);
    });

    it("top right", function () {
      var item = {
        x: 51,
        y: 0,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(1);
    });

    it("bottom left", function () {
      var item = {
        x: 0,
        y: 51,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(2);
    });

    it("bottom right", function () {
      var item = {
        x: 51,
        y: 51,
        width: 10,
        height: 10
      };
      var idx = tree.getNodeIndex(item);

      expect(idx).toBe(3);
    });

    describe("when does not fit ", function () {
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

      it("cause out of bounds right", function () {
        var item = {
          x: 99,
          y: 0,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("cause out of bounds left", function () {
        var item = {
          x: -5,
          y: 0,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("cause out of bounds top", function () {
        var item = {
          x: 0,
          y: -5,
          width: 10,
          height: 10
        };
        var idx = tree.getNodeIndex(item);

        expect(idx).toBe(-1);
      });

      it("cause out of bounds bottom", function () {
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
