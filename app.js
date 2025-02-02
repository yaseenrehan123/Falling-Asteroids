//general variables
let isTabActive = true;
const maxSpawnRate = 6;
let spawnRate = 1;
let maxSpeed = 10;
let speed = 4;
let isPaused = true;
const minSpawnDelay = 3000; // Ensures consistent spawn rate
let lastBoxPosX = null; // Track last box position
const minGap = 100; // Minimum gap between spawns
const maxHp = 10;
let hp = maxHp;
const gameScore = {
    currentScore: 0,
    highestScore:0,
};
//Set isTabActive
window.addEventListener('focus',function(){
    isTabActive = true;
});
window.addEventListener('blur',function(){
    isTabActive = false;
});
//UI
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
settingsBtn.onclick = function(){ //settings btn
    // enable settings
        isPaused = true;
        pauseWindow.style.display = 'inline-block';
        settingsBtn.style.display = 'none'
}
restartBtn.onclick = function(){ //restart level btn
    // reset things
    if(settingsBtn.style.display === 'none'){
        settingsBtn.style.display = 'inline-block';
    }
    resetGame();
}
mainMenuBtn.onclick = function(){ //go to main-menu btn
    location.reload();
}
unpauseBtn.onclick = function(){ // unpause btn
    isPaused = false;
    pauseWindow.style.display = 'none';
    settingsBtn.style.display = 'inline-block'
}
resetScoreBtn.onclick = function(){ //reset score and level btn
    if(settingsBtn.style.display === 'none'){
        settingsBtn.style.display = 'inline-block';
    }
    resetGame();
    localStorage.removeItem('score');
}
startBtn.onclick = function(){ // start/play btn
    isPaused = false;
    settingsBtn.style.display = 'inline-block';
    hpBar.style.display = 'flex';
   const menuBtns = document.querySelectorAll('.menu-btn');
   menuBtns.forEach(function(btn){
    btn.style.display = 'none';
   });
}
// set score at beginning
scoreText.textContent = `Score: 0`;
highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;
function resetGame(){// used to reset game but not go back to mainmenu
    boxContainer.innerHTML = '';
    gameScore.currentScore = 0;
    spawnRate = 1;
    speed = 4;
    scoreText.textContent = `Score: 0`;
    highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;
    if(isPaused){
        isPaused = false;
        pauseWindow.style.display = 'none';
    }
}
//boxes
const boxes = [];
const boxContainer = document.querySelector('.box-container');
setInterval(spawnBox, 3000);

function spawnBox(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    for (let i = 0; i < spawnRate; i++) {
        setTimeout(() => { // Delay each box spawn
            const box = document.createElement('div');
            box.className = 'box';

            const boxImg = document.createElement('img');
            const imgOptions = ['asteroid1','asteroid2','asteroid3'];
            let randomOptionIndex = Math.floor(Math.random() * imgOptions.length);
            let randomOption = imgOptions[randomOptionIndex];
            boxImg.src = `images/${randomOption}.gif`;
            boxImg.className = 'box-img';
            box.appendChild(boxImg);
            const containerRect = boxContainer.getBoundingClientRect();
            const containerWidth = containerRect.width;
            let posX =  Math.floor(Math.random() * containerWidth);
            
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
        }, i * 200); // Delay each spawn by 200ms (adjust as needed)
    }
}
function deleteBox(box){
    boxIndex = boxes.indexOf(box);
    if(boxIndex > -1){
        boxes.splice(boxIndex,1);
    }
    box.remove();
}
function moveBox(box,posY){
    box.dataset.deleted = 'false';
    function animate() {
        if (!isTabActive || isPaused) { // if paused than return, if tab not active return.
            requestAnimationFrame(animate); // Keep retrying when tab is inactive
            return;
        }
        
        posY += speed;
        box.style.top = posY + 'px';

        if (posY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else if(box.dataset.deleted === "false") {
            box.dataset.deleted = "true"; // Mark as deleted
            deleteBox(box);
            subtractHp(); // hp keeps going down! 
            console.log(hp);
            console.log('A box passed the screen and got destroyed!');
        }
    }

    requestAnimationFrame(animate); // Ensure animation resumes when returning to the tab
}
//particles
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
// 🌀 Screen Shake Effect
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

//Increase spawnRate
function increaseSpawnRate(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(spawnRate < maxSpawnRate){
        spawnRate ++;
    }
}
setInterval(increaseSpawnRate,10000);
//handle onscreensize change
window.addEventListener('resize',function(){
    boxContainer.innerHTML = '';
});
// increase speed
function increaseSpeed(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(speed < maxSpeed){
        speed += 2;
    }
}
setInterval(increaseSpeed,25000);
// audio
function playSound(audioFile){
    let audio = new Audio();
    audio.src = audioFile;
    audio.play();
}
// HP
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
            hpBar.style.display = 'none';
            alert('Game Ended, You lost');
            return;               
        default:
            alert('Hp not matched with any statements');
            return;
    }
    hpImg.src = `images/hearts/Heart${hpImgNum}.gif`;
}