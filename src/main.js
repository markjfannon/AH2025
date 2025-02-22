import "./style.css";
import { setupQueue } from "./queue";
import { init } from "./analyser";

setupQueue(document.querySelector("#queue"));
document.getElementById("play-button").addEventListener("click", init);