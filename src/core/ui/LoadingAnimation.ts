import { UIElement } from "./UIElement";


export class Spinner extends UIElement {

    constructor() {
        super('div', {
            classes: ["loading-spinner"]
        });
    }
}