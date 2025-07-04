import { Engine, EntityTemplates, Input, Transform, type EntityId } from "piton-engine";
import { Unit, GameData, Spawner } from "./components";
import { MainMenuUi } from "./ui/mainMenu";
import { Utils } from "./utils";
import { SettingsUi } from "./ui/settings";
import { PauseUi } from "./ui/pause";
import { moverSystem } from "./systems/moverSystem";
import { spawnerSystem } from "./systems/spawnerSystem";
import { HealthBarUI } from "./ui/healthbar";
import { SpawnerPrefab } from "./prefabs/spawner";
import { GameoverUi } from "./ui/gameover";
import type { UiRegistry } from "./types";

const canvas: HTMLCanvasElement | null = document.querySelector(".game-canvas");
if (!canvas) throw new Error("CANVAS NOT FOUND!");

const engine: Engine = new Engine({
    canvas: canvas,
    resources: {
        images_JSON_path: "data/imagesData.json",
        audio_JSON_path: "data/audiosData.json",
    }
});
const em = engine.getEntityManager();
const entityTemplates: EntityTemplates = new EntityTemplates(engine);
const utils: Utils = new Utils(engine);
engine.addStartFunction(start.bind(this));
engine.addUpdateFunction(update.bind(this));
function start() {
    console.log("Start Ran!");

    initGameDataEntity();
    const gameData: GameData = utils.getGameData();

    const mainMenuSceneId = entityTemplates.createSceneEntity('mainMenu');
    const settingsSceneId = entityTemplates.createSceneEntity('settings');
    const gameSceneId = entityTemplates.createSceneEntity('game');

    const mainMenuUi = new MainMenuUi(engine);
    const settingsUi = new SettingsUi(engine);
    const pauseUi = new PauseUi(engine);
    const healthBarUi = new HealthBarUI(engine);
    const gameoverUi = new GameoverUi(engine);

    gameData.uiRegistry = {
        mainMenuUi: mainMenuUi,
        settingsUi: settingsUi,
        pauseUi: pauseUi,
        healthbarUi: healthBarUi,
        gameoverUi: gameoverUi
    }

    mainMenuUi.init();
    settingsUi.init();
    pauseUi.init();
    healthBarUi.init();
    gameoverUi.init();

    setDocumentInteracted();

    utils.setSceneOnLoad(settingsSceneId, () => {
        settingsUi.updateMusicButtonText();
        settingsUi.updateSfxButtonText();
    });
    utils.setSceneOnLoad(gameSceneId, () => {
        gameData.paused = false;
        gameData.gameSpeed = gameData.defaultgameSpeed;
        gameData.health = gameData.maxHealth;
        gameData.spawnerCount = 1;
        gameData.spawnerIncreaseCount = gameData.spawnerIncreaseDelay;
        gameData.difficultyChangeCounter = gameData.difficultyChangeDelay;
        gameData.gameOver = false;
        gameData.onGameoverFn = onGameover;

        pauseUi.updateMusicButtonText();
        pauseUi.updateSfxButtonText();
        pauseUi.togglePausePanel(false);
        pauseUi.togglePauseButton(true);
        gameoverUi.toggleGameoverPanel(false);
        utils.setHealthBar();

        // Delay removal by 1 frame
        const toRemove: EntityId[] = [];
        em.query('All', { unit: Unit }, (id) => {
            toRemove.push(id);
        });
        em.query('All', { //DELETE ALL THE SPAWNERS
            spawner: Spawner
        }, (id, { spawner }) => {
            toRemove.push(id);
        })
        // setTimeout(() => {
        for (const id of toRemove) {
            em.removeEntity(id);
        }
        // }, 0); // next tick

        new SpawnerPrefab(engine).init(); //STARTING SPAWNER  
    });

    engine.loadScene(mainMenuSceneId);

};
function update() {
    console.log("Update Running");
    setDocumentInteracted();
    increaseGameSpeed();
    increaseSpawners();

    moverSystem(engine);
    spawnerSystem(engine);
};
function initGameDataEntity() {
    const id: EntityId = entityTemplates.createEmptyEntity();
    em.addComponent(id, GameData, new GameData());
};
function setDocumentInteracted() {
    const gameData: GameData = utils.getGameData();
    if (gameData.documentInteracted) return; //RETURN IF DOCUMENT IS ALREADY INTERACTED
    const input: Input = engine.getInput();
    if (input.getJustPressed()) { //GOT CLICK/TOUCH
        gameData.documentInteracted = true;
        const onDocumentInteracted: Function = () => {
            utils.playAudio({
                key: 'background',
                volume: 0.35
            });
        };
        onDocumentInteracted();
        console.log("DOCUMENT INTERACTED SET TO TRUE !");
    }
};
function increaseGameSpeed() { //INCREASES DIFFICULTY
    const gameData: GameData = utils.getGameData();
    const deltaTime: number = engine.getDeltaTime();
    if (gameData.difficultyChangeCounter <= 0) {
        if (gameData.gameSpeed > gameData.maxgameSpeed) {
            gameData.gameSpeed = gameData.maxgameSpeed;
            return;
        }
        gameData.gameSpeed += gameData.gameSpeedChangeRate;
        gameData.difficultyChangeCounter = gameData.difficultyChangeDelay;
    }
    else {
        gameData.difficultyChangeCounter -= deltaTime;
    }
};
function increaseSpawners() { //INCREASES DIFFICULTY
    const gameData: GameData = utils.getGameData();
    const deltaTime: number = engine.getDeltaTime();
    if (gameData.spawnerCount >= gameData.maxSpawners) return;
    if (gameData.spawnerIncreaseCount <= 0) {
        new SpawnerPrefab(engine).init();
        gameData.spawnerIncreaseCount = gameData.spawnerIncreaseDelay;
        console.log("SPAWNER INCREASED!");
    }
    else {
        gameData.spawnerIncreaseCount -= deltaTime;
    }
    console.log(gameData.spawnerIncreaseCount);

};
function onGameover() {
    const gameData = utils.getGameData();
    const uiRegistry: UiRegistry = gameData.uiRegistry;

    uiRegistry.pauseUi?.togglePauseButton(false);
    uiRegistry.gameoverUi?.toggleGameoverPanel(true);
    uiRegistry.gameoverUi?.updateScoreText();
    uiRegistry.gameoverUi?.updateHighestScoreText();
    gameData.paused = true;
}