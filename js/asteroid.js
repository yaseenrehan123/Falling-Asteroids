const minSpawnDelay = 2000; // Ensures consistent spawn rate
const maxSpawnDelay = 3000;
let randomSpawnDelay = returnRandomNum(minSpawnDelay,maxSpawnDelay);
const maxSpawnRate = 8;
const defSpawnRate = 1;
let spawnRate = defSpawnRate;
const maxSpeed = 10;
const defSpeed = 2;
const speedIncreaseRate = 1;
let speed = 2;

const boxes = [];
const container = document.querySelector('.container');
let spawnTimeouts = []; // Store timeouts
setInterval(spawnBox, randomSpawnDelay);

function spawnBox() {
    spawnElement({
        className: "element",
        images: ["asteroid1", "asteroid2", "asteroid3"],
        onClick: (box) => {
            let x = box.offsetLeft;
            let y = box.offsetTop;
            playSound("audio/Blast-sound1.mp3");
            screenShake(100);
            createParticles(x, y, "#d35400");
            deleteBox(box);
            gameScore.currentScore++;

            // Update score display
            scoreText.textContent = `Score: ${gameScore.currentScore}`;

            let highestScore = localStorage.getItem("score") || 0;
            if (gameScore.currentScore > highestScore) {
                gameScore.highestScore = gameScore.currentScore;
                highestScoreText.textContent = `Highest Score: ${gameScore.highestScore}`;
                localStorage.setItem("score", JSON.stringify(gameScore.highestScore));
            }
        },
        onDestroy: (box) => {
            deleteBox(box);
            subtractHp();
            playSound('audio/587196__derplayer__explosion_06.ogg');
            console.log(hp);
        },
        spawnRate: spawnRate,
        arrayRef: boxes,
    });
}

// Function to clear scheduled spawns when paused

function deleteBox(box){
    box.dataset.deleted = "true"; // Mark as deleted
    boxIndex = boxes.indexOf(box);
    if(boxIndex > -1){
        boxes.splice(boxIndex,1);
    }
    // Ensure the box is still in the container before trying to remove it
    if (box.parentNode === container) {
        container.removeChild(box);
    }
    box.remove();
}

function ClearContainer(){
    if(container.childNodes.length > 0){
        boxes.forEach(box => {
            box.dataset.deleted = "true"; // Mark all boxes as deleted
        });
        container.innerHTML = '';
        boxes.length = 0;
    }
}