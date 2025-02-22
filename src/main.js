import { init } from "./analyser";
import { setupQueue } from "./queue";
import "./style.css";

const { addSong, removeSong } = setupQueue(document.querySelector("#queue"));
document.getElementById("play-button").addEventListener("click", init);
