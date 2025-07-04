import type { MoverOptions, SpawnerOptions, UiRegistry } from "./types";

export class GameData {
    readonly defaultgameSpeed: number = 30;
    readonly maxgameSpeed: number = 300;
    readonly maxHealth: number = 3;
    readonly maxSpawners: number = 8;
    readonly spawnerIncreaseDelay: number = 60;
    public documentInteracted: boolean = false;
    public music: boolean = localStorage.getItem("music") === null ? true : localStorage.getItem("music") === "true";;
    public sfx: boolean = localStorage.getItem("sfx") === null ? true : localStorage.getItem("sfx") === "true";
    public gameSpeed: number = 30;
    public paused: boolean = false;
    public backgroundMusicInstance: HTMLAudioElement | null = null;
    public difficultyChangeDelay: number = 5;
    public difficultyChangeCounter: number = this.difficultyChangeDelay;
    public gameSpeedChangeRate: number = 5;
    public health: number = this.maxHealth;
    public spawnerCount: number = 1;
    public spawnerIncreaseCount: number = this.spawnerIncreaseDelay;
    public gameOver:boolean = false;
    public uiRegistry:UiRegistry = {};
    public onGameoverFn:Function = ()=>{};
    public score:number = 0;
    public highestScore:number = Number(localStorage.getItem("highestScore")) || 0;
};
export class Spawner {
    public counter: number = 0;
    public delay: number = 0;
    constructor(options: SpawnerOptions) {
        this.delay = options.delay ?? 0;
        //this.counter = this.delay;
    }
};
export class Mover {
    public moveSpeed: number = 0;
    public rotationSpeed: number = 0;
    constructor(options: MoverOptions) {
        this.moveSpeed = options.moveSpeed ?? 0;
        this.rotationSpeed = options.rotationSpeed ?? 0;
    }
}
export class Unit { } //TAG COMPONENT
export class HealthBar { } //TAG COMPONENT
export class HarmfulOnPass { } //TAG COMPONENT