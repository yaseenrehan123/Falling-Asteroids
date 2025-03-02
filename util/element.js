import * as appScript from '../js/app.js';
import * as asteroidScript from '../js/asteroid.js';
let spawnTimeouts = []; // Store timeouts
export function spawnElement({ className, images, onClick, onDestroy, spawnRate = 1,arrayRef = null }) {
    

    if(!appScript.isWindowActive()){
        return;
    }

    for (let i = 0; i < spawnRate; i++) {
        const timeoutID = setTimeout(() => {
            if (!appScript.isWindowActive()) return;

            const element = document.createElement("div");
            element.className = className;

            const elementImg = document.createElement("img");
            if (Array.isArray(images) && images.length > 1) {
                // Choose a random image if multiple options are given
                let randomIndex = Math.floor(Math.random() * images.length);
                elementImg.src = `images/${images[randomIndex]}.gif`;
            } else {
                // Use the only provided image
                elementImg.src = `images/${images[0]}.gif`;
            }
            elementImg.className = "element-img";
            element.appendChild(elementImg);

            const containerRect = asteroidScript.container.getBoundingClientRect();
            const containerWidth = containerRect.width;
            let posX = Math.floor(Math.random() * containerWidth);

            element.style.left = posX + "px";
            element.style.top = "0px";

            element.onclick = () => {
                if (!appScript.isPaused) {
                    onClick(element);
                }
            };
            
            if (arrayRef !== null) {
                arrayRef.push(element); // Add element to the specified array
            }

            asteroidScript.container.appendChild(element);
            moveDown(element, 0, onDestroy);
        }, i * 200);

        spawnTimeouts.push(timeoutID);
    }
}
export function clearSpawnTimeouts() {
    spawnTimeouts.forEach(clearTimeout); // Clear all scheduled timeouts
    spawnTimeouts = []; // Reset array
}

function moveDown(element, posY, onDestroy) {
    element.dataset.deleted = "false";

    function animate() {
        if (!appScript.isWindowActive()) { // Pause logic
            requestAnimationFrame(animate);
            return;
        }

        posY += asteroidScript.returnSpeed();
        element.style.top = posY + "px";

        if (posY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else if (element.dataset.deleted === "false") {
            onDestroy(element); // Call custom destroy logic
        }
    }

    requestAnimationFrame(animate);
}