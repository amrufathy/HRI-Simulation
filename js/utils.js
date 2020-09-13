function readTextFile(file) {
    $.get(file, function (data) {
        questions = data.split('\n');
        console.log(questions);
    }, 'text');
}


function robotSay(msg) {
    $('#robot_question').html(msg);
    const utt = new SpeechSynthesisUtterance(msg);
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);
}


function request(url) {
    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);
    xhttp.send();
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