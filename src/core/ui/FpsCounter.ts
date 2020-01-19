import { UIElement } from './UIElement';

export class FpsCounter extends UIElement {
    private lastUpdate: number;

    constructor(private updateInterval: number) {
        super('div', {
            position: ["10%", "10%"]
        });

        this.element.innerHTML = '<h2>0 fps<h2>';
        this.lastUpdate = Date.now();
    }

    public update(fps: number) {
        let timeSinceLastUpdate = Date.now() - this.lastUpdate;
        if(timeSinceLastUpdate < this.updateInterval) return;

        this.element.innerHTML = `<h2>${fps.toString().split(".")[0] || fps.toString()} fps<h2>`;
        this.lastUpdate = Date.now();
    }
}