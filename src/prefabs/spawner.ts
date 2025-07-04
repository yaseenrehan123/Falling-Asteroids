import { EntityTemplates, type Engine, type EntityId, type EntityManager } from "piton-engine";
import { Utils } from "../utils";
import { Spawner } from "../components";

export class SpawnerPrefab {
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
    init(): EntityId {
        const sceneId: EntityId | null = this.engine.getSceneByName('game');
        if(sceneId === null) throw new Error("SCENE ID NOT OFUND IN SPAWNER PREFAB!");
        const id: EntityId = this.entityTemplates.createEmptyEntity(sceneId);
        this.em.addComponent(id, Spawner, new Spawner({
            delay: 3
        }));
        return id;
    }
}