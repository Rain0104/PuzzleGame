/**
 * Created by alyona.bugayeva on 1/1/2016.
 */
function GameFieldComponent() {

    this.isVisibleGameField = ko.observable(false);

    this.bindEvents();
}

GameFieldComponent.prototype = {

    init: function () {
        var msg = 'GameFieldComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'GameFieldComponent ready';
        console.log(msg);
    },
    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('ShowGameFieldPage', this.onShowGameFieldPage.bind(this));
        PuzzleGame.EventDispatcher.on('FinishGame', this.onFinishGame.bind(this));
    },

// Event Handlers
    onShowGameFieldPage: function (data) {
        PuzzleGame.EventDispatcher.trigger('StartGame', data);
        this.isVisibleGameField(true);
    },

    onFinishGame: function (){
        this.isVisibleGameField(false);
    }
};

PuzzleGame.GameFieldComponent = GameFieldComponent;