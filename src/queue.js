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

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".mp3,.wav,.flac,.m4a,.ogg,.aac";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    loadFileButton.onclick = async function () {
        fileInput.click();

        fileInput.onchange = () => {
            if (fileInput.files && fileInput.files.length > 0) {
                const file = fileInput.files[0];
                addSong(file);
            }
        };
    };

    return { addSong, removeSong };
}
