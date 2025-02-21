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