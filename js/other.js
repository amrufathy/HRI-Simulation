function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    var allText = '';
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                allText = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return allText;
}

function robotSay(msg) {
    document.getElementById("robot_question").innerText = msg;
    const utt = new SpeechSynthesisUtterance(msg);
    speechSynthesis.speak(utt);
}


function request(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    xhttp.send();
}

let questions;
let qIdx = 0;

// read questions from file on document ready
(function() {
    questions = readTextFile('./assets/questions.txt').split('\n');
})();

// start the interview with the first question
let startInterview = document.getElementById('startInterview');
startInterview.addEventListener('click', function () {
    robotSay(questions[qIdx]);
    startInterview.style.visibility = 'hidden';
    request('http://localhost:5000/LWave');
});

// proceed through questions when user finishes recording previous answer
let btnStop = document.getElementById('btnStop');
btnStop.addEventListener('click', function (ev) {
    if (qIdx < questions.length - 1) qIdx++;
    setTimeout(function() { robotSay(questions[qIdx]); }, 1000);
});