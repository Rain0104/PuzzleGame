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
        var leaderBoard = [];
        for (var i = 0; i < data.length; i++) {
            var time = data[i].time.hours + ':' + data[i].time.minutes + ':' + data[i].time.seconds;
            var leaderBordLine = {
                playerName: data[i].playerName,
                time: time
            };
            leaderBoard.push(leaderBordLine);
        }
        this.leaderBoard(leaderBoard);
        this.isVisibleLeaderBoard(true);
    },

    onCloseClicked: function () {
        this.leaderBoard([]);
        this.isVisibleLeaderBoard(false);
        PuzzleGame.EventDispatcher.trigger('ShowMainPage');
    }
};

PuzzleGame.LeaderBoardComponent = LeaderBoardComponent;