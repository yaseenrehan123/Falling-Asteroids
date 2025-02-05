//#region general variables
let isTabActive = true;
//#region spawn rate
const minSpawnDelay = 2000; // Ensures consistent spawn rate
const maxSpawnDelay = 3000;
let randomSpawnDelay = returnRandomNum(minSpawnDelay,maxSpawnDelay);
const maxSpawnRate = 8;
const defSpawnRate = 1;
let spawnRate = defSpawnRate;
//#endregion

//#region speed
const maxSpeed = 10;
const defSpeed = 2;
const speedIncreaseRate = 1;
let speed = 2;
//#endregion
let isPaused = true; // make true at start so game is paused! 

//#region hp
const maxHp = 10;
let hp = maxHp;

//#endregion

//#region score
const gameScore = {
    currentScore: 0,
    highestScore:0,
};
//#endregion

//#endregion

//#region Set isTabActive
window.addEventListener('focus',function(){
    isTabActive = true;
});
window.addEventListener('blur',function(){
    isTabActive = false;
});
//#endregion
//#region UI Refrences
const settingsBtn = document.querySelector('.settings-btn');

const restartBtn = document.getElementById('restart-btn');

const mainMenuBtn = document.getElementById('go-to-main-menu-btn');

const unpauseBtn = document.querySelector('.unpause-btn');

const resetScoreBtn = document.getElementById('reset-score-btn');

const startBtn = document.getElementById('start-btn');

const quitBtn = document.getElementById('quit-btn');

const pauseWindow = document.querySelector('.pause-window');

const scoreText = document.querySelector('.current-score h1');

const highestScoreText = document.querySelector('.highest-score h1');

const mainMenu = document.querySelector('main-menu');

const hpBar = document.querySelector('.hp-container');
//#endregion

//#region Btn functions

function settingsBtnClicked(){
      // enable settings
    isPaused = true;
    clearSpawnTimeouts();
   enableObjectInlineBlock(pauseWindow);
    disableObject(settingsBtn);
    if(unpauseBtn.style.display === 'none'){
        enableObjectFlex(unpauseBtn);
    }
}
function restartBtnClicked(){
    if(settingsBtn.style.display === 'none'){
        enableObjectInlineBlock(settingsBtn);
    }
    resetGame();
}
function mainMenuBtnClicked(){
    location.reload();
}

function unPauseBtnClicked(){
    isPaused = false;
    disableObject(pauseWindow);
    enableObjectInlineBlock(settingsBtn);
}

function resetScoreBtnClicked(){
    localStorage.removeItem('score');
    if(settingsBtn.style.display === 'none'){
        enableObjectInlineBlock(settingsBtn);
    }
    resetGame();
}
function startBtnClicked(){
    isPaused = false;
    enableObjectInlineBlock(settingsBtn);
    enableObjectFlex(hpBar);
   const menuBtns = document.querySelectorAll('.menu-btn');
   menuBtns.forEach(function(btn){
    disableObject(btn);
   });
}
function quitBtnClicked(){
    window.close();
}
//#endregion

//#region assiging functons to btns

settingsBtn.onclick = () => settingsBtnClicked();
restartBtn.onclick = () => restartBtnClicked();
mainMenuBtn.onclick = () => mainMenuBtnClicked();
unpauseBtn.onclick = () => unPauseBtnClicked();
resetScoreBtn.onclick = () => resetScoreBtnClicked();
startBtn.onclick = () => startBtnClicked();
quitBtn.onclick = () => quitBtnClicked();
//#endregion

//#region resetGame function
function resetGame(){// used to reset game but not go back to mainmenu
    ClearBoxContainer();
    gameScore.currentScore = 0;
    spawnRate = defSpawnRate;
    speed = defSpeed;
    scoreText.textContent = `Score: 0`;
    highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;
    isPaused = false;
    disableObject(pauseWindow);
    hp = 10;
    enableObjectFlex(hpBar);
    handleHp();
}
//#endregion

//#region set score at beginning
scoreText.textContent = `Score: 0`;
highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;

//#endregion

//#region boxes
const boxes = [];
const boxContainer = document.querySelector('.box-container');
let spawnTimeouts = []; // Store timeouts
setInterval(spawnBox, randomSpawnDelay);

