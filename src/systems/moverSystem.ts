import { Sprite, Transform } from "piton-engine";
import type { Engine,EntityManager, Vector2 } from "piton-engine";
import { GameData, HarmfulOnPass, Mover } from "../components";
import { Utils } from "../utils";

export function moverSystem(engine:Engine){
    const utils:Utils = new Utils(engine);
    const gameData:GameData = utils.getGameData();
    if(gameData.paused) return;
    const em:EntityManager = engine.getEntityManager();
    const deltaTime:number = engine.getDeltaTime();
    const canvasBounds:Vector2 = engine.getCanvasBounds();
    em.query('All',{
        mover:Mover,
        transform:Transform,
        sprite:Sprite
    },(id,{mover,transform,sprite})=>{
        if(!engine.isEntityActive(id)) return;
        const pos:Vector2 = transform.globalPosition.position;
        pos.y += mover.moveSpeed * deltaTime;
        sprite.rotation += mover.rotationSpeed * deltaTime;
        if(pos.y > (canvasBounds.y + 50)){ //ENTITY HAS GONE OFF SCREEN
            if(em.getComponent(id,HarmfulOnPass)){
                utils.subtractHealth();
            }
            setTimeout(()=>{
                em.removeEntity(id)
            },0);
        }
    });
};