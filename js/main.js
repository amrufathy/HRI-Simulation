button.onclick = () => {
    console.log('start script');
    // button.disabled = true;
    var msg = document.getElementById('fname').value;
    if (msg == "") {
         msg = 'Please enter some text';
    }
    document.getElementById("robot_question").innerText = msg;
    const utt = new SpeechSynthesisUtterance(msg);
    // Prevent garbage collection of utt object
    console.log(utt);

    utt.addEventListener('end', () => {
        console.log('end event triggered');
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

        let audioIN = { audio: true };
        //  audio is true, for recording

        // Access the permission for use
        // the microphone
        navigator.mediaDevices.getUserMedia(audioIN)

      // 'then()' method returns a Promise
      .then(function (mediaStreamObj) {

        // Connect the media stream to the
        // first audio element
        let audio = document.querySelector('audio');
        //returns the recorded audio via 'audio' tag

        // 'srcObject' is a property which
        // takes the media object
        // This is supported in the newer browsers
        if ("srcObject" in audio) {
          audio.srcObject = mediaStreamObj;
        }
        else {   // Old version
          audio.src = window.URL.createObjectURL(mediaStreamObj);
        }

        // It will play the audio
        audio.onloadedmetadata = function (ev) {
          // Play the audio in the 2nd audio
          // element what is being recorded
          // audio.play();
        };

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
        })

        // Stop event
        stop.addEventListener('click', function (ev) {
          mediaRecorder.stop();
          document.getElementById('btnStart').innerText = "Start Recording";
          document.getElementById('btnStop').disabled = true;
          // console.log(mediaRecorder.state);
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
          let audioData = new Blob(dataArray, {'type': 'audio/mp3;'});

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
          a.download = 'audiofile.mp3';
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

        // Check  speech-to-text API supported or not?
        try {
            var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            var recognition = new SpeechRecognition();
        } catch(e) {
            alert('Speech Recongition is not supported on this browser');
        }

        let instructions = document.getElementById('instructions');
        let noteContent = document.getElementById('noteContent')

        // Define some event handlers listening to changes in the API
        recognition.onstart = function() {
            instructions.innerHTML = 'Voice recognition activated.<br/>Try speaking into the microphone.';
        }

        recognition.onspeechend = function() {
            // instructions.innerText = 'You were quiet for a while so Voice recognition turned itself off.';
            instructions.innerText = 'Voice recognition turned off.';
        }

        recognition.onerror = function(event) {
            if(event.error == 'no-speech') {
                instructions.innerText = 'No speech was detected. Try again.';
            };
        }

        recognition.onresult = function(event) {
            // event is a SpeechRecognitionEvent object.
            // It holds all the lines we have captured so far.
            // We only need the current one.
            var current = event.resultIndex;

            // Get a transcript of what was said.
            var transcript = event.results[current][0].transcript;

            // Add the current transcript to the contents of our Note.
            // noteContent += transcript;
            noteTextarea.innerText = transcript;
        }

        navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
          const video = document.getElementById('video-cam');
          video.srcObject = mediaStream;
          video.onloadedmetadata = (e) => {
            video.play();
          };
        }).catch(err => {
          console.log('Video is not working');
        });
