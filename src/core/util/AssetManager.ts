import { Shader } from './../gl/shader/Shader';
import { MeshBuilder } from './../gl/Mesh';
import { VertexLayout } from './../gl/shader/reflection/VertexLayout';
import { VertexArrayBuffer, VertexBuffer, IndexBuffer } from './../gl/shader/Buffer';

/**
 * Helper function to determine whether a given path has a specific extension.
 * @param path any url string
 * @param extension the exact extension to check for (can be with or without the dot)
 */
const hasExtension = (path:string, extension:string) => path.substr(path.length-extension.length, path.length) === extension;

export class AssetManager {
    private static loadedImages: Map<string, HTMLImageElement>;
    private static loadedShaders: Map<string, Shader>;
    private static loadedGeometry: Map<string, VertexArrayBuffer>;

    public static init() {
        this.loadedImages = new Map();
        this.loadedShaders = new Map();
        this.loadedGeometry = new Map();
    }
    private constructor() {}

    /**
     * Loads an image from a file
     * @param path url to image (can supply absolute url)
     */
    public static loadImage(path: string): Promise<HTMLImageElement> {
        console.log(`loading ${path}`);
        if(!hasExtension(path, ".png") && !hasExtension(path, ".jpg") && !hasExtension(path, ".jpeg") && !hasExtension(path, ".gif")) {
            throw new Error(`${path} does not have extension known extension! (.png / .jp(e)g / .gif)`);
        }

        if(this.loadedImages.has(path)) {
            return new Promise(resolve => resolve(this.loadedImages.get(path)));
        }

        return new Promise((resolve,reject) => {
            const img = new Image();

            img.onload = () => {
                this.loadedImages.set(path, img);
                resolve(img);
            }
            img.onerror = () => reject("Failed to fetch image!");

            img.src = path;
        })
    }

    /**
     * Loads a .glsl file and builds a shader from it
     * @param path url to .glsl file (can supply absolute url)
     */
    public static loadShader(path: string): Promise<Shader> {
        console.log(`loading ${path}`);
        if(!hasExtension(path, ".glsl")) {
            throw new Error(`${path} does not have .glsl extension!`);
        }

        if(this.loadedShaders.has(path)) {
            return new Promise(resolve => resolve(this.loadedShaders.get(path)));
        }

        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', path);

            request.onreadystatechange = (e) => {
                if(request.readyState === XMLHttpRequest.DONE) {
                    let shader = Shader.build(request.response);
                    this.loadedShaders.set(path, shader);
                    resolve(shader);
                }
            }

            request.onerror = (e) => {
                console.log(`failed to load ${path}`);
                reject(request.response);
            }

            request.send();
        });
    }

    /**
     * Loads and builds a vertex array buffer from a .obj file
     * @param layout vertex layout to check against
     * @param path url to a .obj file (can supply absolute url)
     */
    public static loadObj(layout: VertexLayout, path: string): Promise<VertexArrayBuffer> {
        console.log(`loading ${path}`);
        if(!hasExtension(path, ".obj")) {
            throw new Error(`${path} does not have .obj extension!`);
        }

        if(this.loadedGeometry.has(path)) {
            return new Promise(resolve => resolve(this.loadedGeometry.get(path)));
        }

        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', path);

            request.onreadystatechange = (e) => {
                if(request.readyState === XMLHttpRequest.DONE) {
                    let geometry = MeshBuilder.parse(request.response);
                    let vbuffer = VertexBuffer.build(geometry.vertexBuffer, layout);
                    let ibuffer = IndexBuffer.build(geometry.indexBuffer);
                    let VAB = VertexArrayBuffer.build(vbuffer, ibuffer);

                    this.loadedGeometry.set(path, VAB);
                    resolve(VAB);
                }
            }

            request.onerror = (e) => {
                console.log(`failed to load ${path}`);
                reject(request.response);
            }

            request.send();
        })
    }
    
}