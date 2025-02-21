//#region general variables
let isTabActive = true;

let isPaused = true; // make true at start so game is paused! 



//#region score
const gameScore = {
    currentScore: 0,
    highestScore:0,
};
//#endregion

function gameOver(){
    clearSpawnTimeouts();
    ClearContainer();
   const heading = document.querySelector('.pause-window .wrapper .heading h1');
   heading.textContent = 'Game Over!'
   isPaused = true;
   enableObjectInlineBlock(pauseWindow);
   const unpauseBtn = document.querySelector('.pause-window .wrapper .unpause-btn');
   disableObject(unpauseBtn);
   disableObject(settingsBtn);
}

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



//#region random genrator 
function returnRandomNum(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
//#endregion






