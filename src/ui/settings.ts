import { Alignment, Button, EntityTemplates, Rectangle, Shape, Text } from "piton-engine";
import type { Engine, EntityId, EntityManager } from "piton-engine";
import { Utils } from "../utils";
import type { GameData } from "../components";


export class SettingsUi {
    private engine: Engine;
    private em: EntityManager;
    private entityTemplates: EntityTemplates;
    private utils: Utils;
    //ID's
    private musicBtnId: EntityId | null = null;
    private sfxBtnId: EntityId | null = null;
    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        this.entityTemplates = new EntityTemplates(engine);
        this.utils = new Utils(engine);
    };
    init() {
        const sceneId: EntityId | null = this.engine.getSceneByName('settings');
        if (sceneId === null) throw new Error("SETTINGS SCENE ID NOT FOUND IN init() in settings.ts");
        this.initMusicButtonEntity(sceneId);
        this.initSfxButtonEntity(sceneId);
        this.initBackButtonEntity(sceneId);
    };
    private initMusicButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(200, 50, '', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 20 }
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initMusicButtonEntity() IN settings.ts");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initMusicButtonEntity() IN settings.ts");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initMusicButtonEntity() IN settings.ts");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initMusicButtonEntity() IN settings.ts");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        }

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const gameData: GameData = this.utils.getGameData();
            gameData.music = !gameData.music; //REVERSING IT
            localStorage.setItem("music", gameData.music.toString());
            this.updateMusicButtonText();
            if(gameData.music === true){
                this.utils.resumeBackgroundMusic();
            }
            else{
                this.utils.stopBackgroundMusic();
            }
        };

        text.size = 20;

        this.musicBtnId = id;
    };
    private initSfxButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(200, 50, '', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 120 }
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initSfxButtonEntity() IN settings.ts");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initSfxButtonEntity() IN settings.ts");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initSfxButtonEntity() IN settings.ts");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initSfxButtonEntity() IN settings.ts");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        }

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const gameData: GameData = this.utils.getGameData();
            gameData.sfx = !gameData.sfx; //REVERSING IT
            localStorage.setItem("sfx", gameData.sfx.toString())
            this.updateSfxButtonText();
        };

        text.size = 20;

        this.sfxBtnId = id;
    };
    private initBackButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(100, 50, 'BACK', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'right',
            alignmentVertical: 'top'
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initBackButtonEntity() IN settings.ts !");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initSfxButtonEntity() IN settings.ts");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initBackButtonEntity() IN settings.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initBackButtonEntity() IN settings.ts !");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        }

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const sceneId: EntityId | null = this.engine.getSceneByName('mainMenu');
            if (sceneId === null)
                throw new Error("SCENE ID NOT FOUND IN initBackButtonEntity() IN button.onJustPressed() ! KEY: 'mainMenu'");
            this.engine.loadScene(sceneId);
        }

        text.size = 20;

    }
    //PUBLIC FNS
    public updateMusicButtonText() {
        if (this.musicBtnId === null) throw new Error("MUSIC BTN ID NOT FOUND IN updateMusicButtonText() in settings.ts");
        const textId: EntityId | null = this.engine.getChildWithComponent(this.musicBtnId, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN updateMusicButtonText() IN settings.ts");
        const text = this.em.getComponent(textId, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN updateMusicButtonText() IN settings.ts");
        const gameData: GameData = this.utils.getGameData();
        text.content = gameData.music ? "Music: ON" : "Music: OFF";
    };
    public updateSfxButtonText() {
        if (this.sfxBtnId === null) throw new Error("SFX BTN ID NOT FOUND IN updateSfxButtonText() in settings.ts");
        const textId: EntityId | null = this.engine.getChildWithComponent(this.sfxBtnId, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN updateSfxButtonText() IN settings.ts");
        const text = this.em.getComponent(textId, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN updateSfxButtonText() IN settings.ts");
        const gameData: GameData = this.utils.getGameData();
        text.content = gameData.sfx ? "Sfx: ON" : "Sfx: OFF";
    };
}