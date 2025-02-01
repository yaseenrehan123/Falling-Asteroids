//general variables
let isTabActive = true;
const maxSpawnRate = 4;
let spawnRate = 1;

//Set isTabActive
window.addEventListener('focus',function(){
    isTabActive = true;
});
window.addEventListener('blur',function(){
    isTabActive = false;
});
//boxes
const boxes = [];
const boxContainer = document.querySelector('.box-container');
setInterval(spawnBox, 3000);

function spawnBox(){
    if(!isTabActive){
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
            x = e.pageX;
            y = e.pageY;
            createParticles(x,y,'pink');
            deleteBox(box);
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
        if (!isTabActive) {
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
    if(spawnRate < maxSpawnRate){
        spawnRate ++;
    }
}
setInterval(increaseSpawnRate,10000);
//handle onscreensize change
window.addEventListener('resize',function(){
    boxContainer.innerHTML = '';
});