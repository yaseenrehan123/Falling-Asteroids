import { EntityActive, EntityTemplates, Scene, Sprite, Text } from "piton-engine";
import type { Engine, EntityId, EntityManager } from "piton-engine";
import { GameData, HealthBar } from "./components";
import type { playAudioOptions } from "./types";

export class Utils {
    private engine: Engine;
    private em: EntityManager;
    //private entityTemplates: EntityTemplates;
    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        //this.entityTemplates = new EntityTemplates(engine);
    };
    getGameData(): GameData { //RETURNS GAMEDATA COMPONENT INSTANCE
        let instance: GameData | null = null;
        this.em.query('All', {
            gameData: GameData
        }, (id, { gameData }) => {
            instance = gameData;
        });
        if (instance === null)
            throw new Error("UNABLE TO GET GAMEDATA IN getGameData IN UTILS !");
        return instance;
    };
    playAudio(options: playAudioOptions) {
        const gameData = this.getGameData();

        if (!gameData.documentInteracted) return;

        if (options.key === 'background') {
            if (!gameData.music) return;

            if (!gameData.backgroundMusicInstance || gameData.backgroundMusicInstance.ended) {
                const audio = this.engine.getAudio('background');
                gameData.backgroundMusicInstance = audio.cloneNode(true) as HTMLAudioElement;
                gameData.backgroundMusicInstance.loop = true;
                gameData.backgroundMusicInstance.volume = options.volume ?? 0.35;
                gameData.backgroundMusicInstance.play();
            }
            return;
        }

        if (!gameData.sfx) return;

        const audio = this.engine.getAudio(options.key);
        const cloneAudio = audio.cloneNode(true) as HTMLAudioElement;
        cloneAudio.loop = options.looped ?? false;
        cloneAudio.volume = options.volume ?? 1;
        cloneAudio.play();
    }
    stopBackgroundMusic() {
        const gameData = this.getGameData();
        const music = gameData.backgroundMusicInstance;
        if (music) {
            music.pause();
            music.currentTime = 0;
            gameData.backgroundMusicInstance = null;
        }
    }
    resumeBackgroundMusic() {
        const gameData = this.getGameData();
        if (!gameData.music) return;

        if (!gameData.backgroundMusicInstance) {
            this.playAudio({ key: 'background', volume: 0.35 });
        } else {
            gameData.backgroundMusicInstance.play();
        }
    }
    /*
    initScene(options: initSceneOptions): EntityId { //ASSIGNS onLoad AND unLoad AS WELL *NOT NEEDED CURRENTLY*
        const id: EntityId = this.entityTemplates.createSceneEntity(options.name);
        const scene = this.em.getComponent(id, Scene);
        if (!scene) throw new Error("SCENE COMPONENT NOT FOUND IN initScene() IN utils.ts !");
        scene.onLoad = options.onLoad ?? (() => { });
        scene.onUnload = options.onUnload ?? (() => { });
        return id;
    };
    */
    setSceneOnLoad(sceneId: EntityId, onLoad: () => void): void {
        const scene = this.em.getComponent(sceneId, Scene);
        if (!scene) throw new Error("SCENE COMPONENT NOT FOUND IN setSceneOnLoad!");
        scene.onLoad = onLoad;
    };
    /*
    updateChildText(id:EntityId,content:string){
        const textId:EntityId | null = this.engine.getChildWithComponent(id,Text);
        if(textId === null) throw new Error("TEXT ID NOT FOUND In updateChildText() IN utils.ts ! , ID: " + id);
        const text = this.em.getComponent(textId,Text);
        if(!text) throw new Error("TEXT COMPONENT NOT FOUND IN updateChildText() IN uti;s.ts ! , ID: " + id);
        text.content = content;
    }
    */
    getHealthBarImage(): HTMLImageElement { //RETURNS THE APPROPRIATE HEALTHBAR IMAGE 
        const gameData: GameData = this.getGameData();
        const key: string = `heart${gameData.health}`;
        return this.engine.getImage(key);
    };
    setHealthBar() {
        const img: HTMLImageElement = this.getHealthBarImage();
        this.em.query('All', {
            healthbar: HealthBar,
            sprite: Sprite
        }, (id, { healthbar, sprite }) => {
            sprite.image = img;
        })
    }
    subtractHealth() {
        const gameData: GameData = this.getGameData();
        gameData.health--;
        this.setHealthBar();
        if (gameData.health <= 0) {
            gameData.gameOver = true;
            gameData.onGameoverFn();
            console.log("GAME OVER!");
        }
    };
    addHealth() {
        const gameData: GameData = this.getGameData();
        gameData.health++;
        if (gameData.health > gameData.maxHealth) {
            gameData.health = gameData.maxHealth;
        }
        this.setHealthBar();

    };
    setEntityActive(id: EntityId, value: boolean) {
        const entityActive = this.em.getComponent(id, EntityActive);
        if (!entityActive) throw new Error("ENTITY ACTIVE NOT FOUND IN setEntityActive(), ID: " + id);
        entityActive.value = value;
    };
    updateScore() {
        const gameData: GameData = this.getGameData();
        gameData.score++;
        if (gameData.score > gameData.highestScore) {
            gameData.highestScore = gameData.score;
            localStorage.setItem("highestScore", gameData.score.toString());
        };
    }
};