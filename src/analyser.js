import { convertFileSrc } from "@tauri-apps/api/core";
import p5 from "p5";

export function setupAudio() {
    let p;
    let audioPlayer;

    const sketch = (instance) => {
        instance.setup = () => {
            instance.noCanvas();
        };

        p = instance;
    };

    function playFile(filename) {
        audioPlayer = p.createAudio(convertFileSrc(filename));
        audioPlayer.loop();
    }

    new p5(sketch);

    return { playFile };
}

export function init() {
    const audioCtx = new AudioContext();
    let source;
    let stream;

    // Set up the different audio nodes we will use for the app
    const analyser = audioCtx.createAnalyser();
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    analyser.smoothingTimeConstant = 0.85;

    // Set up canvas context for visualizer
    const canvas = document.getElementById("visualizer");
    const canvasCtx = canvas.getContext("2d");

    // Adjust canvas size based on container width
    const intendedWidth = document.getElementById("box-two").clientWidth;
    canvas.setAttribute("width", intendedWidth);

    // Main block for doing the audio recording
    const constraints = { audio: true };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
            source = audioCtx.createMediaStreamSource(stream);
            source.connect(analyser);

            visualize(); // Start visualizing audio
        })
        .catch(function (err) {
            console.error("The following gUM error occurred: " + err);
        });

    function visualize() {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        analyser.fftSize = 2048;
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = () => {
            requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = "rgb(200, 200, 200)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0, 0, 0)";

            canvasCtx.beginPath();

            const sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = (v * HEIGHT) / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            canvasCtx.lineTo(WIDTH, HEIGHT / 2);
            canvasCtx.stroke();
        };

        draw();
    }
}
