import { Log } from './util/debug';
import { bgYellow } from 'cli-color';
import { Client, Events, GatewayIntentBits } from 'discord.js';


//var for client status
let clientReady:boolean = false;


//create client object
export const client:Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates], });


//export getter for client status
export function ClientIsReady(): boolean {
    return clientReady;
}


//client login function
export function Login(token:string): boolean {
    client.login(token);
    return true;
}


//client login event listener
client.once(Events.ClientReady, c => {
    Log(`I`, false, `Logged in as ${c.user.tag}`);

    //log testing warning message
    if(c.user.tag.includes("TESTING")) {
        Log(`W`, false, bgYellow(`
        
          WARNING: BOT IN TESTING MODE  
        `));
    }
});