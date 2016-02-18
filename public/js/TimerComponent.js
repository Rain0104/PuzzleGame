//var startTimer = function () {
//    var minutesLabel = document.getElementById("minutes");
//    var secondsLabel = document.getElementById("seconds");
//    var totalSeconds = 0;
//    setInterval(setTime, 1000);
//
//    function setTime() {
//        ++totalSeconds;
//        secondsLabel.innerHTML = pad(totalSeconds % 60);
//        minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
//    }
//
//    function pad(val) {
//        var valString = val + "";
//        if (valString.length < 2) {
//            return "0" + valString;
//        }
//        else {
//            return valString;
//        }
//    }
//};

PuzzleGame.Timer = (function () {

    function Timer() {
        this.refreshInterval = null;
        this.totalSeconds = null;
        this.seconds = null;
        this.minutes = null;
        this.hours = null;

        this.bindEvents();
    }

    Timer.prototype = {

        bindEvents: function () {
            PuzzleGame.EventDispatcher.on('StartTimer', this.startTimer.bind(this));
        },

        startTimer: function () {
            this.totalSeconds = 0;
            this.seconds = 0;
            this.minutes = 0;
            this.hours = 0;
            this.refreshInterval = setInterval(function () {
                this.setTime()
            }.bind(this), 1000);

        },

        setTime: function () {
            ++this.totalSeconds;
            var minutesLabel = document.getElementById("minutes");
            var secondsLabel = document.getElementById("seconds");
            var hoursLabel = document.getElementById("hours");

            this.seconds = this.pad(this.totalSeconds % 60);
            this.minutes = this.pad(parseInt(this.totalSeconds / 60));
            this.hours = this.pad(parseInt(this.totalSeconds / (60 * 60)));

            secondsLabel.innerHTML = this.seconds;
            minutesLabel.innerHTML = this.minutes;
            hoursLabel.innerHTML = this.hours;
        },

        stopTimer: function () {
            clearInterval(this.refreshInterval);
        },

        pad: function (val) {
            var valString = val + "";
            if (valString.length < 2) {
                return "0" + valString;
            } else {
                return valString;
            }
        },

        getTime: function () {
            var time = {
                seconds: this.seconds,
                minutes: this.minutes,
                hours: this.hours
            };
            return time;
        }
    };
    return new Timer();
})();