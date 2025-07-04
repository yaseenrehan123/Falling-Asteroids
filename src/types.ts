import type { GameoverUi } from "./ui/gameover";
import type { HealthBarUI } from "./ui/healthbar";
import type { MainMenuUi } from "./ui/mainMenu";
import type { PauseUi } from "./ui/pause";
import type { SettingsUi } from "./ui/settings";

//FUNCTION OPTIONS
export type playAudioOptions = {
    key:string,
    looped?:boolean,
    volume?:number
};
/* *NOT NEEDED CURRENTLY*
export type initSceneOptions = {
    name:string,
    onLoad?:Function,
    onUnload?:Function
};
*/
//COMPONENT OPTIONS
export type MoverOptions = {
    moveSpeed?:number,
    rotationSpeed?:number
};
export type SpawnerOptions = {
    delay?:number
};
export type UiRegistry = {
    mainMenuUi?: MainMenuUi;
    settingsUi?: SettingsUi;
    pauseUi?: PauseUi;
    healthbarUi?: HealthBarUI;
    gameoverUi?: GameoverUi;
};