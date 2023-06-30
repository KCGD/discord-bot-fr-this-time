import { red, yellow, green } from "cli-color";
import { ProcessArgs } from "../../main";

type LogType = "I" | "W" | "E"; //Info, Warning, Error

export function Log(type:LogType, debug:boolean, message:any): void {
    let _typeText:string = {"I":green("INFO"), "W":yellow("WARNING"), "E":red("ERROR")}[type];
    if(debug) {
        if(ProcessArgs.debug) { 
            console.log(`[${_typeText}]: ${message}`);
        }
    } else {
        console.log(`[${_typeText}]: ${message}`);
    }
}