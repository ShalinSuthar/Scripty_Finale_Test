// var speech = true;
//         window.SpeechRecognition = window.SpeechRecognition
//                         || window.webkitSpeechRecognition;

//         const recognition = new SpeechRecognition();
//         recognition.interimResults = true;

//         recognition.addEventListener('result', e => {
//             const transcript = Array.from(e.results)
//                 .map(result => result[0])
//                 .map(result => result.transcript)
//                 .join('')

//             document.getElementById("textInput").value = transcript;
//             console.log(transcript);
//         });

//         if (speech == true) {
//             recognition.start();
//             recognition.addEventListener('end', recognition.start);
//         }

if ("webkitSpeechRecognition" in window) {
    document.getElementById("stopListen").style.display = 'none';

    let final_transcript = "";
    let interim_transcript = "";

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
    };
    speechRecognition.onError = () => {
        console.error("Error occurred while recognizing the speech. Please try again.")
    };

    speechRecognition.onresult = (event) => {
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
        document.getElementById("textInput").innerText = final_transcript;
    }

    document.getElementById("btnradio4").onclick = () => {
        speechRecognition.start();
    };
    document.querySelector("#btnradio5").onclick = () => {
        speechRecognition.stop();
        document.getElementById("textInput").innerText = final_transcript;
    };
} else {
    console.log("Speech Recognition Not Available")
}