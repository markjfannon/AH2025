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
    let radiusFactor = 0.2;

    const bgColor = "#22212C";
    const bassColor = ["#ff4500", "#ffae00"];
    const midColor = "#ff1493";
    const trembleColor = "#00ffcc";

    const sketch = (instance) => {
        instance.setup = () => {
            stars = makeStars(10000);
            canvas = document.getElementById("visualizer");
            if (!canvas) return;

            ctx = canvas.getContext("2d");
            if (!ctx) return;

            resizeCanvas();
            fft = new p5.FFT();
            instance.noLoop();

            window.addEventListener("resize", resizeCanvas);
        };

        function resizeCanvas() {
            const container = canvas.parentElement;
            if (!container) return;

            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;

            p.redraw();
        }

        const makeStars = (count) => {
            const out = [];
            for (let i = 0; i < count; i++) {
                out.push({
                    x: Math.random() * 1600 - 800,
                    y: Math.random() * 900 - 450,
                    z: Math.random() * 1000
                });
            }
            return out;
        };

        const putPixel = (x, y, brightness) => {
            const intensity = brightness * 255;
            const rgb = `rgb(${intensity}, ${intensity}, ${intensity})`;
            ctx.fillStyle = rgb;
            ctx.fillRect(x, y, 1, 1);
        };

        const moveStars = (distance) => {
            for (const s of stars) {
                s.z -= distance;
                while (s.z <= 1) s.z += 1000;
            }
        };

        instance.draw = () => {
            if (!ctx) return;

            moveStars(p.deltaTime * 0.1);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            for (const star of stars) {
                const x = cx + star.x / (star.z * 0.001);
                const y = cy + star.y / (star.z * 0.001);
                if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

                const b = 1 - Math.pow(star.z / 1000, 1.5);
                putPixel(x, y, b);
            }

            fft.analyze();
            const bass = fft.getEnergy("bass");
            const treble = fft.getEnergy(50, 110);
            const mid = fft.getEnergy("mid");

            const radius = Math.min(canvas.width, canvas.height) * radiusFactor;
            const mapMid = p.map(mid, 0, 255, -radius, radius);
            const mapTreble = p.map(treble, 0, 255, -radius / 2, radius * 2);
            const mapbass = p.map(bass, 0, 255, 0, radius);

            ctx.save();
            ctx.translate(cx, cy);

            for (let i = 0; i < pieces; i++) {
                ctx.rotate((Math.PI * 2) / pieces);

                // BASS
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

                // MID
                ctx.beginPath();
                ctx.fillStyle = midColor;
                const midX = mapMid * Math.cos(-p.frameCount * 0.02);
                const midY = mapMid * Math.sin(-p.frameCount * 0.02);
                ctx.arc(midX, midY, 5, 0, Math.PI * 2);
                ctx.fill();

                // TREBLE
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

    function playFile(file) {
        console.log("In playFile", file);

        if (audioPlayer) {
            audioPlayer.stop();
        }

        const fileURL = URL.createObjectURL(file);

        audioPlayer = new p5.SoundFile(fileURL, () => {
            console.log("Sound loaded, playing");
            audioPlayer.loop();
            p.loop();
        });
    }

    p = new p5(sketch);

    return { playFile };
}
