import { convertFileSrc } from "@tauri-apps/api/core";
import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js";
import "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/addons/p5.sound.min.js";

export function setupAudio() {
    let p;
    let audioPlayer;
    let fft;
    let canvas;
    let ctx;
    let pieces = 12;
    let radiusFactor = 0.2; // Controls how large the visualisation appears

    // Colour scheme
    const bgColor = "#22212C"; // Deep Midnight Purple
    const bassColor = ["#ff4500", "#ffae00"]; // Deep Orange
    const midColor = "#ff1493"; // Neon Pink
    const trembleColor = "#00ffcc"; // Teal Cyan

    const sketch = (instance) => {
        instance.setup = () => {
            canvas = instance.createCanvas(600, 600);
            canvas.parent("vis-div");

            // ctx = canvas.getContext("2d");
            // if (!ctx) {
            //     console.error("Failed to get 2D rendering context");
            //     return;
            // }

            resizeCanvas(); // Set initial size
            fft = new p5.FFT();
            instance.noLoop(); // Prevent automatic animation until audio starts

            // Resize when the window changes
            window.addEventListener("resize", resizeCanvas);
        };

        function resizeCanvas() {
            const container = canvas.parentElement;
            if (!container) return;

            // Set canvas size to fill its container
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            instance.redraw(); // Force a redraw after resizing
        }

        
        instance.draw = () => {
            instance.clear();
            instance.background(bgColor);

            fft.analyze();

            const bass = fft.getEnergy("bass");
            const treble = fft.getEnergy(50, 110);
            const mid = fft.getEnergy("mid");

            // Dynamically scale radius based on canvas size
            const radius = Math.min(instance.width, instance.height) * radiusFactor;
            const centerX = instance.width / 2;
            const centerY = instance.height / 2;

            const mapMid = instance.map(mid, 0, 255, -radius, radius);
            const scaleMid = instance.map(mid, 0, 255, 1, 1.5);
            const mapTreble = instance.map(treble, 0, 255, -radius / 2, radius * 2);
            const scaleTreble = instance.map(treble, 0, 255, 0.5, 2);
            const mapbass = instance.map(bass, 0, 255, 0, radius);
            const scalebass = instance.map(bass, 0, 255, 0, 0.8);

            instance.translate(centerX, centerY);

            for (let i = 0; i < pieces; i++) {
                instance.rotate(instance.TWO_PI / pieces);
                instance.noFill();

                /*----------  BASS  ----------*/
                instance.push();
                instance.strokeWeight(6);
                instance.stroke(bassColor[0]);
                instance.rotate(instance.frameCount * 0.03); // Bass rotation effect
                instance.point(mapbass, radius / 2);
                instance.stroke(bassColor[1]);
                instance.strokeWeight(3);
                instance.ellipse(mapbass, radius / 2, 8, 8); // Bass as a moving dot
                instance.pop();

                /*----------  MID  ----------*/
                instance.push();
                instance.stroke(midColor);
                instance.strokeWeight(4);
                instance.rotate(-instance.frameCount * 0.02); // Mid rotates slower
                instance.ellipse(mapMid, radius, 6, 6);
                instance.pop();

                /*----------  TREBLE  ----------*/
                instance.push();
                instance.stroke(trembleColor);
                instance.strokeWeight(4);
                instance.scale(scaleTreble);
                instance.rotate(instance.frameCount * 0.05); // Treble spins faster
                instance.ellipse(-100, radius / 2, 4, 4);
                instance.ellipse(100, radius / 2, 4, 4);
                instance.pop();
            }
        };

        instance.windowResized = () => {
            instance.resizeCanvas(instance.windowWidth, instance.windowHeight);
        };
    };
    function playFile(filename) {
        console.log("In playFile ");

        if (audioPlayer !== undefined) {
            audioPlayer.stop();
        }

        audioPlayer = new p5.SoundFile(convertFileSrc(filename), () => {
            console.log("Sound loaded, playing");
            audioPlayer.loop();
            p.loop(); // Start visualisation when audio plays
        });

        console.log(audioPlayer);
    }
    //canvas = document.getElementById("visualizer");
    p = new p5(sketch, canvas);

    return { playFile };
}
