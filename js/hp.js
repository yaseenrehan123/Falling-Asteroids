const maxHp = 10;
let hp = maxHp;

const hpImg = document.querySelector('.hp-container img');

function subtractHp(){
    if(hp > 0){
        hp--;
    }
    
    handleHp();
    
}
function increaseHp(){
    if(hp < maxHp){
        hp++;
    }
    
    handleHp()
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