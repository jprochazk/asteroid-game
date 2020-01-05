
/**
 * RFC4122-compliant UUID  
 * credit: https://stackoverflow.com/a/8809472/11953579
 * 
 * Reliant on current time. Collision every 10000 years.
 * It is only used internally by the client and any UUIDs
 * are erased on each page refresh, and generated from scratch.
 */
export class UUID {
    private stringValue: string;
    
    constructor() {
        var d = new Date().getTime();//Timestamp
        var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        
        this.stringValue = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    public toString() {
        return this.stringValue;
    }
}