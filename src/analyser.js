import { convertFileSrc } from "@tauri-apps/api/core";
import "https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js";
import "https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/addons/p5.sound.min.js";

export function setupAudio() {
    let p;
    let audioPlayer;
    let fft;
    let canvas;
    let ctx;
    let stars;
    let pieces = 12;
    let radiusFactor = 0.2; // Controls how large the visualisation appears

    // Colour scheme
    const bgColor = "#22212C"; // Deep Midnight Purple
    const bassColor = ["#ff4500", "#ffae00"]; // Deep Orange
    const midColor = "#ff1493"; // Neon Pink
    const trembleColor = "#00ffcc"; // Teal Cyan

    const sketch = (instance) => {
        instance.setup = () => {
            stars = makeStars(10000);
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

        const makeStars = count => {
            const out = [];
            for (let i = 0; i < count; i++) {
              const s = {
                x: Math.random() * 1600 - 800,
                y: Math.random() * 900 - 450,
                z: Math.random() * 1000
              };
              out.push(s);
            }
            return out;
          };

          const putPixel = (x, y, brightness) => {
            const intensity = brightness * 255;
            const rgb = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
            ctx.fillStyle = rgb;
            ctx.fillRect(x, y, 1, 1);
          };
          
          const moveStars = distance => {
            const count = stars.length;
            for (var i = 0; i < count; i++) {
              const s = stars[i];
              s.z -= distance;
              while (s.z <= 1) {
                s.z += 1000;
              }
            }
          };

        instance.draw = () => {
            if (!ctx) return;
            moveStars(instance.deltaTime * 0.1);

            // Clear the canvas each frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const w = canvas.width;
            const h = canvas.height;
            const count = stars.length;
            for (var i = 0; i < count; i++) {
                const star = stars[i];

                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);

                if (x < 0 || x >= w || y < 0 || y >= h) {
                continue;
                }

                const d = star.z / 1000.0;
                const b = 1 - Math.pow(d, 1.5);

                putPixel(x, y, b);
            }


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


