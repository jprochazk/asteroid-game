
export interface SupportedHTMLElementTagMap {
    "a": HTMLAnchorElement;
    "button": HTMLButtonElement;
    "div": HTMLDivElement;
    "iframe": HTMLIFrameElement;
    "img": HTMLImageElement;
    "input": HTMLInputElement;
    "select": HTMLSelectElement;
    "textarea": HTMLTextAreaElement;
}

export abstract class UIElement {
    protected element: HTMLElement;

    constructor(
        type: keyof SupportedHTMLElementTagMap, 
        options?: {
            classes?: string[], 
            position?: [number|string,number|string],
            parent?: HTMLElement
        }
    ) {
        this.element = document.createElement(type);

        if(!options) return;

        if(options.classes) {
            options.classes.forEach(c => this.element.classList.add(c));
        }
        
        if(options.parent) {
            options.parent.appendChild(this.element);
            console.warn(`found parent ${options.parent}, position ${options.position} ignored`);
        } else {
            document.body.appendChild(this.element);
            this.element.classList.add("floating");
            if(options.position) {
                this.element.style.left = options.position[0].toString();
                this.element.style.top = options.position[1].toString();
            }
        }
    }

    public setPosition(position: [number,number]) {
        this.element.style.left = position[0].toString();
        this.element.style.top = position[1].toString();
    }

    public show() {
        this.element.hidden = false;
    }

    public hide() {
        this.element.hidden = true;
    }
}