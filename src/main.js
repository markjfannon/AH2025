import { setupAudio } from "./analyser";
import { initOneko } from "./oneko";
import { setupQueue } from "./queue";
import "./style.css";



const { playFile } = setupAudio();
const { removeSong } = setupQueue(document.querySelector("#queue"));

document.getElementById("play-button").addEventListener("click", () => {
    const filename = removeSong();
    debugger;
    if (filename !== null) {
        console.log("Play " + filename)
        playFile(filename);
    }
});

initOneko();
