let waveIdx = 0;

function readTextFile(file) {
    $.get(file, function (data) {
        questions = data.split('\n');
    }, 'text');
}


function robotSay(msg, wave, cb) {
    $('#robot_question').html(msg);
    const utt = new SpeechSynthesisUtterance(msg);
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);

    if (wave === true) {
        robotWave();
    } else if (wave === false) {
        robotAsk();
    } else {
        $.get({
            url: `http://localhost:5000/LRAsk`
        });
    }

    utt.onend = function () {
        if (cb !== undefined) cb();
    }
}

function robotWave() {
    waveIdx++;
    endpoint = (waveIdx % 2 == 0) ? 'LWave' : 'RWave';

    $.get({
        url: `http://localhost:5000/${endpoint}`
    });
}

function robotAsk() {
    waveIdx++;
    endpoint = (waveIdx % 2 == 0) ? 'LAsk' : 'RAsk';

    $.get({
        url: `http://localhost:5000/${endpoint}`
    });
}


function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1) {
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = `alpha(opacity=${op * 100})`;
        op -= op * 0.1;
    }, 50);
}


function unfade(element) {
    var op = 0.1;  // initial opacity
    element.style.display = 'block';
    var timer = setInterval(function () {
        if (op >= 1) {
            clearInterval(timer);
        }
        element.style.opacity = op;
        element.style.filter = `alpha(opacity=${op * 100})`;
        op += op * 0.1;
    }, 10);
}


function saveTextAsFile(textToWrite) {
    var textFileAsBlob = new Blob([textToWrite], { type: 'text/plain' });
    var fileNameToSaveAs = "interview_log_file.txt";
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    let textSrc = window.URL.createObjectURL(textFileAsBlob);
    a.href = textSrc;
    a.download = fileNameToSaveAs;
    a.click();
    window.URL.revokeObjectURL(textFileAsBlob);
}

Array.prototype.sample = function () {
    return this[(Math.random() * this.length) | 0];
}
