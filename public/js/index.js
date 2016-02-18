var navBarButtonContainer = PuzzleGame.FactoryComponent.createComponent({
    container: '.navbar-right',
    template: {
        id: 'buttonsContainerTemplate'
    },
    type: 'NavBarButtonsComponent'

});

var loginFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.login-container',
    template: {
        id: 'loginFormTemplate'
    },
    type: 'LoginFormComponent',
    viewModelData: {}
});

var SignUpFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.login-container',
    template: {
        id: 'signUpFormTemplate'
    },
    type: 'SignUpFormComponent'
});

var imageFileFormComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.login-container',
    template: {
        id: 'imageFileFormTemplate'
    },
    type: 'ImageFileFormComponent'
});


var mainPageComponent = PuzzleGame.FactoryComponent.createComponent({
    container: '.login-container',
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