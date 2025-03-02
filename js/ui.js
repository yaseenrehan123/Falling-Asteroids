import * as appScript from './app.js';
import * as asteroidScript from './asteroid.js';
import * as hpScript from './hp.js';
import * as elementScript from '../util/element.js'
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

export const hpBar = document.querySelector('.hp-container');

settingsBtn.onclick = () => settingsBtnClicked();
restartBtn.onclick = () => restartBtnClicked();
mainMenuBtn.onclick = () => mainMenuBtnClicked();
unpauseBtn.onclick = () => unPauseBtnClicked();
resetScoreBtn.onclick = () => resetScoreBtnClicked();
startBtn.onclick = () => startBtnClicked();
quitBtn.onclick = () => quitBtnClicked();

scoreText.textContent = `Score: 0`;
highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;

function settingsBtnClicked(){
    // enable settings
  appScript.pause();
  elementScript.clearSpawnTimeouts();
 appScript.enableObjectInlineBlock(pauseWindow);
  appScript.disableObject(settingsBtn);
  if(unpauseBtn.style.display === 'none'){
      appScript.enableObjectFlex(unpauseBtn);
  }
}
function restartBtnClicked(){
  if(settingsBtn.style.display === 'none'){
      appScript.enableObjectInlineBlock(settingsBtn);
  }
  resetGame();
}
function mainMenuBtnClicked(){
  location.reload();
}

function unPauseBtnClicked(){
  appScript.unPause();
  appScript.disableObject(pauseWindow);
  appScript.enableObjectInlineBlock(settingsBtn);
}

function resetScoreBtnClicked(){
  localStorage.removeItem('score');
  if(settingsBtn.style.display === 'none'){
      appScript.enableObjectInlineBlock(settingsBtn);
  }
  resetGame();
}
function startBtnClicked(){
  appScript.unPause();
  appScript.enableObjectInlineBlock(settingsBtn);
  appScript.enableObjectFlex(hpBar);
 const hideOnPlayElements = document.querySelectorAll('.hide-on-play');
 hideOnPlayElements.forEach(function(e){
  appScript.disableObject(e);
 });
}
function quitBtnClicked(){
  window.close();
}
function resetGame(){// used to reset game but not go back to mainmenu
    asteroidScript.ClearContainer();
    appScript.gameScore.currentScore = 0;
    asteroidScript.resetSpawnRate();
    asteroidScript.resetSpeed();
    scoreText.textContent = `Score: 0`;
    highestScoreText.textContent = `Highest Score: ${JSON.parse(localStorage.getItem('score')) || 0}`;
    appScript.unPause();
    appScript.disableObject(pauseWindow);
    hpScript.resetHp();
    appScript.enableObjectFlex(hpBar);
    hpScript.handleHp();
}
export function setScore(value){
  scoreText.textContent = `Score: ${value}`;
}
export function setHighestScore(value){
   highestScoreText.textContent = `Highest Score: ${value}`
}