/* 
    minecraftServer.ts

    this library handles interactions with the minecraft server directly (via API over websocket),
    and has two functions:
        GetEndpointStatus - retrievs the current status of the minecraft server and returns either a StatusResponse object (given the operation succeeded) or an error code detailing what went wrong.
        StartEndpointServer - sends a command to the minecraft server to start the actual minecraft server.   
    This library only interacts with the minecraft servers' API and returns data elsewhere.
    All discord interactions should be handled elsewhere.
*/

import { WebSocket } from "ws";
import { Log } from "./debug";
import { ProcessArgs } from "../../main";
import { ErrorCode } from "./errors";


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

export interface StatusCallback {(error:ErrorCode|null, response:StatusResponse|null): any}


//status command
export function GetEndpointStatus(endpoint:string, callback:StatusCallback): any {
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
        let response:StatusResponse|null = null;

        //try parsing the server's response. If parse fails, return an error
        try {
            response = JSON.parse(message.data.toString()) as StatusResponse;
            callback(null, response);
        } catch (e) {
            Log(`E`, false, `Failed to parse endpoint response data, ${e}`);
            callback("PARSE_RESPONSE_FAILED", null);
        }

        //close socket after operations complete
        if(socket.OPEN) {
            socket.close();
        }
    }
}