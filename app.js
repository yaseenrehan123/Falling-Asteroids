//general variables
let isTabActive = true;
const maxSpawnRate = 4;
let spawnRate = 1;
let isPaused = true;
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
    for(i = 0; i < spawnRate; i++){
        const box = document.createElement('div');
        box.className = 'box';

        const containerRect = boxContainer.getBoundingClientRect();
        const containerWidth = containerRect.width;
        let posX = containerRect.left + Math.floor(Math.random() * containerWidth);
    
        box.style.left = posX + 'px';
        box.onclick = (e) =>{
            if(!isPaused){
                x = e.pageX;
                y = e.pageY;
                createParticles(x,y,'pink');
                deleteBox(box);
                gameScore.currentScore++;
                // display score
                scoreText.textContent = `Score: ${gameScore.currentScore}`;
                let highestScore = localStorage.getItem('score') || 0;
                if(gameScore.currentScore > highestScore){
                    gameScore.highestScore = gameScore.currentScore;
                    highestScoreText.textContent = `Highest Score: ${gameScore.highestScore}`;
                    localStorage.setItem('score',JSON.stringify(gameScore.highestScore));
                }
            }
           
        }
        boxes.push(box);
        boxContainer.appendChild(box);
        
        moveBox(box,0);
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
    function animate() {
        if (!isTabActive || isPaused) { // if paused than return, if tab not active return.
            requestAnimationFrame(animate); // Keep retrying when tab is inactive
            return;
        }
        
        posY += 4;
        box.style.top = posY + 'px';

        if (posY < window.innerHeight) {
            requestAnimationFrame(animate);
        } else {
            deleteBox(box);
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

