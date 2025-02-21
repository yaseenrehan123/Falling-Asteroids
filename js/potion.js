setInterval(spawnPotion,30000);
function spawnPotion() {
    spawnElement({
        className: "element",
        images: ["potion"],
        onClick: (potion) => {
            playSound("audio/085594_potion-35983.mp3");
            increaseHp();
            potion.remove(); // Remove potion on click
        },
        onDestroy: (potion) => {
            potion.remove(); // Remove potion but no HP penalty
        },
        spawnRate: 1, // Potions spawn less frequently
    });
}
