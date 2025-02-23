import { init } from "./analyser";
import { setupQueue } from "./queue";
import { initOneko } from "./oneko"; // Import Oneko
import "./style.css";

const { addSong, removeSong } = setupQueue(document.querySelector("#queue"));
document.getElementById("play-button").addEventListener("click", init);

initOneko();

