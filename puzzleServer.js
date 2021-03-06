/**
 * Created by alyona.bugayeva on 1/9/2016.
 */
var express = require('express');
var fs = require('fs');
//var pug = require('pug');
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
app.use('/', express.static(__dirname + '/public'));


//todo save images in public directory

app.use('/commonPuzzleImages', express.static(__dirname + '/resources/commonPuzzleImages'));
app.use('/images', express.static(__dirname + '/resources/images'));

//app.set('view engine', 'pug');

//
//app.get('/pug', function (req, res) {
//    res.render(__dirname + '/public/views/main-layout.pug', {appTitle: 'Puzzle Game', message: 'Hello there!'});
//});
//

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

var User = require('./models/schemaUser');
var Image = require('./models/schemaImage');
var pathForImages = __dirname + '/resources/images/';
var pathForCommonImages = '/resources/commonPuzzleImages/';


Image.find().remove({type: 'common'}).exec();

fs.readdir(__dirname + '/public/' + pathForCommonImages, function (err, files) {
    if (err) throw err;
    var len = files.length;
    for (var i = 0; i < len; i++) {
        var image = files[i];
        var imgName = image.split('.')[0];
        var newImage = Image({
            type: 'common',
            name: imgName,
            path_image: pathForCommonImages + image,
            leader_board: [
                {playerName: 'null', time: null},
                {playerName: 'null', time: null},
                {playerName: 'null', time: null}
            ]
        });

        newImage.save(function (err) {
            if (err) throw err;
        });
    }
});

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


app.post('/api/updateLeaderBoard', function (req, res) {
    var imageName = req.body.imageName;
    var username = req.body.username;
    var time = {
        hours: req.body.hours,
        minutes: req.body.minutes,
        seconds: req.body.seconds
    };
    Image.findOne({name: imageName}, function (err, image) {
        if (err) throw err;
        if (image === undefined) {
            console.log('Image not found', image);
            res.send({Warning: 'Image not found'});

        } else {
            var updatedLBoard = image.updateLBoard(username, time);
            if (updatedLBoard.length !== 0) {
                image.leader_board = updatedLBoard;
                image.save(function (err) {
                });
            }
            res.send({Success: 'LeaderBoard updated'});
        }
    });
});

app.get('/api/getLeaderBoard/:name', function (req, res) {
    var imageName = req.params.name;
    Image.findOne({name: imageName}, function (err, image) {
        if (err) throw err;
        res.send(image.leader_board);
    });
});

app.get('/api/getPlayerImages/:player', function (req, res) {
    var player = req.params.player;
    console.log('get images', player);
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
        var imageName = req.file.originalname + req.file.size;
        if (!imageName) {
            res.end();
        } else {
            var newPath = pathForImages + imageName;
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
                    console.log({Success: 'Image is created!'});
                });
                res.send({Success: 'Image is added'});
            });
        }
    });
});

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not found');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server error');
});


var server = app.listen(config.server.port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});