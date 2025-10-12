export function setupQueue(element) {
    let queue = [];
    const ol = document.createElement("ol");

    function addSong(file) {
        const li = document.createElement("li");

        queue.push(file);
        li.innerText = file.name;

        ol.appendChild(li);
    }

    function removeSong() {
        const song = queue.shift();
        if (song === undefined) {
            return null;
        }

        ol.innerHTML = "";
        renderList();

        return song;
    }

    function renderList() {
        for (let i = 0; i < queue.length; i++) {
            const li = document.createElement("li");
            li.innerText = queue[i].name;
            ol.appendChild(li);
        }
    }

    renderList();
    element.appendChild(ol);

    const loadFileButton = document.querySelector("#load-file-button");
    const fileInput = document.getElementById("file-input");

    loadFileButton.onclick = async function () {
        fileInput.click();
    };

    fileInput.onchange = () => {
        if (fileInput.files && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            addSong(file);
            // Hide instructions when a file is uploaded
            const instructions = document.getElementById("instructions");
            if (instructions) {
                instructions.style.display = "none";
            }
        }
    };

    return { addSong, removeSong };
}
