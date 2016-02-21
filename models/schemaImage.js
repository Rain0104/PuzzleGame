/**
 * Created by Rain on 1/9/2016.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    type: {type: String, required: true},
    name: {type: String, required: true},
    path_image: {type: String, required: true},
    leader_board: [Schema.Types.Mixed]
});

imageSchema.methods.updateLBoard = function (username, time) {

    for (var i = 0; i < this.leader_board.length; i++) {
        var next = this.leader_board[i];
        if (compareTimes(next.time, time)) {
            this.leader_board.splice(i,0,{time: time, playerName: username});
            this.leader_board.splice(-1,1);
            return this.leader_board;
        }
    }
    return [];

};

var compareTimes = function(old, newOne) {
    return (!old) ||
           (newOne.hours <= old.hours &&
            newOne.minutes <= old.minutes &&
            newOne.seconds < old.seconds);
};
var Image = mongoose.model('Image', imageSchema);

module.exports = Image;