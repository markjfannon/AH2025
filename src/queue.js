export function setupQueue(element) {
    let queue = ["Haha", "I love haskell", "the mowing song", "untitled song", "Euan - The Sways"];
    const ol = document.createElement("ol");

    function addSong(trackTitle) {
        const li = document.createElement("li");

        queue.push(trackTitle);
        li.innerText = trackTitle;

        ol.appendChild(li);
    }

    function removeSong() {
        queue.shift();

        ol.innerHTML = "";

        renderList();
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
}