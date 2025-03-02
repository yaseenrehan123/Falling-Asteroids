import * as appScript from './app.js';
import * as elementScript from '../util/element.js';
import * as audioScript from './audio.js';
import * as hpScript from './hp.js';
import * as particlesScript from './particles.js';
import * as uiScript from './ui.js';
const minSpawnDelay = 2000; // Ensures consistent spawn rate
const maxSpawnDelay = 3000;
let randomSpawnDelay = appScript.returnRandomNum(minSpawnDelay,maxSpawnDelay);
const maxSpawnRate = 8;
const defSpawnRate = 1;
let spawnRate = defSpawnRate;
const maxSpeed = 10;
const defSpeed = 2;
const speedIncreaseRate = 1;
let speed = 2;

const boxes = [];
export const container = document.querySelector('.container');

setInterval(spawnBox, randomSpawnDelay);

function spawnBox() {
    elementScript.spawnElement({
        className: "element",
        images: ["asteroid1", "asteroid2", "asteroid3"],
        onClick: (box) => {
            let x = box.offsetLeft;
            let y = box.offsetTop;
            audioScript.playSound("audio/Blast-sound1.mp3");
            particlesScript.screenShake(100);
            particlesScript.createParticles(x, y, "#d35400");
            deleteBox(box);
            appScript.gameScore.currentScore++;

            // Update score display
            uiScript.setScore(appScript.gameScore.currentScore);

            let highestScore = localStorage.getItem("score") || 0;
            if (appScript.gameScore.currentScore > highestScore) {
                appScript.gameScore.highestScore = appScript.gameScore.currentScore;
               uiScript.setHighestScore(appScript.gameScore.highestScore);
                localStorage.setItem("score", JSON.stringify(appScript.gameScore.highestScore));
            }
        },
        onDestroy: (box) => {
            deleteBox(box);
            hpScript.subtractHp();
            audioScript.playSound('audio/587196__derplayer__explosion_06.ogg');
            
        },
        spawnRate: spawnRate,
        arrayRef: boxes,
    });
}

// Function to clear scheduled spawns when paused

function deleteBox(box){
    box.dataset.deleted = "true"; // Mark as deleted
    const boxIndex = boxes.indexOf(box);
    if(boxIndex > -1){
        boxes.splice(boxIndex,1);
    }
    // Ensure the box is still in the container before trying to remove it
    if (box.parentNode === container) {
        container.removeChild(box);
    }
    box.remove();
}

export function ClearContainer(){
    if(container.childNodes.length > 0){
        boxes.forEach(box => {
            box.dataset.deleted = "true"; // Mark all boxes as deleted
        });
        container.innerHTML = '';
        boxes.length = 0;
    }
}
export function increaseSpawnRate(){
    if(!appScript.isWindowActive()){// if paused than return, if tab not active return.
        return;
    }
    if(spawnRate < maxSpawnRate){
        spawnRate ++;
    }
}
export function increaseSpeed(){
    if(!appScript.isWindowActive()){// if paused than return, if tab not active return.
        return;
    }
    if(speed < maxSpeed){
        speed += speedIncreaseRate;
    }
}
export function resetSpeed(){
    speed = defSpeed;
}
export function resetSpawnRate(){
    spawnRate = defSpawnRate;
}
export function returnSpeed(){
    return speed;
}