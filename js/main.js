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
    setTimeout(() => {
        console.log('finished?');
    }, 100);
};