var timetogo = 1800; // 30 minuts
var timelength = document.title.length; // 30:00 in tab

// function for showin time in tab title
function setTimerTitle() {
    if (Number(timetogo) <= 0) {
        location.href = '/logout';
    } else {
        setTimeout(setTimerTitle, 1000);
    }
    var s = timetogo % 60; // seconds
    var h = (timetogo - s) / 60; // minutes
    document.title = document.title.substring(0, timelength) + ' ' + cleardate(h) + ':' + cleardate(s); 
    timetogo--;
}
setTimeout(setTimerTitle, 1000);

var timerSession = {
    time: (new Date()).getTime() + (30 * 60 * 1000), // timestamp when script createed(page opened)
    resetTime: function () { // reset/update current time
        if (localStorage.getItem('open-time') > timerSession.time) { 
            timetogo = localStorage.getItem('time-to-logout') - 1;
        } else {
            timetogo = localStorage.getItem('time-to-logout');
            localStorage.setItem('time-to-logout', localStorage.getItem('time-to-logout') - 1);
        }
    }
};

// create array with timestamps of tabs
if (!localStorage.getItem('open-time-array')) {
    localStorage.setItem('open-time-array', JSON.stringify([])); // make [] in localStorage 
}

// set time when card was opened
localStorage.setItem('open-time', timerSession.time); 
// get array from localstorage
localStorage.setItem('open-time-array', JSON.stringify(JSON.parse(localStorage.getItem('open-time-array')).concat(timerSession.time))); 
// set time to logout
localStorage.setItem('time-to-logout', 1800); 

// function to reset timer session
function resetTimerSession() {
    localStorage.setItem('time-to-logout', 1800);
}

//remove previous(newest) time on tab closed
window.onbeforeunload = function () {
    var timesArray = JSON.parse(localStorage.getItem('open-time-array')); //[1537180540923, 1537180546490]
    var timeIndex = timesArray.indexOf(timerSession.time); //get time index in timeArray
    timesArray.splice(timeIndex, 1); //remove time from closed tab
    localStorage.setItem('open-time-array', JSON.stringify(timesArray)); // update array with times
    localStorage.setItem('open-time', Math.max.apply(Math,timesArray)); // update new timestamp
};

// run function each second
setInterval(function () {
    timerSession.resetTime();
}, 1000);
