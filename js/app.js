import * as asteroidScript from './asteroid.js';
//#region general variables
let isTabActive = true;

export let isPaused = true; // make true at start so game is paused! 



//#region score
export const gameScore = {
    currentScore: 0,
    highestScore:0,
};
//#endregion
window.addEventListener('focus',function(){
    isTabActive = true;
});
window.addEventListener('blur',function(){
    isTabActive = false;
});
window.addEventListener('resize',function(){
    asteroidScript.ClearContainer();
});

export function gameOver(){
    asteroidScript.clearSpawnTimeouts();
    asteroidScript.ClearContainer();
   const heading = document.querySelector('.pause-window .wrapper .heading h1');
   heading.textContent = 'Game Over!'
   isPaused = true;
   enableObjectInlineBlock(pauseWindow);
   const unpauseBtn = document.querySelector('.pause-window .wrapper .unpause-btn');
   disableObject(unpauseBtn);
   disableObject(settingsBtn);
}

//#region general reusability functions 

export function enableObjectInlineBlock(object){
    object.style.display = 'inline-block';
}
export function enableObjectFlex(object){
    object.style.display = 'flex';
}
export function disableObject(object){
    console.log("Disabling object:", object);
    console.log("Current display:", object.style.display);
    object.style.display = 'none';
}
export function isWindowActive(){
    if(!isTabActive || isPaused){
        return false;
    }
    else{
        return true
    }
}
export function pause(){
    isPaused = true;
}
export function unPause(){
    isPaused = false;
}
//#region random genrator 
export function returnRandomNum(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
//#endregion






