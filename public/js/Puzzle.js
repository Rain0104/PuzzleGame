PuzzleGame.Puzzles = (function () {

    function Puzzles() {
        this.bindEvents();
    }

    Puzzles.prototype = {

        bindEvents: function () {
            PuzzleGame.EventDispatcher.on('CreatePuzzles', this.createPuzzles.bind(this));
        },

        createPuzzles: function (config) {
            this.currentZoom = 0.7;
            this.zoomScaleOnDrag = config.zoomScaleOnDrag;
            this.imgName = config.imgName;
            this.shadowWidth = config.shadowWidth;
            this.puzzleImage = new Raster(config.imgName);
            this.puzzleImage.visible = false;
            this.tileWidth = config.tileWidth;
            this.tilesPerRow = config.tilesPerRow;
            this.tilesPerColumn = config.tilesPerColumn;
            this.tileMarginWidth = this.tileWidth * 0.2;
            this.selectedTile = undefined;
            this.selectedTileIndex = undefined;
            this.selectionGroup = undefined;
            this.puzzleImage.position = view.center;
            this.currentScroll = new Point(0, 0);
            this.scrollMargin = 20;
            this.tiles = this.createTiles(this.tilesPerRow, this.tilesPerColumn);
            this.addEventListeners();
        },

        addEventListeners: function () {
            var puzzle = this;
            view.zoom = puzzle.currentZoom;
            view.currentScroll = new Point(0, 0);

            document.querySelector('.cancelGame').addEventListener("click", function (event) {
                puzzle.cleanGameField();
                PuzzleGame.EventDispatcher.trigger('GameCanceled');
            });

            document.querySelector('.zoomIn').addEventListener("click", function (event) {
                puzzle.zoom(+0.1);
            });

            document.querySelector('.zoomOut').addEventListener("click", function (event) {
                puzzle.zoom(-0.1);
            });

            document.querySelector('.help').addEventListener("click", function () {
                PuzzleGame.EventDispatcher.trigger('ShowHintClicked');
                /*todo handler for ShowHintClicked event and template for hint*/
            }.bind(this));

            tool.activate();
            tool.onMouseDown = function (event) {
                puzzle.pickTile();
            };

            tool.onMouseUp = function (event) {
                puzzle.releaseTile();
            };

            tool.onMouseMove = function (event) {
                puzzle.mouseMove(event.point, event.delta);

                if (event.point.x < puzzle.scrollMargin) {
                    puzzle.scrollVector = new Point(puzzle.scrollMargin - event.point.x, 0);
                } else {
                    puzzle.scrollVector = new Point(0, 0);
                }
            };

            tool.onMouseDrag = function (event) {
                puzzle.dragTile(event.delta);
            };
        },

        getRandomTabValue: function () {
            return Math.pow(-1, Math.floor(Math.random() * 2));
        },

        createTiles: function (xTileCount, yTileCount) {
            var tiles = [];
            var tileRatio = this.tileWidth / 100;
            var shapeArray = this.getRandomShapes(xTileCount, yTileCount);
            var x;
            var y;
            var tileIndexes = [];
            for (y = 0; y < yTileCount; y++) {
                for (x = 0; x < xTileCount; x++) {
                    var shape = shapeArray[y * xTileCount + x];
                    var mask = this.getMask(tileRatio, shape.topTab, shape.rightTab, shape.bottomTab, shape.leftTab, this.tileWidth);
                    mask.opacity = 0.5;
                    mask.strokeColor = '#fff';
                    var cloneImg = this.puzzleImage.clone();
                    var img = this.getTileRaster(
                        cloneImg,
                        new Size(this.tileWidth, this.tileWidth),
                        new Point(this.tileWidth * x, this.tileWidth * y)
                    );
                    var border = mask.clone();
                    border.strokeColor = '#fff';
                    border.strokeWidth = 3;
                    var tile = new Group(mask, border, img, border);
                    tile.clipped = true;
                    tile.opacity = 1;
                    tile.shape = shape;
                    tile.imagePosition = new Point(x, y);
                    tiles.push(tile);
                    tileIndexes.push(tileIndexes.length);
                }
            }
            for (y = 0; y < yTileCount; y++) {
                for (x = 0; x < xTileCount; x++) {
                    var index1 = Math.floor(Math.random() * tileIndexes.length);
                    var index2 = tileIndexes[index1];
                    var newTile = tiles[index2];
                    tileIndexes.splice(index1, 1);
                    var position = new Point(Math.floor(Math.random() * view._viewSize._width), Math.floor(Math.random() * view._viewSize._height));
                    var cellPosition = new Point(
                        Math.round(position.x / this.tileWidth) + 1,
                        Math.round(position.y / this.tileWidth) + 1);
                    newTile.position = cellPosition * this.tileWidth;
                    newTile.cellPosition = cellPosition;
                }
            }
            return tiles;
        },

        getTileRaster: function (sourceRaster, size, offset) {
            var targetRaster = new Raster('empty');
            var tileWithMarginWidth = size.width + this.tileMarginWidth * 2;
            var data = sourceRaster.getData(new Rectangle(
                offset.x - this.tileMarginWidth,
                offset.y - this.tileMarginWidth,
                tileWithMarginWidth,
                tileWithMarginWidth));
            targetRaster.setData(data, new Point(0, 0));
            targetRaster.position = new Point(30, 40);
            return targetRaster;
        },

        getRandomShapes: function (width, height) {
            var y;
            var x;
            var shapeArray = [];

            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {

                    var topTab = null;
                    var rightTab = null;
                    var bottomTab = null;
                    var leftTab = null;
                    if (y == 0)
                        topTab = 0;
                    if (y === height - 1)
                        bottomTab = 0;
                    if (x === 0)
                        leftTab = 0;
                    if (x === width - 1)
                        rightTab = 0;
                    shapeArray.push(
                        ({
                            topTab: topTab,
                            rightTab: rightTab,
                            bottomTab: bottomTab,
                            leftTab: leftTab
                        })
                    );
                }
            }

            for (y = 0; y < height; y++) {
                for (x = 0; x < width; x++) {

                    var shape = shapeArray[y * width + x];

                    var shapeRight = (x < width - 1) ?
                        shapeArray[y * width + (x + 1)] :
                        null;

                    var shapeBottom = (y < height - 1) ?
                        shapeArray[(y + 1) * width + x] :
                        null;

                    shape.rightTab = (x < width - 1) ?
                        this.getRandomTabValue() :
                        shape.rightTab;

                    if (shapeRight)
                        shapeRight.leftTab = -shape.rightTab;

                    shape.bottomTab = (y < height - 1) ?
                        this.getRandomTabValue() :
                        shape.bottomTab;

                    if (shapeBottom)
                        shapeBottom.topTab = -shape.bottomTab;
                }
            }
            return shapeArray;
        },

        getMask: function (tileRatio, topTab, rightTab, bottomTab, leftTab, tileWidth) {
            var curvyCoords = [
                0, 0, 35, 15, 37, 5,
                37, 5, 40, 0, 38, -5,
                38, -5, 20, -20, 50, -20,
                50, -20, 80, -20, 62, -5,
                62, -5, 60, 0, 63, 5,
                63, 5, 65, 15, 100, 0
            ];

            var mask = new Path();
            var tileCenter = view.center;
            var i;
            var p1;
            var p2;
            var p3;
            var x1;
            var x2;
            var x3;
            var y1;
            var y2;
            var y3;

            var topLeftEdge = new Point(-4, 4);
            mask.moveTo(topLeftEdge);
//Top
            for (i = 0; i < curvyCoords.length / 6; i++) {
                x1 = curvyCoords[i * 6] * tileRatio;
                y1 = topTab * curvyCoords[i * 6 + 1] * tileRatio;
                p1 = topLeftEdge + new Point(x1, y1);
                x2 = curvyCoords[i * 6 + 2] * tileRatio;
                y2 = topTab * curvyCoords[i * 6 + 3] * tileRatio;
                p2 = topLeftEdge + new Point(x2, y2);
                x3 = curvyCoords[i * 6 + 4] * tileRatio;
                y3 = topTab * curvyCoords[i * 6 + 5] * tileRatio;
                p3 = topLeftEdge + new Point(x3, y3);
                mask.cubicCurveTo(p1, p2, p3);
            }
//Right
            var topRightEdge = topLeftEdge + new Point(tileWidth, 0);
            for (i = 0; i < curvyCoords.length / 6; i++) {
                x1 = rightTab * curvyCoords[i * 6 + 1] * tileRatio;
                y1 = curvyCoords[i * 6] * tileRatio;
                p1 = topRightEdge + new Point(x1, y1);
                x2 = rightTab * curvyCoords[i * 6 + 3] * tileRatio;
                y2 = curvyCoords[i * 6 + 2] * tileRatio;
                p2 = topRightEdge + new Point(x2, y2);
                x3 = rightTab * curvyCoords[i * 6 + 5] * tileRatio;
                y3 = curvyCoords[i * 6 + 4] * tileRatio;
                p3 = topRightEdge + new Point(x3, y3);
                mask.cubicCurveTo(p1, p2, p3);
            }
//Bottom
            var bottomRightEdge = topRightEdge + new Point(0, tileWidth);
            for (i = 0; i < curvyCoords.length / 6; i++) {
                x1 = curvyCoords[i * 6] * tileRatio;
                y1 = bottomTab * curvyCoords[i * 6 + 1] * tileRatio;
                p1 = bottomRightEdge - new Point(x1, y1);
                x2 = curvyCoords[i * 6 + 2] * tileRatio;
                y2 = bottomTab * curvyCoords[i * 6 + 3] * tileRatio;
                p2 = bottomRightEdge - new Point(x2, y2);
                x3 = curvyCoords[i * 6 + 4] * tileRatio;
                y3 = bottomTab * curvyCoords[i * 6 + 5] * tileRatio;
                p3 = bottomRightEdge - new Point(x3, y3);
                mask.cubicCurveTo(p1, p2, p3);
            }
//Left
            var bottomLeftEdge = bottomRightEdge - new Point(tileWidth, 0);
            for (i = 0; i < curvyCoords.length / 6; i++) {
                x1 = leftTab * curvyCoords[i * 6 + 1] * tileRatio;
                y1 = curvyCoords[i * 6] * tileRatio;
                p1 = bottomLeftEdge - new Point(x1, y1);
                x2 = leftTab * curvyCoords[i * 6 + 3] * tileRatio;
                y2 = curvyCoords[i * 6 + 2] * tileRatio;
                p2 = bottomLeftEdge - new Point(x2, y2);
                x3 = leftTab * curvyCoords[i * 6 + 5] * tileRatio;
                y3 = curvyCoords[i * 6 + 4] * tileRatio;
                p3 = bottomLeftEdge - new Point(x3, y3);
                mask.cubicCurveTo(p1, p2, p3);
            }
            return mask;
        },

        checkTiles: function () {
            var errors = 0;
            var firstTile = this.tiles[0];
            var firstCellPosition = firstTile.cellPosition;
            for (var y = 0; y < this.tilesPerColumn; y++) {
                for (var x = 0; x < this.tilesPerRow; x++) {
                    var index = y * this.tilesPerRow + x;
                    var cellPosition = this.tiles[index].cellPosition;

                    if (cellPosition != firstCellPosition + new Point(x, y)) {
                        errors++;
                    }
                }
            }

            return errors;
        },

        getTileAtCellPosition: function (point) {
            var width = this.tilesPerRow;
            var height = this.tilesPerColumn;
            var tile = null;
            for (var i = 0; i < this.tiles.length; i++) {
                if (this.tiles[i].cellPosition == point) {
                    tile = this.tiles[i];
                    break;
                }
            }
            return tile;
        },

        dragTile: function (delta) {
            if (this.selectedTile) {
                this.selectionGroup.position += delta;
                this.selectedTile.opacity = 1;
            }
            else {
                var currentScroll = view.currentScroll - delta * this.currentZoom;
                view.scrollBy(currentScroll);
                view.currentScroll = currentScroll;
            }
        },

        mouseMove: function (point, delta) {
            if (!this.selectionGroup) {
                project.activeLayer.selected = false;
                if (delta.x < 8 && delta.y < 8) {
                    var tolerance = this.tileWidth * .5;
                    var hit = false;
                    for (var index = 0; index < this.tiles.length; index++) {
                        var tile = this.tiles[index];
                        var tileCenter = tile.position;
                        var deltaPoint = tileCenter - point;
                        hit = (deltaPoint.x * deltaPoint.x + deltaPoint.y * deltaPoint.y) < tolerance * tolerance;
                        if (hit) {
                            this.selectedTile = tile;
                            this.selectedTileIndex = index;
                            tile.opacity = 0.7;
                            project.activeLayer.addChild(tile);
                            return;
                        } else {
                            tile.opacity = 1;
                        }
                    }
                    if (!hit)
                        this.selectedTile = null;
                }
            } else {
                this.dragTile(delta);
            }
        },

        pickTile: function () {
            if (this.selectedTile) {
                if (!this.selectedTile.lastScale) {
                    this.selectedTile.lastScale = this.zoomScaleOnDrag;
                    this.selectedTile.scale(this.selectedTile.lastScale);
                } else {
                    if (this.selectedTile.lastScale > 1) {
                        this.releaseTile();
                        return;
                    }
                }
                this.selectedTile.cellPosition = null;
                this.selectionGroup = new Group(this.selectedTile);
                var pos = new Point(this.selectedTile.position.x, this.selectedTile.position.y);
                this.selectedTile.position = new Point(0, 0);
                this.selectionGroup.position = pos;
            }
        },

        releaseTile: function () {
            if (this.selectedTile) {
                var cellPosition = new Point(
                    Math.round(this.selectionGroup.position.x / this.tileWidth),
                    Math.round(this.selectionGroup.position.y / this.tileWidth));
                var roundPosition = cellPosition * this.tileWidth;
                var hasConflict = false;
                var alreadyPlacedTile = this.getTileAtCellPosition(cellPosition);
                hasConflict = alreadyPlacedTile;
                var topTile = this.getTileAtCellPosition(cellPosition + new Point(0, -1));
                var rightTile = this.getTileAtCellPosition(cellPosition + new Point(1, 0));
                var bottomTile = this.getTileAtCellPosition(cellPosition + new Point(0, 1));
                var leftTile = this.getTileAtCellPosition(cellPosition + new Point(-1, 0));
                if (topTile) {
                    hasConflict = hasConflict || !(topTile.shape.bottomTab + this.selectedTile.shape.topTab === 0);
                }
                if (bottomTile) {
                    hasConflict = hasConflict || !(bottomTile.shape.topTab + this.selectedTile.shape.bottomTab === 0);
                }
                if (rightTile) {
                    hasConflict = hasConflict || !(rightTile.shape.leftTab + this.selectedTile.shape.rightTab === 0);
                }
                if (leftTile) {
                    hasConflict = hasConflict || !(leftTile.shape.rightTab + this.selectedTile.shape.leftTab === 0);
                }
                if (!hasConflict) {
                    if (this.selectedTile.lastScale) {
                        this.selectedTile.scale(1 / this.selectedTile.lastScale);
                        this.selectedTile.lastScale = null;
                    }

                    this.selectionGroup.remove();
                    var tile = this.tiles[this.selectedTileIndex];
                    tile.position = roundPosition;
                    tile.cellPosition = cellPosition;
                    this.selectionGroup.remove();
                    this.selectedTile =
                        this.selectionGroup = null;
                    project.activeLayer.addChild(tile);
                    var errors = this.checkTiles();
                    if (errors === 0) {

                        PuzzleGame.EventDispatcher.trigger('ImageCompleted');
                        this.cleanGameField();
                    }
                }
            }
        },

        cleanGameField: function () {
            tool.remove();
            project.activeLayer.removeChildren();
        },

        zoom: function (zoomDelta) {
            var newZoom = this.currentZoom + zoomDelta;
            if (newZoom >= 0.3 && newZoom <= 1) {
                view.zoom = this.currentZoom = newZoom;
            }
        }
    };
    return new Puzzles();
})();