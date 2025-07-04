import { Transform, type Engine, type EntityId, type EntityManager, type Vector2 } from "piton-engine";
import { GameData, Spawner } from "../components";
import { Asteroid1Prefab } from "../prefabs/asteroid1";
import { Asteroid2Prefab } from "../prefabs/asteroid2";
import { Asteroid3Prefab } from "../prefabs/asteroid3";
import { PotionPrefab } from "../prefabs/potion";
import { Utils } from "../utils";

export function spawnerSystem(engine: Engine) {
    const utils: Utils = new Utils(engine);
    const gameData: GameData = utils.getGameData();
    if (gameData.paused) return;
    const em: EntityManager = engine.getEntityManager();
    const deltaTime: number = engine.getDeltaTime();
    em.query('All', {
        spawner: Spawner
    }, (id, { spawner }) => {
        if (!engine.isEntityActive(id)) return;
        if (spawner.counter <= 0) {
            const canvasBounds: Vector2 = engine.getCanvasBounds();
            const spawnPos: Vector2 = {
                x: engine.getRandomFloat(0, canvasBounds.x),
                y: -50
            };
            const spawnPool = [
                { class: Asteroid1Prefab, weight: 2 },
                { class: Asteroid2Prefab, weight: 2 },
                { class: Asteroid3Prefab, weight: 2 },
                { class: PotionPrefab, weight: 1 }
            ];
            const selected = pickWeighted(spawnPool);
            const prefab = new selected.class(engine);
            const id: EntityId = prefab.init();
            const transform = em.getComponent(id, Transform);
            if (!transform) throw new Error("TRANSFORM NOT FOUND IN spawnerSystem() , ID: " + id + "PREFAB: " + prefab);
            transform.globalPosition.position = spawnPos;
            spawner.counter = spawner.delay;
        }
        else {
            spawner.counter -= deltaTime;
        }
    });
};
//HELPER!
function pickWeighted<T extends { weight: number }>(pool: T[]): T {
    const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
    let r = Math.random() * totalWeight;

    for (const item of pool) {
        if (r < item.weight) return item;
        r -= item.weight;
    }

    // Fallback (should never hit unless totalWeight is 0)
    return pool[pool.length - 1];
}