function spawnBox() {
    randomSpawnDelay = returnRandomNum(minSpawnDelay,maxSpawnDelay);

    if (!isTabActive || isPaused) { // Stop spawning when paused or tab is inactive
        return;
    }
    
    for (let i = 0; i < spawnRate; i++) {
        const timeoutID = setTimeout(() => { // Delay each box spawn
            if (isPaused) return; // Don't spawn if paused
            
            const box = document.createElement('div');
            box.className = 'box';

            const boxImg = document.createElement('img');
            const imgOptions = ['asteroid1', 'asteroid2', 'asteroid3'];
            let randomOptionIndex = Math.floor(Math.random() * imgOptions.length);
            let randomOption = imgOptions[randomOptionIndex];
            boxImg.src = `images/${randomOption}.gif`;
            boxImg.className = 'box-img';
            box.appendChild(boxImg);

            const containerRect = boxContainer.getBoundingClientRect();
            const containerWidth = containerRect.width;
            let posX = Math.floor(Math.random() * containerWidth);
            
            box.style.left = posX + 'px';
            box.style.top = 0;
            
            box.onclick = (e) => {
                if (!isPaused) {
                    let x = e.pageX;
                    let y = e.pageY;
                    playSound('audio/Blast-sound1.mp3');
                    screenShake(100);
                    createParticles(x, y, '#d35400');
                    deleteBox(box);
                    gameScore.currentScore++;

                    // Update score display
                    scoreText.textContent = `Score: ${gameScore.currentScore}`;

                    let highestScore = localStorage.getItem('score') || 0;
                    if (gameScore.currentScore > highestScore) {
                        gameScore.highestScore = gameScore.currentScore;
                        highestScoreText.textContent = `Highest Score: ${gameScore.highestScore}`;
                        localStorage.setItem('score', JSON.stringify(gameScore.highestScore));
                    }
                }
            };

            boxes.push(box);
            boxContainer.appendChild(box);
            moveBox(box, 0);
        }, i * 200); // Delay each spawn by 200ms

        spawnTimeouts.push(timeoutID); // Store timeout ID
    }
}

