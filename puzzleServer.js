/**
 * Created by alyona.bugayeva on 1/9/2016.
 */
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var config = require('./config');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/puzzle');

var bodyParser = require('body-parser');
var upload = multer({dest: '/resources/puzzleImages/'});
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
};

//setup express application
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(allowCrossDomain);

app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/libs', express.static(__dirname + '/public/libs'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/commonPuzzleImages', express.static(__dirname + '/resources/commonPuzzleImages'));
app.use('/images', express.static(__dirname + '/resources/images'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var User = require('./models/schemaUser');
var Image = require('./models/schemaImage');


//var newImage = Image({
//    type: 'common',
//    name: '3c6cf4f98699ccbd8d917231e47584e5',
//    path_image: './commonPuzzleImages/3c6cf4f98699ccbd8d917231e47584e5.jpg',
//    leader_board: [
//       {playerName: 'null', time: null},
//       {playerName: 'null', time: null},
//       {playerName: 'null', time: null}
//    ]
//});
//
//newImage.save(function (err) {
//    if (err) throw err;
//    console.log('Image created!');
//    //res.statusCode = 200;
//    //res.send({success: 'New Image added!'});
//});

app.get('/api/commonImages', function (reg, res) {
    Image.find({type: 'common'}, function (err, image) {
        if (err) throw err;
        res.send(image);
    });
});

app.post('/api/signIn', function (req, res) {

    var userName = req.body.username;
    var userPass = req.body.password;

    User.findOne({username: userName}, function (err, user) {
        if (err) throw err;
        var isPlayerPass = user.checkPassword(userPass);

        if (isPlayerPass) {
            console.log('Player is successfully logged in');
            res.send({Success: 'Player is successfully logged in'});
        } else {
            console.log('Wrong password or username!');
            res.send({Error: 'Wrong password or username!'});
        }
    })
});

app.post('/api/signUp', function (req, res) {

    var userName = req.body.username;
    var userPass = req.body.password;

    User.find({username: userName}, function (err, user) {
        if (err) throw err;
        if (user.length === 0) {
            var newUser = User({
                username: userName,
                password: userPass
            });

            newUser.save(function (err) {
                if (err) throw err;
                console.log('User is created!', userName);
                res.send({Success: 'New player is created!'});
            });
        } else {
            res.send({Error: 'Please use other username'});
        }
    });
});

app.get('/api/getPlayerImages/:player', function (req, res) {
    var player = req.params.player;
    console.log ('get images', player);
    Image.find({type: player + 'Image'}, function (err, image) {
        if (err) throw err;

        if (image.length === 0) {
            console.log('no find', image);
            res.send({Warning: 'Player has not images'});

        } else {
            console.log('Players images!', image);
            res.send(image);
        }
    });
});


app.post('/api/removeImage', function (req, res) {
    var imagePath = req.body.imagePath;
    console.log(imagePath);

    Image.remove({path_image: imagePath}, function (err) {
        if (err) throw err;
            res.send({Success: 'Image is removed'});
    });
});

app.post('/api/addImage', upload.single('file'), function (req, res) {
    console.log('image!!!', req.file);
    console.log(req.body.username);
    var player = req.body.username;
    fs.readFile(req.file.path, function (err, data) {
        var imageName = req.file.originalname;
        if (!imageName) {
            res.end();
        } else {
            var newPath = __dirname + "/resources/images/" + imageName;
            fs.writeFile(newPath, data, function (err) {
                if (err) {
                    res.send({Error: 'oops'});
                }

                var newImage = Image({
                    type: player + 'Image',
                    name: imageName,
                    path_image: './images/' + imageName,
                    leader_board: [
                        {playerName: 'null', time: null},
                        {playerName: 'null', time: null},
                        {playerName: 'null', time: null}
                    ]
                });

                newImage.save(function (err) {
                    if (err) throw err;
                    console.log({Success: 'Image created!'});
                });
                res.send({Success: 'Image is added'});
            });
        }
    });
});


var server = app.listen(config.server.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});