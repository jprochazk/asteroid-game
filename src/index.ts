

let game_container = document.querySelector("div.game-container") ?? (()=>{throw new Error("Failed to get game container!")})();
let canvas = document.createElement("canvas");
game_container.appendChild(canvas);