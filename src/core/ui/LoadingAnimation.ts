

export class Spinner {
    private lspinner: HTMLDivElement;

    constructor() {
        this.lspinner = document.createElement("div");
        this.lspinner.classList.add("loading-spinner");
        this.lspinner.classList.add("hidden");
        document.body.appendChild(this.lspinner);
    }

    public start() {
        this.lspinner.classList.remove("hidden");
    }

    public stop() {
        this.lspinner.classList.add("hidden");
    }
}