/**
 * Created by alyona.bugayeva on 19-Jan-16.
 */
function SignUpFormComponent() {

    this.isVisibleSignUpForm = ko.observable(false);
    this.userName = ko.observable('');
    this.userPassword = ko.observable('');

    this.bindEvents();
}

SignUpFormComponent.prototype = {

    init: function () {
        var msg = 'SignUpFormComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'SignUpFormComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('SignUpButtonClicked', this.onSignUpClicked.bind(this));
        //PuzzleGame.EventDispatcher.on('PlayerLoggedIn', this.onLoginToClicked.bind(this));
    },

    submitSignUpForm: function () {
        var user = this.userName();
        var password = this.userPassword();
        PuzzleGame.RequestManager.signUp(user, password);
    },

// Event Handlers

    onCancelClicked: function () {
        //var msg = '[operator action] Login form TS clicked Cancel button';
        //TestPortal.Logger.logOperatorActions(msg);
        this.isVisibleSignUpForm(false);
    },

    onSignUpClicked: function () {
        this.isVisibleSignUpForm(true);
        console.log('ok');
    },

    onSuccessfulSignUp: function () {
        this.isVisibleLoginForm(false);
    }
};

PuzzleGame.SignUpFormComponent = SignUpFormComponent;