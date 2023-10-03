var recorder = null
var isAudioEnabled = true;
var isVideoEnabled = true;
var isPaused = false;
function onApproved(stream) {
    recorder = new MediaRecorder(stream)

    recorder.start();

    recorder.onstop = function () {
        stream.getTracks().forEach(function (track) {
            if (track.readyState === "live") {
                track.stop()
            }
        })
    }

    recorder.ondataavailable = function (event) {
        let recordedBlob = event.data;
        let url = URL.createObjectURL(recordedBlob);

        let a = document.createElement("a");

        a.style.display = "none";
        a.href = url;
        a.download = "screen-record.webm";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        // create a function that converts the video from webm to mp4, then send to an api
        // const reader = new FileReader();
        // reader.readAsDataURL(recordedBlob);
        // reader.onloadend = function () {
        //     const base64data = reader.result;
        //     console.log(base64data);
        //     fetch("https://hng-task-two.afundcap.com/public/api/save_video", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify({
        //             video: base64data
        //         })
        //     }).then((res) => {
        //         console.log(res);
        //     }).catch((err) => {
        //         console.log(err);
        //     })
        // }

        // const formData = new FormData();
        // formData.append("video", recordedBlob);
        // fetch("http://localhost:5000/api/upload", {
        //     method: "POST",
        //     body: formData
        // }).then((res) => {
        //     console.log(res);
        // }).catch((err) => {
        //     console.log(err);
        // })

        // fetch("http://localhost:5000/api/upload", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({
        //         video: recordedBlob
        //     })
        // }).then((res) => {
        //     console.log(res);
        // }).catch((err) => {
        //     console.log(err);
        // })
    }
}

