import * as fs from 'fs';
import * as path from "path";
import * as process from "process";


//import from discord library
import {client, ClientIsReady, Login} from './lib/discord';


//debug lib imports
import { Log } from './lib/util/debug';
import { Collection, Events, REST, Routes } from 'discord.js';


//command imports
import * as PingCommand from './commands/ping'


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


//global command store because the one discordjs makes you use is really weird
let globalCommands = {};

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
            //@ts-ignore - ignored the following line due to nonexistant property error. This is exactly how they do it in the docs so it should be ok.
            client.commands = [];
            let commandFiles:string[] = fs.readdirSync(path.join(__dirname, "./commands"));

            for(let i = 0; i < commandFiles.length; i++) {
                if(path.extname(commandFiles[i]) === ".js") {
                    let thisCommandPath:string = path.join(__dirname, "./commands", commandFiles[i]);
                    Log(`I`, true, `Registering ${path.basename(commandFiles[i])} from "${thisCommandPath}"`);
                    let command = require(path.join(__dirname, "./commands", commandFiles[i])).MainCommand;
                    //@ts-ignore
                    client.commands.push(command.data.toJSON());
                    //@ts-ignore
                    globalCommands[command.data.name] = require(path.join(__dirname, "./commands", commandFiles[i])).MainCommand;
                }
            }

            //publish commands
            const rest = new REST().setToken(Token);
                try {
                    Log(`I`, false, `Publishing slash commands ...`);
                    if(client.user?.id) {
                        const data = rest.put(
                            Routes.applicationCommands(client.user?.id),
                            //@ts-ignore - i fucking hate this library so much...
                            { body: client.commands },
                        );
                        Log(`I`, false, `Commands registered`);
                    } else {
                        throw "Client user id is null";
                    }
                } catch (e) {
                    Log(`E`, false, `Publishing failed: ${e}`);
                }

            //do client commands???
            client.on(Events.InteractionCreate, async interaction => {
                //@ts-ignore
                globalCommands[interaction.commandName].execute(interaction)
            })
        })
    } else {
        //handle non existant token and/or endpoint vars
    }
}