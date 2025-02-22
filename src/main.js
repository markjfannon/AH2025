import "./style.css";
import { setupQueue } from "./queue";
import { init } from "./analyser";
import { draw_cats } from "./gatto";

setupQueue(document.querySelector("#queue"));
document.getElementById("play-button").addEventListener("click", init);
//document.body.addEventListener("resize", draw_cats);
//document.body.addEventListener("click", draw_cats);