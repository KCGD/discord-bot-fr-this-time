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
type StartResponse = {
    c:string;
    status: "up" | "working";
    msg?:string;
    worldName?:string;
    version?:string;
    code?:string; //only exists on api-type responses (server already running)
}

export interface StatusCallback {(error:ErrorCode|null, response:StatusResponse|null): any}
export interface StartCallback {(error:ErrorCode|null, response:StartResponse|null, phase:"confirm"|"complete"): any}


//status command
export function GetEndpointStatus(endpoint:string, callback:StatusCallback): any {
    Log(`I`, true, `Getting server status ...`);

    //timing vars
    let d1:number, d2:number, d3:number = 0;

    const socket:WebSocket = new WebSocket(endpoint);
    Log(`I`, true, `\tConnecting to endpoint "${endpoint}" ...`);

    //socket onopen event - send api request
    socket.onopen = function(): void {
        Log(`I`, true, `\tSending status request ...`);

        socket.send(JSON.stringify({
            "c":"getStatus",
            "isApi":true
        }))

        //log time
        d1 = Date.now();
    }

    //socket recieve events - processing output
    socket.onmessage = function(message): void {
        d2 = Date.now();
        Log(`I`, true, `\tRecieved status. Response took ${d2-d1}ms`);

        //add try-parse, switch based on command responses
        let response:StatusResponse|null = null;

        //try parsing the server's response. If parse fails, return an error
        try {
            response = JSON.parse(message.data.toString()) as StatusResponse;
            Log(`I`, true, `\tResponse parsed successfully`);
            callback(null, response);
        } catch (e) {
            Log(`E`, false, `\tFailed to parse endpoint response data, ${e}`);
            callback("PARSE_RESPONSE_FAILED", null);
        }

        //close socket after operations complete
        if(socket.OPEN) {
            socket.close();
        }
    }
}


//start command
export function StartEndpointServer(endpoint:string, callback:StartCallback): any {
    Log(`I`, true, `Starting server ...`);

    //timing vars
    let d1:number, d2:number, d3:number;

    const socket:WebSocket = new WebSocket(endpoint);
    Log(`I`, true, `\tConnecting to endpoint "${endpoint}" ...`);

    //socket onopen event - send api request
    socket.onopen = function(): void {
        Log(`I`, true, `\tSending start request ...`);

        socket.send(JSON.stringify({
            "c":"start",
            "isApi":true
        }))

        //log time
        d1 = Date.now();
    }

    //socket recieve events - processing output
    socket.onmessage = function(message): void {
        //add try-parse, switch based on command responses
        let response:StartResponse|null = null;

        //try parsing the server's response. If parse fails, return an error
        try {
            response = JSON.parse(message.data.toString()) as StartResponse;
            Log(`I`, true, `\tResponse parsed successfully`);

            //diverge based on server status
            if(response.c === "start") {
                if(response.status === "working") {
                    //server still starting
                    d2 = Date.now();
                    Log(`I`, true, `\tRecieved start confirmation. Response took ${d2-d1}ms`);
                    callback(null, response, "confirm");
                } else if(response.status === "up") {
                    //server is up, no further interaction. close socket
                    d3 = Date.now();
                    Log(`I`, true, `\tServer started. Took ${d3-d1}ms`)
                    callback(null, response, "complete");
                    if(socket.OPEN) {
                        socket.close();
                    }
                }
            } else if (response.c === "api") {
                if(response.code === "RUNNING") {
                    //server is already running, close socket
                    callback("SERVER_ALREADY_UP", null, "confirm");
                    if(socket.OPEN) {
                        socket.close();
                    }
                }
            }
        } catch (e) {
            Log(`E`, false, `\tFailed to parse endpoint start data, ${e}`);
            callback("PARSE_RESPONSE_FAILED", null, "confirm");
            if(socket.OPEN) {
                socket.close();
            }
        }
    }
}