// Function to clear scheduled spawns when paused
function clearSpawnTimeouts() {
    spawnTimeouts.forEach(clearTimeout); // Clear all scheduled timeouts
    spawnTimeouts = []; // Reset array
}
function deleteBox(box){
    box.dataset.deleted = "true"; // Mark as deleted
    boxIndex = boxes.indexOf(box);
    if(boxIndex > -1){
        boxes.splice(boxIndex,1);
    }
    // Ensure the box is still in the container before trying to remove it
    if (box.parentNode === boxContainer) {
        boxContainer.removeChild(box);
    }
    box.remove();
}
function moveBox(box,posY){
    box.dataset.deleted = 'false';
    function animate() {
        if (!isTabActive || isPaused || hp <= 0) { // if paused than return, if tab not active return.
            requestAnimationFrame(animate); // Keep retrying when tab is inactive
            return;
        }
        
        posY += speed;
        box.style.top = posY + 'px';

        if (posY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else if(box.dataset.deleted === "false") {
            if(hp > 0){
                deleteBox(box);
                subtractHp(); // hp keeps going down! 
                console.log(hp);
            }
           
            console.log('A box passed the screen and got destroyed!');
        }
    }

    requestAnimationFrame(animate); // Ensure animation resumes when returning to the tab
}
//#endregion
//#region particles
function createParticles(x,y,color){
    const div = document.createElement('div');
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.style.position = 'absolute';
    document.body.append(div);
   
    let maxParticles = 16;
    
    for(let i = 0; i < maxParticles; i++){
        const particle = document.createElement('span');
        particle.className = 'particle-span';

        let angle = i *(360/maxParticles) + Math.random() * (maxParticles - 1);
        let height = 20 + Math.random() * 30;
        let width = 4 + Math.random() * 15;

        particle.style.height = height + 'px';
        particle.style.width = width + 'px';
        particle.style.transform = `rotate(${angle}deg)`;
        particle.style.backgroundColor = color;
        div.append(particle);
    }
    requestAnimationFrame(() =>{
        div.querySelectorAll('.particle-span').forEach(function(element){
            let moveY = -50 - Math.random() * 100;
            element.style.transform += `scaleY(0.5) translateY(${moveY}px)`;
            element.style.opacity = "0";
        });
        setTimeout(() => document.body.removeChild(div), 400);
    });
    
}
//#endregion
// #region🌀 Screen Shake Effect
function screenShake(duration = 200) {
    let startTime = performance.now();
    let maxShakeOffset = 10; // Maximum shake intensity

    function shake() {
        let elapsedTime = performance.now() - startTime;
        if (elapsedTime > duration) {
            document.body.style.transform = ''; // Reset position
            return;
        }

        let shakeX = (Math.random() * maxShakeOffset * 2) - maxShakeOffset;
        let shakeY = (Math.random() * maxShakeOffset * 2) - maxShakeOffset;

        document.body.style.transform = `translate(${shakeX}px, ${shakeY}px)`;

        requestAnimationFrame(shake);
    }

    shake(); // Start shaking
}
//#endregion
//#region Increase spawnRate
function increaseSpawnRate(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(spawnRate < maxSpawnRate){
        spawnRate ++;
    }
}
setInterval(increaseSpawnRate,10000);
//#endregion
//#region handle onscreensize change
window.addEventListener('resize',function(){
    ClearBoxContainer();
});
//#endregion
//#region increase speed
function increaseSpeed(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(speed < maxSpeed){
        speed += speedIncreaseRate;
    }
}
setInterval(increaseSpeed,25000);
//#endregion

// #region audio

const audioCache = {}; // Store preloaded audio

preloadAudio([
    'audio/Blast-sound1.mp3',
    'audio/587196__derplayer__explosion_06.ogg'
]);
function preloadAudio(audioFiles) {
    audioFiles.forEach((file) => {
        const audio = new Audio(file);
        audio.preload = 'auto'; // Tell browser to load it
        audioCache[file] = audio;
    });
}

function playSound(audioFile) {
    if (audioCache[audioFile]) {
        const audio = audioCache[audioFile].cloneNode(); // Clone to allow multiple plays
        audio.play();
    } else {
        console.warn(`Audio file not preloaded: ${audioFile}`);
    }
}
//#endregion

//#region HP
const hpImg = document.querySelector('.hp-container img');

function subtractHp(){
    hp--;
    handleHp();
    playSound('audio/587196__derplayer__explosion_06.ogg');
}
function handleHp(){
    let hpImgNum = ''
    switch(hp){
        case 10:
            hpImgNum = 1;
            break;
        case 9:
            hpImgNum = 2;
            break;
        case 8:
            hpImgNum = 3;
            break;
        case 7:
            hpImgNum = 4;
            break;
        case 6:
            hpImgNum = 5;
            break;    
        case 5:
            hpImgNum = 6;
             break; 
        case 4:
            hpImgNum = 6;
            break;    
        case 3:
            hpImgNum = 7;
            break;
        case 2:
            hpImgNum = 8;
            break;
        case 1:
            hpImgNum = 9;
            break;
        case 0:
            disableObject(hpBar);
            gameOver();
            //alert('Game Ended, You lost');
            return;               
        default:
            //alert('Hp not matched with any statements');
            return;
    }
    hpImg.src = `images/hearts/Heart${hpImgNum}.gif`;
}
//#endregion
//#region gameOver

function gameOver(){
    clearSpawnTimeouts();
    ClearBoxContainer();
   const heading = document.querySelector('.pause-window .wrapper .heading h1');
   heading.textContent = 'Game Over!'
   isPaused = true;
   enableObjectInlineBlock(pauseWindow);
   const unpauseBtn = document.querySelector('.pause-window .wrapper .unpause-btn');
   disableObject(unpauseBtn);
   disableObject(settingsBtn);
}

//#endregion

//#region general reusability functions 

function enableObjectInlineBlock(object){
    object.style.display = 'inline-block';
}
function enableObjectFlex(object){
    object.style.display = 'flex';
}
function disableObject(object){
    console.log("Disabling object:", object);
    console.log("Current display:", object.style.display);

    object.style.display = 'none';
}

//#region ClearBoxContainer
function ClearBoxContainer(){
    if(boxContainer.childNodes.length > 0){
        boxes.forEach(box => {
            box.dataset.deleted = "true"; // Mark all boxes as deleted
        });
        boxContainer.innerHTML = '';
        boxes.length = 0;
    }
}
//#endregion

//#region random genrator 
function returnRandomNum(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
//#endregion

//#endregion




