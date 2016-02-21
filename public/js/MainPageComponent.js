/**
 * Created by alyona.bugayeva on 12/15/2015.
 */
function MainPageComponent() {

    //this.playerIsLoggedIn = ko.observable(true);
    this.isVisibleMainPage = ko.observable(true);
    this.isVisiblePlayerImages = ko.observable(false);
    this.playerPuzzleImages = ko.observableArray([]);
    this.commonPuzzleImages = ko.observableArray([]);

    this.bindEvents();
}

MainPageComponent.prototype = {

    init: function () {
        var msg = 'MainPageComponent initialization';
        this.getCommonPuzzleImagesList();
        console.log(msg);
    },

    ready: function () {
        var msg = 'MainPageComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('ImageAdded', this.updatePlayersImagesList.bind(this));
        PuzzleGame.EventDispatcher.on('CommonImagesListReceived', this.onCommonImagesListReceived.bind(this));
        PuzzleGame.EventDispatcher.on('PlayerImagesListReceived', this.onPlayerImagesListReceived.bind(this));
        PuzzleGame.EventDispatcher.on('PlayerImageRemoved', this.updatePlayersImagesList.bind(this));
        PuzzleGame.EventDispatcher.on('PlayerSignedIn', this.updatePlayersImagesList.bind(this));
        PuzzleGame.EventDispatcher.on('SignOutButtonClicked', this.onSignOutButtonClicked.bind(this));
        PuzzleGame.EventDispatcher.on('ShowMainPage', this.onShowMainPage.bind(this));
        PuzzleGame.EventDispatcher.on('GameCanceled', this.onShowMainPage.bind(this));

    },

    getCommonPuzzleImagesList: function () {
// send request to server
        PuzzleGame.RequestManager.getCommonPuzzleImages();
    },

    addImage: function () {
        PuzzleGame.EventDispatcher.trigger('AddImageFileButtonClicked');
    },

    onSignOutButtonClicked: function () {
        this.isVisiblePlayerImages(false);
        this.playerPuzzleImages([]);
    },

    removeImage: function (imagePath) {
        PuzzleGame.RequestManager.removePlayerPuzzleImages(imagePath);
    },

    startGame: function (image) {
        this.isVisibleMainPage(false);
        PuzzleGame.EventDispatcher.trigger('ShowGameFieldPage', image);
    },

// Event Handlers
    updatePlayersImagesList: function () {
        PuzzleGame.RequestManager.getPlayerPuzzleImages();
    },

    onShowMainPage: function () {
        this.isVisibleMainPage(true);
    },

    onCommonImagesListReceived: function (data) {
        this.playerPuzzleImages([]);
        this.commonPuzzleImages(data);
    },

    onPlayerImagesListReceived: function (data) {
        this.playerPuzzleImages([]);
        if (!data.Warning) {
            this.playerPuzzleImages(data);
        } else {
            //todo show warning message
        }
        this.isVisiblePlayerImages(true);

    }
};

PuzzleGame.MainPageComponent = MainPageComponent;