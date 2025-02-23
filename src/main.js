import { init, setupAudio } from "./analyser";
import { initOneko } from "./oneko";
import { setupQueue } from "./queue";
import "./style.css";

const { playFile } = setupAudio();
const { removeSong } = setupQueue(document.querySelector("#queue"));

document.getElementById("click-button").addEventListener("click", () => init());
document.getElementById("play-button").addEventListener("click", () => {
    const filename = removeSong();
    if (filename !== null) {
        playFile(filename);
    }
});

initOneko();
