import { Button, EntityTemplates, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { HarmfulOnPass, Mover, Unit } from "../components";
import { Utils } from "../utils";

export class Asteroid3Prefab {
    private engine: Engine;
    private em: EntityManager;
    private entityTemplates: EntityTemplates;
    private utils: Utils;
    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        this.entityTemplates = new EntityTemplates(engine);
        this.utils = new Utils(engine);
    };
    init() {
        const gameData = this.utils.getGameData();
        const sceneId: EntityId | null = this.engine.getSceneByName('game');
        if (sceneId === null) throw new Error("SCENE ID NOT FOUND IN Asteroid1Prefab")
        const img: HTMLImageElement = this.engine.getImage('asteroid3');
        const id: EntityId = this.entityTemplates.createSpriteEntity(img, 64, 64, sceneId);
        this.em.addComponent(id, Button, new Button({
            //showPressArea:true,
            pressArea: { x: 70, y: 70 },
            onJustPressed: () => {
                this.utils.playAudio({
                    key: "explosion"
                });
                this.utils.updateScore();
                //setTimeout(() => {
                    this.em.removeEntity(id);
                //}, 0)
            }
        }));
        this.em.addComponent(id, Mover, new Mover({
            moveSpeed: gameData.gameSpeed,
            rotationSpeed: gameData.gameSpeed
        }));
        this.em.addComponent(id, Unit, new Unit());
        this.em.addComponent(id, HarmfulOnPass, new HarmfulOnPass());
        return id;
    };
};