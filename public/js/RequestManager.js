/**
 * Created by alyona.bugayeva on 12/17/2015.
 */

PuzzleGame.RequestManager = (function () {

    var serverBaseUrl = PuzzleGame.Config.serverBaseUrl;

    function RequestManager() {
        this.playerName = ko.observable(null);
    }

    RequestManager.prototype = {

        signUp: function (username, userPassword) {
            var body = {
                username: username,
                password: userPassword
            };
            var url = serverBaseUrl + "signUp";
            $.ajax({
                type: 'POST',
                url: url,
                data: body,
                success: function (data) {
                    //this.playerName(username);
                    PuzzleGame.EventDispatcher.trigger('PlayerSignedUp');
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    PuzzleGame.EventDispatcher.trigger('PlayerNoSignedUp');
                }
            })
        },

        signIn: function (username, userPassword) {
            var body = {
                username: username,
                password: userPassword
            };
            var url = serverBaseUrl + "signIn";
            $.ajax({
                type: 'POST',
                url: url,
                data: body,
                success: function (data) {
                    this.playerName(username);
                    PuzzleGame.EventDispatcher.trigger('PlayerSignedIn');
                }.bind(this),
                error: function (error) {
                    console.log(error);
                    //PuzzleGame.EventDispatcher.trigger('PlayerNoSignedIn');
                }
            })
        },

        signOut: function (playerName) {
            var player = {
                playerName: playerName
            };
            var url = serverBaseUrl + "signOut";
            $.ajax({
                type: 'POST',
                url: url,
                data: player,
                success: function (data) {
                    debugger;
                    PuzzleGame.EventDispatcher.trigger('PlayerSignedOut');

                }.bind(this),
                error: function (error) {
                    debugger;
                    console.log(error);
                }
            })
        },

        uploadImage: function (imageFile) {
            var formData = new FormData();
            formData.append("username", "1");
            formData.append("file", imageFile);

            var url = serverBaseUrl + "addImage";
            $.ajax({
                type: 'POST',
                url: url,
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    //debugger;
                    console.log('image added');
                    PuzzleGame.EventDispatcher.trigger('ImageAdded');
                    //this.getPlayerImageList(playerName);
                }.bind(this),
                error: function (error) {
                    debugger;
                    console.log(error);
                }
            })
        },

        removePlayerPuzzleImages: function (imagePath){
            var url = serverBaseUrl + "removeImage";
            var body = {
                imagePath: imagePath
            };
            $.ajax({
                type: 'POST',
                url: url,
                data: body,
                success: function (data) {
                    //var commonImagesList = data;
                    PuzzleGame.EventDispatcher.trigger('PlayerImageRemoved');
                }.bind(this),
                error: function (error) {
                    console.log(error);
                }
            });
        },

        getCommonPuzzleImages: function () {
            var url = serverBaseUrl + "commonImages";
            var commonImagesList = [];
            $.ajax({
                type: 'GET',
                url: url,
                success: function (data) {
                    commonImagesList = data;
                    PuzzleGame.EventDispatcher.trigger('CommonImagesListReceived', commonImagesList);

                }.bind(this),
                error: function (error) {
                    console.log(error);
                }
            });
        },

        getPlayerPuzzleImages: function () {
            var playerName = this.playerName();
            var playerImagesList = [];
            var url = serverBaseUrl + "getPlayerImages/" + playerName;
            $.ajax({
                type: 'GET',
                url: url,
                success: function (data) {
                   playerImagesList = data;
                    PuzzleGame.EventDispatcher.trigger('PlayerImagesListReceived', playerImagesList);
                }.bind(this),
                error: function (error) {
                    console.log(error);
                }
            });
        }

    };
    return new RequestManager();
})();