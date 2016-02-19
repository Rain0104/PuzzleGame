var navBarButtonContainer = PuzzleGame.FactoryComponent.createComponent({
    container: '.navbar-right',
    template: {
        id: 'buttonsContainerTemplate'
    },
    type: 'NavBarButtonsComponent'

});

var loginFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.popup-container',
    template: {
        id: 'loginFormTemplate'
    },
    type: 'LoginFormComponent',
    viewModelData: {}
});

var SignUpFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.popup-container',
    template: {
        id: 'signUpFormTemplate'
    },
    type: 'SignUpFormComponent'
});

var LeaderBoardComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.popup-container',
    template: {
        id: 'leaderBoardTemplate'
    },
    type: 'LeaderBoardComponent'
});

var imageFileFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.popup-container',
    template: {
        id: 'imageFileFormTemplate'
    },
    type: 'ImageFileFormComponent'
});


var mainPageComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.content',
    template: {
        id: 'mainPageTemplate'
    },
    type: 'MainPageComponent',
    viewModelData: {}
});


var gameFieldComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.content',
    template: {
        id: 'gameFieldTemplate'
    },
    type: 'GameFieldComponent',
    viewModelData: {}
});