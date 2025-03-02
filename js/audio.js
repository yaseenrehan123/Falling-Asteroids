const audioCache = {}; // Store preloaded audio

preloadAudio([
    'audio/Blast-sound1.mp3',
    'audio/587196__derplayer__explosion_06.ogg',
    'audio/085594_potion-35983.mp3'
]);
function preloadAudio(audioFiles) {
    audioFiles.forEach((file) => {
        const audio = new Audio(file);
        audio.preload = 'auto'; // Tell browser to load it
        audioCache[file] = audio;
    });
}

export function playSound(audioFile) {
    if (audioCache[audioFile]) {
        const audio = audioCache[audioFile].cloneNode(); // Clone to allow multiple plays
        audio.play();
    } else {
        console.warn(`Audio file not preloaded: ${audioFile}`);
    }
}