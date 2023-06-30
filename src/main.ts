import * as fs from 'fs';
import * as path from "path";
import * as process from "process";


//import from discord library
import {client, ClientIsReady, Login} from './lib/discord';


//debug lib imports
import { Log } from './lib/util/debug';
import { Events } from 'discord.js';


//define process args type
export type processArgs = {
    showHelpDoc:boolean;
    debug:boolean;
}
//define object for process arguments
export var ProcessArgs:processArgs = {
    "showHelpDoc":false,
    "debug":true,
}


//read api key and endpoint from env. export from main
export const Token:string | undefined = process.env.DISCORD_BOT_API_KEY;
export const Endpoint:string | undefined = process.env.MC_SERVER_ENDPOINT;


//parse process arguments
for(let i = 0; i < process.argv.length; i++) {
    switch(process.argv[i]) {
        case "--help":
        case "-h": {
            ProcessArgs.showHelpDoc = true;
        } break;
    }
}


//main function
Main();
function Main(): void {
    if(ProcessArgs.showHelpDoc) {
        console.log(fs.readFileSync("./src/assets/helpdoc").toString());
        process.exit(0);
    }

    //log relevant info if debug enabled
    Log(`I`, true, `API: Use API key "${Token}"`);
    Log(`I`, true, `Endpoint: Use endpoint "${Endpoint}"`);

    //ensure existance of relevent vars
    if(Token && Endpoint) {
        Log(`I`, false, `Attempt login ...`);
        Login(Token);

        //client onready handler
        client.on('ready', function(): void {
            Log(`I`, false, `Client Ready`);

            //register client commands
            Log(`I`, false, `Registering client commands ...`);
        })
    } else {
        //handle non existant token and/or endpoint vars
    }
}