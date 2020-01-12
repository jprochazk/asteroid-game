import { Game } from "./core/Game";

const container: HTMLDivElement = document.querySelector(".game-container") || (()=>{throw new Error("Failed to find game container")})();
const game = new Game(container);

game.run();