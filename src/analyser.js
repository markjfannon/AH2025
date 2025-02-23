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
            canvas = document.getElementById("visualizer");
            if (!canvas) {
                console.error("Canvas with ID 'visualizer' not found!");
                return;
            }

            ctx = canvas.getContext("2d");
            if (!ctx) {
                console.error("Failed to get 2D rendering context");
                return;
            }

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
            if (!ctx) return;

            // Clear the canvas each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            fft.analyze();

            const bass = fft.getEnergy("bass");
            const treble = fft.getEnergy(50, 110);
            const mid = fft.getEnergy("mid");

            // Scale the visualisation dynamically based on canvas size
            const radius = Math.min(canvas.width, canvas.height) * radiusFactor;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const mapMid = p.map(mid, 0, 255, -radius, radius);
            const scaleMid = p.map(mid, 0, 255, 1, 1.5);
            const mapTreble = p.map(treble, 0, 255, -radius / 2, radius * 2);
            const scaleTreble = p.map(treble, 0, 255, 0.5, 2);
            const mapbass = p.map(bass, 0, 255, 0, radius);
            const scalebass = p.map(bass, 0, 255, 0, 0.8);

            ctx.save();
            ctx.translate(centerX, centerY);

            for (let i = 0; i < pieces; i++) {
                ctx.rotate((Math.PI * 2) / pieces);

                /*----------  BASS  ----------*/
                ctx.beginPath();
                ctx.fillStyle = bassColor[0];
                const bassX = mapbass * Math.cos(p.frameCount * 0.03);
                const bassY = mapbass * Math.sin(p.frameCount * 0.03);
                ctx.arc(bassX, bassY, 6, 0, Math.PI * 2);
                ctx.fill();

                ctx.beginPath();
                ctx.fillStyle = bassColor[1];
                ctx.arc(bassX * 0.8, bassY * 0.8, 4, 0, Math.PI * 2);
                ctx.fill();

                /*----------  MID  ----------*/
                ctx.beginPath();
                ctx.fillStyle = midColor;
                const midX = mapMid * Math.cos(-p.frameCount * 0.02);
                const midY = mapMid * Math.sin(-p.frameCount * 0.02);
                ctx.arc(midX, midY, 5, 0, Math.PI * 2);
                ctx.fill();

                /*----------  TREBLE  ----------*/
                ctx.beginPath();
                ctx.fillStyle = trembleColor;
                const trebleX = mapTreble * Math.cos(p.frameCount * 0.05);
                const trebleY = mapTreble * Math.sin(p.frameCount * 0.05);
                ctx.arc(trebleX, trebleY, 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
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

    p = new p5(sketch);

    return { playFile };
}
