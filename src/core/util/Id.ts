
export enum IdType {
    Shader = "shader", 
    Texture = "texture", 
    Model = "model"
}

export class IdSequence {
    private constructor() {}

    private static shaderIdCounter: number = 0;
    private static textureIdCounter: number = 0;
    private static modelIdCounter: number = 0;

    public static nextId(name: IdType): number {
        switch(name) {
            case IdType.Shader: return this.shaderIdCounter++;
            case IdType.Texture: return this.textureIdCounter++;
            case IdType.Model: return this.modelIdCounter++;
        }
    }
}