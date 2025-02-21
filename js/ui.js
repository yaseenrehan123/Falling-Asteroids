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
 const hideOnPlayElements = document.querySelectorAll('.hide-on-play');
 hideOnPlayElements.forEach(function(e){
  disableObject(e);
 });
}
function quitBtnClicked(){
  window.close();
}
function resetGame(){// used to reset game but not go back to mainmenu
    ClearContainer();
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