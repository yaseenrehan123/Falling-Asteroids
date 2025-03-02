import * as appScript from './app.js';
import * as uiScript from './ui.js';
const maxHp = 10;
let hp = maxHp;

const hpImg = document.querySelector('.hp-container img');

export function subtractHp(){
    if(hp > 0){
        hp--;
    }
    
    handleHp();
    
}
export function increaseHp(){
    if(hp < maxHp){
        hp++;
    }
    
    handleHp()
}
 export function handleHp(){
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
            appScript.disableObject(uiScript.hpBar);
            appScript.gameOver();
            //alert('Game Ended, You lost');
            return;               
        default:
            //alert('Hp not matched with any statements');
            return;
    }
    hpImg.src = `images/hearts/Heart${hpImgNum}.gif`;
}
export function resetHp(){
    hp = maxHp;
    handleHp();
}