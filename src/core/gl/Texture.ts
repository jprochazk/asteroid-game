import { ThrowAnywhere } from 'core/exception/Exception';
import { UUID } from 'core/util/UUID';
import { GL } from 'core/gl/Context';
import { AssetManager } from "core/io/AssetManager";

/**
 * Options for sampling a texture  
 * There are more but these are the basic, required ones
 */
export interface TextureOptions {
    wrap_s: number,
    wrap_t: number
    min_filter: number,
    mag_filter: number
}

export class Texture {
    private id: UUID;
    private img: HTMLImageElement;
    private texture: WebGLTexture;

    constructor(path: string, options?: TextureOptions) {
        this.texture = GL.context.createTexture() || ThrowAnywhere("Failed to create WebGL texture!");
        
        let default_image: HTMLImageElement = document.querySelector("#missing") || ThrowAnywhere("Failed to select default texture!");
        this.img = default_image;
        // initialize this texture with the default one
        this.texture = this.initTexture(this.texture, this.img, options);

        // then load the image asset, and replace the default texture with it on promise resolution
        AssetManager.loadImage(path)
        .then(img => {
            this.img = img;
            this.texture = this.initTexture(this.texture, this.img, options);
        }).catch(err => {
            console.error(err);
        })

        this.id = new UUID();
    }

    public getHandle(): WebGLTexture { return this.texture; }

    /**
     * Initialize a WebGLTexture object (pre-created)
     */
    private initTexture(texture: WebGLTexture, image: HTMLImageElement, options?: TextureOptions): WebGLTexture {
        GL.context.bindTexture(GL.context.TEXTURE_2D, texture);
        GL.context.texImage2D(GL.context.TEXTURE_2D, 0, GL.context.RGBA, GL.context.RGBA, GL.context.UNSIGNED_BYTE, image);
        GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_S, options?.wrap_s || GL.context.REPEAT);
        GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_WRAP_T, options?.wrap_t || GL.context.REPEAT);
        GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MIN_FILTER, options?.min_filter || GL.context.NEAREST);
        GL.context.texParameteri(GL.context.TEXTURE_2D, GL.context.TEXTURE_MAG_FILTER, options?.mag_filter || GL.context.NEAREST);
        GL.context.generateMipmap(GL.context.TEXTURE_2D);
        GL.context.bindTexture(GL.context.TEXTURE_2D, null);

        return texture;
    }
}