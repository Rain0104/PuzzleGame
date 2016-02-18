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
    },

// Event Handlers
//ToDo remove this handler.***
    onShowGameFieldPage: function (data) {
        PuzzleGame.EventDispatcher.trigger('StartGame', data);
        this.isVisibleGameField(true);
    },

    onCloseGameFieldClicked: function (){
        this.isVisibleGameField(false);
    },

    onPuzzleCompleted: function (){
        PuzzleGame.EventDispatcher.trigger('PuzzleCompleted');
    }
};

PuzzleGame.GameFieldComponent = GameFieldComponent;