let questionss = ['What\'s your name', 'How are you'];
let questions_Idx = 0;

// let questionss = ['What\'s your name', 'How are you'];
// let questions_Idx = 0;

function fade(element) {
  var op = 1;  // initial opacity
  var timer = setInterval(function () {
    if (op <= 0.1){
          clearInterval(timer);
          element.style.display = 'none';
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op -= op * 0.1;
    }, 50);
  }

function unfade(element) {
  var op = 0.1;  // initial opacity
  element.style.display = 'block';
  var timer = setInterval(function () {
      if (op >= 1){
        clearInterval(timer);
      }
      element.style.opacity = op;
      element.style.filter = 'alpha(opacity=' + op * 100 + ")";
      op += op * 0.1;
    }, 10);
  }

  //---------------------------------------------------------------------------------- Start Interview popup

window.onload = () => {
  var cookie_banner = document.getElementById('cookie-banner');
  setTimeout(function(){unfade(cookie_banner); }, 1000);
};

cookie_banner_close.onclick = () => {
  fade(document.getElementById('cookie-banner'));
  unfade(document.getElementById('main'));
};

//---------------------------------------------------------------------------------- Question Speech2Text

button.onclick = () => {
  // console.log('start script');
  // button.disabled = true;
  var msg = document.getElementById('fname').value;
  if (msg == "") {
    msg = 'Please enter some text';
  }
  // Add robot questions here
  document.getElementById("robot_question").innerText = msg;
  const utt = new SpeechSynthesisUtterance(msg);
  // Prevent garbage collection of utt object
  console.log(utt);

  utt.addEventListener('end', () => {
    // console.log('end event triggered');
  });

  // just for debugging completeness, no errors seem to be thrown though
  utt.addEventListener('error', (err) => {
    console.log('err', err)
  });

  speechSynthesis.speak(utt);
  // setTimeout(() => {
  //     console.log('finished?');
  // }, 100);
};

//---------------------------------------------------------------------------------- Audio Recording & Downloading

let audioIN = { audio: true };
//  audio is true, for recording

// Access the permission for use the microphone
// 'then()' method returns a Promise
navigator.mediaDevices.getUserMedia(audioIN).then(function (mediaStreamObj) {

    // Connect the media stream to the first audio element
    //returns the recorded audio via 'audio' tag
    let audio = document.querySelector('audio');

    // 'srcObject' is a property which takes the media object. This is supported in the newer browsers
    if ("srcObject" in audio) {
      audio.srcObject = mediaStreamObj;
    }
    else {   // Old version
      audio.src = window.URL.createObjectURL(mediaStreamObj);
    }

    // It will play the audio
    // audio.onloadedmetadata = function (ev) {
      // Play the audio in the 2nd audio
      // element what is being recorded
      // audio.play();
    // };

    // Start record
    let start = document.getElementById('btnStart');

    // Stop record
    let stop = document.getElementById('btnStop');

    // 2nd audio tag for play the audio
    let playAudio = document.getElementById('adioPlay');

    // This is the main thing to recorde
    // the audio 'MediaRecorder' API
    let mediaRecorder = new MediaRecorder(mediaStreamObj);
    // Pass the audio stream

    // Start event
    start.addEventListener('click', function (ev) {
      document.getElementById('btnStart').innerText = "Recording...";
      document.getElementById('btnStop').disabled = false;
      mediaRecorder.start();
      recognition.start();
      // console.log(mediaRecorder.state);
    });

    // Stop event
    stop.addEventListener('click', function (ev) {
      mediaRecorder.stop();
      document.getElementById('btnStart').innerText = "Start Recording";
      document.getElementById('btnStop').disabled = true;
      questions_Idx += 1;
    });

    // If audio data available then push
    // it to the chunk array
    mediaRecorder.ondataavailable = function (ev) {
      dataArray.push(ev.data);
    }

    // Chunk array to store the audio data
    let dataArray = [];

    // Convert the audio data in to blob
    // after stopping the recording
    mediaRecorder.onstop = function (ev) {

      // blob of type mp3
      let audioData = new Blob(dataArray, { 'type': 'audio/mp3;' });

      // After fill up the chunk
      // array make it empty
      dataArray = [];

      // to download audio file when done
      var a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";

      // Creating audio url with reference
      // of created blob named 'audioData'
      let audioSrc = window.URL.createObjectURL(audioData);
      a.href = audioSrc;
      a.download = 'answerToQuestion'.concat(questions_Idx.toString(), '.mp3');
      a.click();
      window.URL.revokeObjectURL(audioSrc);
      // console.log(audioSrc)

      // Pass the audio url to the 2nd video tag
      playAudio.src = audioSrc;
    }
  })

  // If any error occurs then handles the error
  .catch(function (err) {
    console.log(err.name, err.message);
  });

//---------------------------------------------------------------------------------- Audio Recognition & Text2Speech
// Logs the question, user's answer, and the API response

// Check  speech-to-text API supported or not?
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
} catch (e) {
  alert('Speech Recongition is not supported on this browser');
}

let instructions = document.getElementById('instructions');
let noteContent = document.getElementById('noteContent')

// Define some event handlers listening to changes in the API
recognition.onstart = function () {
  instructions.innerHTML = 'Voice recognition activated.<br/>Try speaking into the microphone.';
}

recognition.onspeechend = function () {
  // instructions.innerText = 'You were quiet for a while so Voice recognition turned itself off.';
  instructions.innerText = 'Voice recognition turned off.';
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    instructions.innerText = 'No speech was detected. Try again.';
  };
}

recognition.onresult = function (event) {
  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far.
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // noteContent += transcript;
  noteTextarea.innerText = transcript;
  interview_logging['questions'].push({
    "Pepper_Question": document.getElementById('robot_question').innerText,
    "User_Answer": document.getElementById('noteTextarea').innerText,
    "Emotion": "API RESPONSE"
  });
  // console.log(interview_logging);
  // Check if interview questions are over, then stringify and print the logged data
  if (questionss.length == questions_Idx) {
    var logging_string = ''
    var logged_questions = interview_logging['questions'];
    for (var key = 0; key < logged_questions.length; key++) {
      logging_string = logging_string.concat("Question #", (key + 1).toString(), ":", logged_questions[key]["Pepper_Question"], '\n',
                                             "Answer:", logged_questions[key]["User_Answer"], '\n',
                                             "User Emotion:", logged_questions[key]["Emotion"], '.',
                                             '\n');
    }
    saveTextAsFile(logging_string);
    // Show the "End Interview" popup and hide the rest
    fade(document.getElementById('main'));
    unfade(document.getElementById('ending-banner'));
  }

}

//---------------------------------------------------------------------------------- Video preview

navigator.mediaDevices.getUserMedia({ video: true }).then(mediaStream => {
  const video = document.getElementById('video-cam');
  video.srcObject = mediaStream;
  video.onloadedmetadata = (e) => {
    video.play();
  };
}).catch(err => {
  console.log('Video is not working');
});

//---------------------------------------------------------------------------------- Log the interview

var interview_logging = {
  "questions": []
};

function saveTextAsFile(textToWrite) {
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
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