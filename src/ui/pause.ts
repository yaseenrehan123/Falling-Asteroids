import { Alignment, Button, EntityActive, EntityTemplates, Rectangle, Shape, Text } from "piton-engine";
import type { Engine, EntityId, EntityManager } from "piton-engine";
import { Utils } from "../utils";
import type { GameData } from "../components";

export class PauseUi {
    private engine: Engine;
    private em: EntityManager;
    private entityTemplates: EntityTemplates;
    private utils: Utils;

    private pausePanelId: EntityId | null = null;
    private musicBtnId: EntityId | null = null;
    private sfxBtnId: EntityId | null = null;
    private pauseButtonId:EntityId | null = null;

    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        this.entityTemplates = new EntityTemplates(engine);
        this.utils = new Utils(engine);
    }

    init() {
        const sceneId = this.engine.getSceneByName("game");
        if (sceneId === null) throw new Error("GAME SCENE NOT FOUND IN GameUi.init()");
        this.initPauseButtonEntity(sceneId);
        this.initPausePanel(sceneId);
    }

    private initPauseButtonEntity(parentId: EntityId) {
        const id = this.entityTemplates.createRectButtonEntity(100, 50, "PAUSE", parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: "right",
            alignmentVertical: "top",
        }));

        const textId = this.engine.getChildWithComponent(id, Text);
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = textId ? this.em.getComponent(textId, Text) : null;

        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initPauseButtonEntity() in game.ts !");
        if (!button) throw new Error("ENTITY ACTIVE COMPONENT NOT FOUND IN initPauseButtonEntity() in game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initPauseButtonEntity() in game.ts !");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.layer = 1;

        text.size = 18;
        text.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({ key: "buttonClick" });
            this.togglePausePanel(true);
            const gameData: GameData = this.utils.getGameData();
            gameData.paused = true;
        };
        button.layer = 1;

        this.pauseButtonId = id;
    }

    private initPausePanel(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectangleEntity(400, 400, parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'middle'
        }));
        const shape = this.em.getComponent(id, Shape);
        const entityActive = this.em.getComponent(id, EntityActive);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initPausePanel() in game.ts !");
        if (!entityActive) throw new Error("ENTITY ACTIVE COMPONENT NOT FOUND IN initPausePanel() in game.ts !");

        shape.color = 'rgb(17, 39, 89)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
            rect.roundedRadius = 10;
        };
        shape.alpha = 0.5;
        shape.layer = 1;

        entityActive.value = false;

        this.initMusicButtonEntity(id);
        this.initSfxButtonEntity(id);
        this.initMainMenuButtonEntity(id);
        this.initUnPauseButtonEntity(id);
        this.initRestartButtonEntity(id);
        this.pausePanelId = id;
    }

    private initMusicButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(200, 50, "", parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: "center",
            alignmentVertical: "top",
            offset: { x: 0, y: 100 }
        }));

        const textId = this.engine.getChildWithComponent(id, Text);
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = textId ? this.em.getComponent(textId, Text) : null;

        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initMusicButtonEntity() in game.ts !");
        if (!button) throw new Error("ENTITY ACTIVE COMPONENT NOT FOUND IN initMusicButtonEntity() in game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initMusicButtonEntity() in game.ts !");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        }
        shape.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({ key: "buttonClick" });
            const gameData: GameData = this.utils.getGameData();
            gameData.music = !gameData.music;
            localStorage.setItem("music", gameData.music.toString());
            if(gameData.music === true){
                this.utils.resumeBackgroundMusic();
            }
            else{
                this.utils.stopBackgroundMusic();
            }
            this.updateMusicButtonText();
        };
        button.layer = 2;

        text.size = 20;
        text.layer = 3;

        this.musicBtnId = id;
    }

    private initSfxButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(200, 50, "", parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: "center",
            alignmentVertical: "top",
            offset: { x: 0, y: 180 }
        }));

        const textId = this.engine.getChildWithComponent(id, Text);

        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = textId ? this.em.getComponent(textId, Text) : null;

        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initSfxButtonEntity() in game.ts !");
        if (!button) throw new Error("ENTITY ACTIVE COMPONENT NOT FOUND IN initSfxButtonEntity() in game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initSfxButtonEntity() in game.ts !");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        }
        shape.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({ key: "buttonClick" });
            const gameData: GameData = this.utils.getGameData();
            gameData.sfx = !gameData.sfx;
            localStorage.setItem("sfx", gameData.sfx.toString())
            this.updateSfxButtonText();
        };
        button.layer = 2;

        text.size = 20;
        text.layer = 3;

        this.sfxBtnId = id;
    }

    private initMainMenuButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(100, 50, 'MAINMENU', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'left',
            alignmentVertical: 'bottom',
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initMainMenuButton");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initMainMenuButtonEntity() IN game.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initMainMenuButtonEntity() IN game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initMainMenuButtonEntity() IN game.ts");

        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const sceneId: EntityId | null = this.engine.getSceneByName('mainMenu');
            if (sceneId === null)
                throw new Error("SCENE ID NOT FOUND IN initMainMenuButtonEntity() IN button.onJustPressed() ! KEY: 'mainMenu' IN game.ts!");
            this.engine.loadScene(sceneId);
        };
        button.layer = 2;

        text.layer = 3;
    }

    private initUnPauseButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(100, 50, 'UNPAUSE', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'bottom',
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initUnPauseButton");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initUnPauseButtonEntity() in game.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initUnPauseButtonEntity() in game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initUnPauseButtonEntity() IN game.ts");
        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            this.togglePausePanel(false);
            const gameData: GameData = this.utils.getGameData();
            gameData.paused = false;
        };
        button.layer = 2;

        text.layer = 3;
    }

    private initRestartButtonEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectButtonEntity(100, 50, 'RESTART', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'right',
            alignmentVertical: 'bottom',
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (textId === null) throw new Error("TEXT ID NOT FOUND IN initRestartButton");
        const shape = this.em.getComponent(id, Shape);
        const button = this.em.getComponent(id, Button);
        const text = this.em.getComponent(textId, Text);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initRestartButtonEntity() in game.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initRestartButtonEntity() in game.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initRestartButtonEntity() IN game.ts");
        shape.color = 'rgb(14, 61, 171)';
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.layer = 2;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const sceneId: EntityId | null = this.engine.getSceneByName('game');
            if (sceneId === null) throw new Error("SCENE ID NOT FOUND IN initRestartButtonEntity() IN button.onJustPressed()");
            this.engine.loadScene(sceneId);
        };
        button.layer = 2;

        text.layer = 3;
    }

    // === Public Update Functions ===

    public updateMusicButtonText() {
        if (this.musicBtnId === null) return;
        const textId = this.engine.getChildWithComponent(this.musicBtnId, Text);
        if (textId === null) return;
        const text = this.em.getComponent(textId, Text);
        const gameData: GameData = this.utils.getGameData();
        if (text) text.content = gameData.music ? "Music: ON" : "Music: OFF";
    }

    public updateSfxButtonText() {
        if (this.sfxBtnId === null) return;
        const textId = this.engine.getChildWithComponent(this.sfxBtnId, Text);
        if (textId === null) return;
        const text = this.em.getComponent(textId, Text);
        const gameData: GameData = this.utils.getGameData();
        if (text) text.content = gameData.sfx ? "Sfx: ON" : "Sfx: OFF";
    }
    public togglePausePanel(value: boolean) {
        if (this.pausePanelId === null) throw new Error("PAUSE PANEL ID NOT FOUND IN togglePausePanel !");
       this.utils.setEntityActive(this.pausePanelId,value);
    };
    public togglePauseButton(value:boolean){
        if(this.pauseButtonId === null) throw new Error("PAUSE BUTTON ID NOT FOUND IN togglePauseButton() !");
        this.utils.setEntityActive(this.pauseButtonId,value);
    }
}
