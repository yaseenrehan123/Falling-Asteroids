import { Alignment, Button, EntityTemplates, Rectangle, Shape, Text, Transform } from "piton-engine";
import type { Engine, EntityId, EntityManager } from "piton-engine";
import { GameData } from "../components";
import { Utils } from "../utils";

export class MainMenuUi {
    private engine: Engine;
    private entityTemplates: EntityTemplates;
    private em: EntityManager;
    private utils: Utils;
    //private gameData: GameData; //NOT NEEDED CURRENTLY
    constructor(engine: Engine) {
        this.engine = engine;
        if (!engine) throw new Error("ENGINE NOT FOUND IN MAINMENUCLASS");
        this.entityTemplates = new EntityTemplates(engine);
        this.em = engine.getEntityManager();
        this.utils = new Utils(engine);
        //this.gameData = this.utils.getGameData();
    };
    init() {
        const mainMenuSceneId: EntityId | null = this.engine.getSceneByName('mainMenu');
        if (mainMenuSceneId === null)
            throw new Error("MAIN MENU SCENE ENTITY NOT FOUND IN MAINMENU UI ! " + "KEY: " + "mainMenu");
        this.initPlayButton(mainMenuSceneId);
        this.initSettingsButton(mainMenuSceneId);
        this.initQuitButton(mainMenuSceneId);
    };
    private initPlayButton(parent?: EntityId) {
        const id = this.entityTemplates.createRectButtonEntity(200, 100, 'PLAY', parent);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 30 }
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (!textId) throw new Error("CHILD TEXT ID NOT FOUND IN initPlayButton() IN mainMenu.ts")
        const shape = this.em.getComponent(id, Shape);
        const text = this.em.getComponent(textId, Text);
        const button = this.em.getComponent(id, Button);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initPlayButton() IN mainMenu.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initPlayButton() IN mainMenu.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initPlayButton() IN mainMenu.ts !");
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.color = 'rgb(14, 61, 171)';

        text.size = 30;
        text.maxWidth = 500;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const sceneId:EntityId | null = this.engine.getSceneByName('game');
            if(sceneId === null)
                 throw new Error("SCENE ID NOT FOUND IN initPlayButton() button.onJustPressed() , KEY: 'game' ")
            this.engine.loadScene(sceneId);  
        };
    };
    private initSettingsButton(parent: EntityId) {
        const id = this.entityTemplates.createRectButtonEntity(200, 100, 'SETTINGS', parent);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 250 }
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (!textId) throw new Error("CHILD TEXT ID NOT FOUND IN initSettingsButton() IN mainMenu.ts")
        const shape = this.em.getComponent(id, Shape);
        const text = this.em.getComponent(textId, Text);
        const button = this.em.getComponent(id, Button);

        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initSettingsButton() IN mainMenu.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initSettingsButton() IN mainMenu.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initSettingsButton() IN mainMenu.ts !");

        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.color = 'rgb(14, 61, 171)';

        text.size = 30;
        text.maxWidth = 500;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            const sceneId:EntityId | null = this.engine.getSceneByName('settings'); //GET SETTINGS SCENE
            if(sceneId === null)
                 throw new Error("SETTINGS SCENE ID NOT FOUND IN initSettingsButton() button.onJustPressed()");
            this.engine.loadScene(sceneId);    
        };
    };
    private initQuitButton(parent: EntityId) {
        const id = this.entityTemplates.createRectButtonEntity(200, 100, 'QUIT', parent);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 470 }
        }));
        const textId: EntityId | null = this.engine.getChildWithComponent(id, Text);
        if (!textId) throw new Error("CHILD TEXT ID NOT FOUND IN initQuitButton() IN mainMenu.ts")
        const shape = this.em.getComponent(id, Shape);
        const text = this.em.getComponent(textId, Text);
        const button = this.em.getComponent(id, Button);

        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND IN initQuitButton() IN mainMenu.ts !");
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND IN initQuitButton() IN mainMenu.ts !");
        if (!button) throw new Error("BUTTON COMPONENT NOT FOUND IN initSettingsButton() IN mainMenu.ts !");

        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
        };
        shape.color = 'rgb(14, 61, 171)';

        text.size = 30;
        text.maxWidth = 500;

        button.onJustPressed = () => {
            this.utils.playAudio({
                key: 'buttonClick'
            });
            if (confirm("Are you sure you want to quit?")) {
                console.log("GAME WINDOW QUITTED !");
                window.close();
            };
        };
    };
};