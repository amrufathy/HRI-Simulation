let questions;
let qIdx = 0;

//---------------------------------------------------------------------------------- Start Interview popup

$(document).ready(function () {
  readTextFile('./assets/questions.txt');

  setTimeout(function () { unfade($('#cookie-banner')[0]); }, 1000);
});

$('#cookie-banner-close').click(function () {
  fade($('#cookie-banner')[0]);
  unfade($('#main')[0]);

  // start the interview with the first question
  setTimeout(function () { robotSay(questions[qIdx]); }, 100);
  request('http://localhost:5000/LWave');
});

//---------------------------------------------------------------------------------- Question Speech2Text

$('#commandSayBtn').click(function () {
  var msg = $('#fname').val();
  if (msg == "") {
    msg = 'Please enter some text';
  }
  // Add robot questions here
  $('#robot_question').html(msg);
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
});

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
  } else {   // Old version
    audio.src = window.URL.createObjectURL(mediaStreamObj);
  }

  // 2nd audio tag for play the audio
  let playAudio = document.getElementById('adioPlay');

  // This is the main thing to record the audio 'MediaRecorder' API
  let mediaRecorder = new MediaRecorder(mediaStreamObj);
  // Pass the audio stream

  // start record event
  $('#btnStart').click(function () {
    $('#btnStart').html("Recording...");
    $('#btnStop').prop('disabled', false);
    mediaRecorder.start();
    recognition.start();
  });

  // stop record event
  $('#btnStop').click(function () {
    mediaRecorder.stop();
    $('#btnStart').html("Start Recording");
    $('#btnStop').prop('disabled', true);

    // proceed through questions when user finishes recording previous answer
    if (qIdx < questions.length - 1) qIdx++;
    setTimeout(function () { robotSay(questions[qIdx]); }, 1000);
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

    // After fill up the chunk array make it empty
    dataArray = [];

    // to download audio file when done
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    // Creating audio url with reference
    // of created blob named 'audioData'
    let audioSrc = window.URL.createObjectURL(audioData);
    a.href = audioSrc;
    a.download = 'answerToQuestion'.concat(qIdx.toString(), '.mp3');
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

// Define some event handlers listening to changes in the API
recognition.onstart = function () {
  $('#instructions').html('Voice recognition activated.<br/>Try speaking into the microphone.');
}

recognition.onspeechend = function () {
  $('#instructions').html('Voice recognition turned off.');
}

recognition.onerror = function (event) {
  if (event.error == 'no-speech') {
    $('#instructions').html('No speech was detected. Try again.');
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
  noteTextarea.innerText = transcript;
  interview_logging['questions'].push({
    "Pepper_Question": document.getElementById('robot_question').innerText,
    "User_Answer": document.getElementById('noteTextarea').innerText,
    "Emotion": "API RESPONSE"
  });
  // console.log(interview_logging);
  // Check if interview questions are over, then stringify and print the logged data
  if (questions.length == qIdx) {
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
