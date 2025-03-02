import * as elementScript from '../util/element.js';
import * as audioScript from './audio.js';
import * as hpScript from './hp.js';

setInterval(spawnPotion,30000);
function spawnPotion() {
    elementScript.spawnElement({
        className: "element",
        images: ["potion"],
        onClick: (potion) => {
            audioScript.playSound("audio/085594_potion-35983.mp3");
            hpScript.increaseHp();
            potion.remove(); // Remove potion on click
        },
        onDestroy: (potion) => {
            potion.remove(); // Remove potion but no HP penalty
        },
        spawnRate: 1, // Potions spawn less frequently
    });
}
