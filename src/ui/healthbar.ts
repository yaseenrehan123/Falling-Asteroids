import { Alignment, EntityTemplates, Sprite, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { Utils } from "../utils";
import { HealthBar } from "../components";

export class HealthBarUI {
    private engine: Engine;
    private em: EntityManager;
    private entityTemplates: EntityTemplates;
    private utils:Utils;
    constructor(engine: Engine) {
        this.engine = engine;
        this.em = engine.getEntityManager();
        this.entityTemplates = new EntityTemplates(engine);
        this.utils = new Utils(engine);
    };
    init() {
        const sceneId:EntityId | null = this.engine.getSceneByName('game');
        if(sceneId === null) throw new Error("SCENE ID NOT FOUND IN HEALTHBAR PREFAB!");
        const img:HTMLImageElement = this.utils.getHealthBarImage();
        const id:EntityId = this.entityTemplates.createSpriteEntity(img,64,64,sceneId);
        this.em.addComponent(id,Alignment,new Alignment({
            alignmentHorizontal:'left',
            alignmentVertical:'top'
        }));
        this.em.addComponent(id,HealthBar,new HealthBar());
        const sprite = this.em.getComponent(id,Sprite);
        if(!sprite) throw new Error("SPRITE NOT FOUND IN HEALTHBAR PREFAB");
        sprite.layer = 1;
    };
}