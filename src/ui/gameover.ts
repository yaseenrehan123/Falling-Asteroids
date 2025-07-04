import { Alignment, Button, EntityActive, EntityTemplates, Rectangle, Shape, Text, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { Utils } from "../utils";
import type { GameData } from "../components";

export class GameoverUi {
    private engine: Engine;
    private em: EntityManager;
    private entityTemplates: EntityTemplates;
    private utils: Utils;

    private gameoverPanelId: EntityId | null = null;
    private scoreTextId: EntityId | null = null;
    private highestScoreTextId: EntityId | null = null;
    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        this.entityTemplates = new EntityTemplates(engine);
        this.utils = new Utils(engine);
    };
    public init() {
        const sceneId: EntityId | null = this.engine.getSceneByName('game');
        if (sceneId === null) throw new Error("SCENE ID NOT FOUND IN GAMEOVER UI!");
        this.initPanelEntity(sceneId);
    };
    private initPanelEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createRectangleEntity(400, 400, parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'middle'
        }));
        const shape = this.em.getComponent(id, Shape);
        const entityActive = this.em.getComponent(id, EntityActive);
        if (!shape) throw new Error("SHAPE COMPONENT NOT FOUND!");
        if (!entityActive) throw new Error("ENTITY ACTIVE COMPONENT NOT FOUND!");

        shape.color = 'rgb(17, 39, 89)';
        shape.layer = 1;
        const rect = shape.shape;
        if (rect instanceof Rectangle) {
            rect.rounded = true;
            rect.roundedRadius = 10;
        };

        entityActive.value = false;

        this.gameoverPanelId = id;

        this.initGameoverTextEntity(id);
        this.initScoreTextEntity(id);
        this.initHighestScoreTextEntity(id);
        this.initMainMenuButtonEntity(id);
        this.initRestartButtonEntity(id);
    };
    private initGameoverTextEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createTextEntity('GAMEOVER', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 10 }
        }));
        const text = this.em.getComponent(id, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND!");
        text.size = 50;
        text.maxWidth = 500;
        text.layer = 2;
    };
    private initScoreTextEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createTextEntity('SCORE:10', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 100 }
        }));
        const text = this.em.getComponent(id, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND!");
        text.size = 30;
        text.maxWidth = 500;
        text.layer = 2;

        this.scoreTextId = id;
    };
    private initHighestScoreTextEntity(parentId: EntityId) {
        const id: EntityId = this.entityTemplates.createTextEntity('HIGHEST SCORE: 10', parentId);
        this.em.addComponent(id, Alignment, new Alignment({
            alignmentHorizontal: 'center',
            alignmentVertical: 'top',
            offset: { x: 0, y: 200 }
        }));
        const text = this.em.getComponent(id, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND!");
        text.size = 30;
        text.maxWidth = 500;
        text.layer = 2;

        this.highestScoreTextId = id;
    };
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
    };
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
    //PUBLIC FNS
    public toggleGameoverPanel(value: boolean) {
        if (this.gameoverPanelId === null) throw new Error("GAMEOVERPANEL ID NOT FOUND IN toggleGameoverPanel() !");
        this.utils.setEntityActive(this.gameoverPanelId, value);
    };
    public updateScoreText() {
        if (this.scoreTextId === null) throw new Error("SCORE TEXT ID NOT FOUND IN updateScoreText() !");
        const gameData: GameData = this.utils.getGameData();
        const text = this.em.getComponent(this.scoreTextId, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND!");
        text.content = `SCORE: ${gameData.score}`;
    };
    public updateHighestScoreText() {
        if (this.highestScoreTextId === null) throw new Error("SCORE TEXT ID NOT FOUND IN updateScoreText() !");
        const gameData: GameData = this.utils.getGameData();
        const text = this.em.getComponent(this.highestScoreTextId, Text);
        if (!text) throw new Error("TEXT COMPONENT NOT FOUND!");
        text.content = `HIGHEST SCORE: ${gameData.highestScore}`;
    };

}