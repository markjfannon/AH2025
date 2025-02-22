export function setupQueue(element) {
    let queue = ["Haha", "I love haskell", "the mowing song", "untitled song", "Euan - The Sways"];
    const ol = document.createElement("ol");

    for (let i = 0; i < queue.length; i++) {
        const p = document.createElement("li");
        
        p.innerText = queue[i];
        ol.appendChild(p);
    }

    element.appendChild(ol);

}