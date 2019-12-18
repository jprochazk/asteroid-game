

let game_container = document.querySelector("div.game-container") ?? (()=>{throw new Error("Failed to get game container!")})();
let canvas = document.createElement("canvas");

if(game_container && canvas) {
    let span = document.createElement("span");
    span.innerHTML = "Future stuff goes here";
    span.setAttribute("style", "font-size: 20pt; width: 100%; height: 100%; text-align: center; display: block; margin: auto; margin-top: 100px;");
    game_container.appendChild(span);
}