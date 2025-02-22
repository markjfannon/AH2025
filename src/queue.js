import { open } from "@tauri-apps/plugin-dialog";

export function setupQueue(element) {
    let queue = [];
    const ol = document.createElement("ol");

    function addSong(trackTitle) {
        const li = document.createElement("li");

        queue.push(trackTitle);
        li.innerText = trackTitle;

        ol.appendChild(li);
    }

    function removeSong() {
        const song = queue.shift();

        ol.innerHTML = "";

        renderList();

        return song;
    }

    function renderList() {
        for (let i = 0; i < queue.length; i++) {
            const li = document.createElement("li");

            li.innerText = queue[i];
            ol.appendChild(li);
        }
    }

    renderList();
    element.appendChild(ol);

    const loadFileButton = document.querySelector("#load-file-button");
    loadFileButton.onclick = async function () {
        const file = await open({ multiple: false, directory: false });
        addSong(file);
    };
}
