import { WebSocket } from "ws";
import { Log } from "./debug";
import { ProcessArgs } from "../../main";


//define types
type StatusResponse = {
    c:string;
    result: {
        version:string;
        worldName:string;
        type:string;
        processExists:false;
        childWritable:boolean;
        players:any[];
    }
}


//status command
export function GetEndpointStatus(endpoint:string): any {
    const socket:WebSocket = new WebSocket(endpoint);
    Log(`I`, ProcessArgs.debug, `Connecting to endpoint "${endpoint}" ...`);

    //socket onopen event - send api request
    socket.onopen = function(): void {
        Log(`I`, ProcessArgs.debug, `Sending status request ...`);
        socket.send(JSON.stringify({
            "c":"getStatus",
            "isApi":true
        }))
    }

    //socket recieve events - processing output
    socket.onmessage = function(message): void {
        //add try-parse, switch based on command responses
        console.log(JSON.parse(message.data.toString()));
        socket.close();
    }
}