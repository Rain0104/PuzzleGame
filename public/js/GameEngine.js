/**
 * Created by alyona.bugayeva on 07-Feb-16.
 */
PuzzleGame.GameEngine = (function () {

    function GameEngine() {
        this.activeImage = ko.observable({});
        this.bindEvents();
    }

    GameEngine.prototype = {

        bindEvents: function () {
            PuzzleGame.EventDispatcher.on('StartGame', this.startGame.bind(this));
            PuzzleGame.EventDispatcher.on('ImageCompleted', this.onImageCompleted.bind(this));
            PuzzleGame.EventDispatcher.on('GameCanceled', this.onGameCanceled.bind(this));
        },

        startGame: function (data) {

            this.activeImage(data);
            var image = document.querySelector("#puzzle-active-image");
            image.src = this.activeImage().path_image;
            if (image.width) {
            }
            var imgWidth = Math.floor(image.width / 50) * 50;
            var imgHeight = Math.floor(image.height / 50) * 50;
            image.width = imgWidth;
            image.height = imgHeight;

            var config = ({
                zoomScaleOnDrag: 1.2,
                imgName: 'puzzle-active-image',
                tileWidth: 50,
                tilesPerRow: imgWidth / 50,
                tilesPerColumn: imgHeight / 50,
                imgWidth: imgWidth,
                imgHeight: imgHeight,
                shadowWidth: 10

            });
            var puzzles = new PuzzleGame.Puzzles();
            PuzzleGame.EventDispatcher.trigger('StartTimer');
            PuzzleGame.EventDispatcher.trigger('CreatePuzzles', config);
        },

        onGameCanceled: function () {
            this.activeImage({});
        },

        onImageCompleted: function () {
            var playerTime = PuzzleGame.Timer.getTime();
            var imageName = this.activeImage().name;
            //todo get the time, update leader board for the current image
        }
    };
    return new GameEngine();
})();

