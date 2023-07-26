import * as fs from 'fs';
import { dirname } from 'path';
import { ErrorCode } from './errors';
import { execSync } from 'child_process';


//function to create a fifo pipe
export type createFifoOpts = {
    overwrite?:boolean;
    recursive?:boolean;
}
export function CreateFifo(path:string, options?:createFifoOpts): ErrorCode | void {
    if(fs.existsSync(path)) {
        if(options?.overwrite) {
            fs.unlinkSync(path);
        }

        mkfifo(path);
    } else {
        if(!fs.existsSync(dirname(path))) {
            fs.mkdirSync(dirname(path), {'recursive':options?.recursive});
        }

        mkfifo(path);
    }
}

//helper to CreateFifo
function mkfifo(path:string): void {
    execSync(`mkfifo "${path}"`);
}