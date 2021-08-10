if ("webkitSpeechRecognition" in window) {
    document.getElementById("stopListen").style.display = 'none';

    let final_transcript = "";

    let speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = true;
    speechRecognition.interimResults = true;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = () => {
        document.getElementById("startListen").style.visibility = 'hidden';
        document.getElementById("stopListen").style.display = 'block';
    };
    speechRecognition.onend = () => {
        document.getElementById("startListen").style.visibility = 'visible';
        document.getElementById("stopListen").style.display = 'none';
        document.getElementById("textInput").value = "processing final output...";
        console.log(final_transcript);
        document.getElementById("textInput").value = final_transcript;
    };
    speechRecognition.onError = () => {
        console.error("Error occurred while recognizing the speech. Please try again.")
    };

    speechRecognition.onresult = (event) => {
        let interim_transcript = "";
        // Create the interim transcript string locally because we don't want it to persist like final transcript
        // Loop through the results from the speech recognition object.
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            // If the result item is Final, add it to Final Transcript, Else add it to Interim transcript
            if (event.results[i].isFinal) {
                final_transcript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        // Set the Final transcript and Interim transcript.
        document.getElementById("textInput").value = final_transcript;
    };

    document.getElementById("btnradio4").onclick = () => {
        speechRecognition.start();
    };
    document.querySelector("#btnradio5").onclick = () => {
        speechRecognition.stop();
    };
} else {
    console.log("Speech Recognition Not Available")
}