function addMediaControls(stream) {
    
    const controlsContainer = document.createElement("div");
    controlsContainer.style.width = "35rem";
    controlsContainer.style.height = "5rem";
    controlsContainer.style.position = "absolute";
    controlsContainer.style.top = "75%";
    controlsContainer.style.bottom = "0";
    controlsContainer.style.left = "10px";
    controlsContainer.style.zIndex = "9999";
    controlsContainer.style.display = "flex";
    controlsContainer.style.justifyContent = "center";
    controlsContainer.style.alignItems = "center";
    controlsContainer.style.gap = "0.5rem";
    controlsContainer.style.backgroundColor = "#141414";
    controlsContainer.style.borderRadius = "12.5rem"

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.alignItems = "flex-start";
    controls.style.justifyContent = "center"
    controls.style.gap = "1.5rem";

    // start audio toggle
    const audioWrapper = document.createElement("div");
    audioWrapper.style.display = "flex";
    audioWrapper.style.flexDirection = "column";
    audioWrapper.style.alignItems = "center";
    audioWrapper.style.justifyContent = "center";
    audioWrapper.style.gap = "0.25rem";
    audioWrapper.style.cursor = "pointer";

    const audioText = document.createElement("span");
    audioText.textContent = "Mic";
    audioText.style.color = "#fff";
    audioText.style.fontSize = "0.75rem";


    const audioIcon = document.createElement("img");
    audioIcon.src = isAudioEnabled ? chrome.runtime.getURL("/images/mic.svg") : chrome.runtime.getURL("/images/mic-off.svg");
    audioIcon.style.width = "2.25rem";
    audioIcon.style.height = "2.25rem";

    audioIcon.addEventListener("click", toggleAudio);
    audioWrapper.appendChild(audioIcon);
    audioWrapper.appendChild(audioText);
    // end audio toggle

    // start camera
    const videoWrapper = document.createElement("div");
    videoWrapper.style.display = "flex";
    videoWrapper.style.flexDirection = "column";
    videoWrapper.style.alignItems = "center";
    videoWrapper.style.justifyContent = "center";
    videoWrapper.style.gap = "0.25rem";
    videoWrapper.style.cursor = "pointer";

    const videoText = document.createElement("span");
    videoText.textContent = "Camera";
    videoText.style.color = "#fff";
    videoText.style.fontSize = "0.75rem";

    const videoIcon = document.createElement("img");
    videoIcon.src = isVideoEnabled ? chrome.runtime.getURL("/images/cam_icon.svg") : chrome.runtime.getURL("/images/cam-cancelled.svg");
    videoIcon.style.width = "2.25rem";
    videoIcon.style.height = "2.25rem";

    videoWrapper.addEventListener("click", toggleVideo);
    videoWrapper.appendChild(videoIcon);
    videoWrapper.appendChild(videoText);
    //end camera

    //start pause
    const pauseWrapper = document.createElement("div");
    pauseWrapper.style.display = "flex";
    pauseWrapper.style.flexDirection = "column";
    pauseWrapper.style.alignItems = "center";
    pauseWrapper.style.justifyContent = "center";
    pauseWrapper.style.gap = "0.25rem";
    pauseWrapper.style.cursor = "pointer";

    const pauseText = document.createElement("span");
    pauseText.textContent = !isPaused ? "Pause" : "Play";
    pauseText.style.color = "#fff";
    pauseText.style.fontSize = "0.75rem";

    const pauseIcon = document.createElement("img");
    pauseIcon.src = !isPaused ? chrome.runtime.getURL("/images/pause.svg") : chrome.runtime.getURL("images/play.svg");
    pauseIcon.style.width = "2.25rem";
    pauseIcon.style.height = "2.25rem";

    pauseWrapper.addEventListener("click", pauseRecording);
    pauseWrapper.appendChild(pauseIcon);
    pauseWrapper.appendChild(pauseText);
    // end pause

    // start stop
    const stopWrapper = document.createElement("div");
    stopWrapper.style.display = 'flex';
    stopWrapper.style.flexDirection = "column";
    stopWrapper.style.alignItems = "center";
    stopWrapper.style.justifyContent = "center";
    stopWrapper.style.gap = "0.25rem";
    stopWrapper.style.cursor = "pointer";

    const stopText = document.createElement("span");
    stopText.textContent = "Stop";
    stopText.style.color = "#fff";
    stopText.style.fontSize = "0.75rem";

    const stopIcon = document.createElement("img");
    stopIcon.src = chrome.runtime.getURL("/images/stop.svg");
    stopIcon.style.width = "2.25rem";
    stopIcon.style.height = "2.25rem";

    stopWrapper.addEventListener("click", stopRecording);
    stopWrapper.appendChild(stopIcon);
    stopWrapper.appendChild(stopText);
    //end stop

    // start delete
    const deleteWrapper = document.createElement("div");
    deleteWrapper.style.display = 'flex';
    deleteWrapper.style.flexDirection = "column";
    deleteWrapper.style.alignItems = "center";
    deleteWrapper.style.justifyContent = "center";
    deleteWrapper.style.gap = "0.25rem";
    deleteWrapper.style.cursor = "pointer";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = chrome.runtime.getURL("/images/dustbin.svg");
    deleteIcon.style.width = "2.25rem";
    deleteIcon.style.height = "2.25rem";

    deleteWrapper.addEventListener("click", deleteRecording);
    deleteWrapper.appendChild(deleteIcon);
    // end delete

    controlsContainer.appendChild(controls);

    controls.appendChild(pauseWrapper);
    controls.appendChild(stopWrapper);
    controls.appendChild(videoWrapper);
    controls.appendChild(audioWrapper);
    controls.appendChild(deleteWrapper);

    document.body.appendChild(controlsContainer);

    function toggleAudio() {
        if (stream) {
            const audioTracks = stream.getAudioTracks();
            audioTracks.forEach((track) => {
                track.enabled = !isAudioEnabled;
            });
            isAudioEnabled = !isAudioEnabled;
        }
    }

    function toggleVideo() {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            videoTracks.forEach((track) => {
                track.enabled = !isVideoEnabled;
            });
            isVideoEnabled = !isVideoEnabled;
        }
    }

    function pauseRecording() {
        if (recorder && recorder.state === "recording") {
            recorder.pause();
            isPaused = !isPaused
        } else if (recorder && recorder.state === "paused") {
            recorder.resume();
            isPaused = !isPaused
        }
    }

    function stopRecording() {
        if (recorder) {
            recorder.stop();
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        }
    }

    function deleteRecording() {
        if (recorder) {
            recorder.stop();
            if (stream) {
                stream.getTracks().forEach((track) => {
                    track.stop();
                });
            }
            recorder = null;
        }
        if (controlsContainer) {
            controlsContainer.remove();
        }
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "get_recording") {
        console.log("requesting_recording");

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999,
                height: 9999999999
            }
        }).then((stream) => {
            onApproved(stream);
            addMediaControls(stream);
        })
    }

    if (message.action === "stop_recording") {
        console.log("stopped recording");
        sendResponse(`processed: ${message.action}`);
        if (!recorder) return console.log("no recorder")

        recorder.stop();
    }
})