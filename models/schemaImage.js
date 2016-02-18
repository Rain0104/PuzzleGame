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

var Image = mongoose.model('Image', imageSchema);

module.exports = Image;