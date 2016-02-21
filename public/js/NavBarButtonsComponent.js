/**
 * Created by Rain on 12/10/2015.
 */
function NavBarButtonsComponent() {

    this.isVisibleControls = ko.observable(true);
    this.isVisibleLoginButton = ko.observable(true);
    this.isVisibleLogOut = ko.observable(false);

    this.bindEvents();
}

NavBarButtonsComponent.prototype = {

    init: function () {
        var msg = 'NavBarButtonsComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'NavBarButtonsComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('PlayerSignedIn', this.onPlayerSignedIn.bind(this));
        PuzzleGame.EventDispatcher.on('PlayerSignedIOut', this.onPlayerSignedOut.bind(this));
        PuzzleGame.EventDispatcher.on('StartGame', this.onStartGame.bind(this));
        PuzzleGame.EventDispatcher.on('onFinishGame', this.onFinishGame.bind(this));
    },

    onStartGame: function () {
        this.isVisibleControls(false);
    },

    onFinishGame: function () {
        this.isVisibleControls(true);
    },

    onPlayerSignedIn: function () {
        this.isVisibleLoginButton(false);
        this.isVisibleLogOut(true);
    },

    onPlayerSignedOut: function () {
        this.isVisibleLoginButton(true);
        this.isVisibleLogOut(false);
    },

    onSignInClicked: function () {
        PuzzleGame.EventDispatcher.trigger('SignInButtonClicked');
    },

    onSignUpClicked: function () {
        PuzzleGame.EventDispatcher.trigger('SignUpButtonClicked');
    },

    onLogoutClicked: function () {
        var msg = 'Clicked Sign out button';
        console.log(msg);
        PuzzleGame.EventDispatcher.trigger('SignOutButtonClicked');
        this.isVisibleLogOut(false);
        this.isVisibleLoginButton(true);
    }

};

PuzzleGame.NavBarButtonsComponent = NavBarButtonsComponent;