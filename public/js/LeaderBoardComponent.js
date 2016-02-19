/**
 * Created by alyona.bugayeva on 20-Feb-16.
 */
function LeaderBoardComponent() {
    this.isVisibleLeaderBoard = ko.observable(false);
    this.leaderBoard = ko.observable([]);

    this.bindEvents();
}

LeaderBoardComponent.prototype = {

    init: function () {
        var msg = 'LeaderBoardComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'LeaderBoardComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('LeaderBoardReceived', this.onLeaderBoardReceived.bind(this));
    },

    onLeaderBoardReceived: function (data) {
        this.leaderBoard(data);
        this.isVisibleLeaderBoard(true);
     },

    onCloseClicked: function () {
        this.leaderBoard = ko.observable([]);
        this.isVisibleLeaderBoard(false);
        PuzzleGame.EventDispatcher.trigger('ShowMainPage');

    }
};

PuzzleGame.LeaderBoardComponent = LeaderBoardComponent;