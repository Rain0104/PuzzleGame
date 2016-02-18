/**
 * Created by alyona.bugayeva on 15/12/2015.
 */
function LoginFormComponent() {

    this.isVisibleLoginForm = ko.observable(false);
    this.userName = ko.observable('');
    this.userPassword = ko.observable('');

    this.bindEvents();
}

LoginFormComponent.prototype = {

    init: function () {
        var msg = 'LoginFormComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'LoginFormComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('SignInButtonClicked', this.onLoginToClicked.bind(this));
        PuzzleGame.EventDispatcher.on('PlayerSignedIn', this.onPlayerSignedIn.bind(this));
    },

    submitLoginForm: function () {
        var user = this.userName();
        var password = this.userPassword();
        PuzzleGame.RequestManager.signIn(user, password);
    },

// Event Handlers

    onCancelClicked: function () {
        this.isVisibleLoginForm(false);
    },

    onLoginToClicked: function () {
        this.isVisibleLoginForm(true);
    },

    onPlayerSignedIn: function () {
        this.isVisibleLoginForm(false);
    }
};

PuzzleGame.LoginFormComponent = LoginFormComponent;