setInterval(increaseSpawnRate,10000);
setInterval(increaseSpeed,25000);

function increaseSpawnRate(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(spawnRate < maxSpawnRate){
        spawnRate ++;
    }
}
function increaseSpeed(){
    if(!isTabActive || isPaused){// if paused than return, if tab not active return.
        return;
    }
    if(speed < maxSpeed){
        speed += speedIncreaseRate;
    }
}
