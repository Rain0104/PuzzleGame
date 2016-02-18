/**
 * Created by alyona.bugayeva on 12/15/2015.
 */
function ImageFileFormComponent() {

    this.isVisibleImageFileForm = ko.observable(false);
    this.imageFile = ko.observable();

    this.bindEvents();
}

ImageFileFormComponent.prototype = {

    init: function () {
        var msg = 'ImageFileFormComponent initialization';
        console.log(msg);
    },

    ready: function () {
        var msg = 'ImageFileFormComponent ready';
        console.log(msg);
    },

    bindEvents: function () {
        PuzzleGame.EventDispatcher.on('AddImageFileButtonClicked', this.onAddImageFileButtonClicked.bind(this));
        PuzzleGame.EventDispatcher.on('ImageAdded', this.onImageAdded.bind(this));
        //PuzzleGame.EventDispatcher.on('ImageClicked', this.onAddImageFileButtonClicked.bind(this));
    },

    uploadImage: function (imageFile) {
        this.imageFile(imageFile);
        PuzzleGame.RequestManager.uploadImage(imageFile);
    },

    //closeImageForm: function (){
    //    this.isVisibleImageFileForm(false);
    //
    //},
// Event Handlers

    onCancelClicked: function () {
        this.isVisibleImageFileForm(false);
    },

    onImageAdded: function (){
        //this.closeImageForm.bind(this);
        this.isVisibleImageFileForm(false);

    },

    onAddImageFileButtonClicked: function () {
        this.isVisibleImageFileForm(true);
    }
};

PuzzleGame.ImageFileFormComponent = ImageFileFormComponent;