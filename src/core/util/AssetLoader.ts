import { Shader } from './../gl/shader/Shader';
import { GeometryParser } from './../gl/Mesh';
import { VertexLayout } from './../gl/shader/reflection/VertexLayout';
import { VertexArrayBuffer, VertexBuffer } from './../gl/shader/Buffer';

/**
 * Helper function to determine whether a given path has a specific extension.
 * @param path any url string
 * @param extension the exact extension to check for (can be with or without the dot)
 */
const hasExtension = (path:string, extension:string) => path.substr(path.length-extension.length, path.length) === extension;

export namespace Assets {

    /**
     * Loads an image from a file
     * @param path url to image (can supply absolute url)
     */
    export function loadImage(path: string): Promise<HTMLImageElement> {
        if(!hasExtension(path, ".png") && !hasExtension(path, ".jpg") && !hasExtension(path, ".jpeg") && !hasExtension(path, ".gif")) {
            throw new Error(`${path} does not have extension known extension! (.png / .jp(e)g / .gif)`);
        }

        return new Promise((resolve,reject) => {
            const img = new Image();

            img.onload = () => resolve(img);
            img.onerror = () => reject("Failed to fetch image!");

            img.src = path;
        })
    }

    /**
     * Loads a .glsl file and builds a shader from it
     * @param path url to .glsl file (can supply absolute url)
     */
    export function loadShader(path: string): Promise<Shader> {
        if(!hasExtension(path, ".glsl")) {
            throw new Error(`${path} does not have .glsl extension!`);
        }

        return new Promise((resolve, reject) => {
            console.log(`loading ${path}`);

            let request = new XMLHttpRequest();
            request.open('GET', path);

            request.onreadystatechange = (e) => {
                if(request.readyState === XMLHttpRequest.DONE) {
                    resolve(Shader.build(request.response));
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
    export function loadObj(layout: VertexLayout, path: string): Promise<VertexArrayBuffer> {
        if(!hasExtension(path, ".obj")) {
            throw new Error(`${path} does not have .obj extension!`);
        }

        return new Promise((resolve, reject) => {
            console.log(`loading ${path}`);

            let request = new XMLHttpRequest();
            request.open('GET', path);

            request.onreadystatechange = (e) => {
                if(request.readyState === XMLHttpRequest.DONE) {

                    let geometry = GeometryParser.parse(request.response);
                    let vbuffer = VertexBuffer.build(geometry, layout);
                    let VAB = VertexArrayBuffer.build(vbuffer);

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