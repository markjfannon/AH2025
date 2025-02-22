
export async function draw_cats() {
    const width = document.body.clientWidth;
    const height = document.body.clientHeight;

    const imgSz = 200;
    const imgSrc = "./src/assets/gatto.gif";
    const cats = document.getElementById("background-cats")

    let elements = []
    for (let h = 0; h < height; h+=imgSz) {
        for (let w = 0; w < width; w+=imgSz) {
            var img = document.createElement('img'); 
            img.src = imgSrc; 
            img.style.position = "absolute";
            img.style.left = w + "px";
            img.style.top = h + "px";
            img.style.zIndex = 999;
            elements.push(img);
        }
    }
    console.log("Drawing cats");
    console.log(height);
    console.log(width);
    cats.replaceChildren(...elements);
    
}