import * as fs from 'fs';
import { join } from "path";
import { temp } from "../main";
import { Log } from "./util/debug";
import { CreateFifo } from "./util/fifo";
import { ErrorCode } from "./util/errors";
import { PassThrough } from "stream";
import { CommandInteraction, VoiceBasedChannel, VoiceState } from "discord.js";
import { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnection, AudioResource, AudioPlayer } from '@discordjs/voice';


//type definitions
//from youtube
export type Song = {
    name:string;
    thumbnail:string; //url
    url:string; //youtube url
    searchPhrase?:string;
}

/* 
    TODO:
        audio system functional! make input functionality (through slash command)
        [MAKE SURE yt-dlp OUTPUTS TO THE AUDIOSYSTEM's FIFO]
*/

//audio system object (per-guild)
/* 
    Here's how this works:
        connection: this is the actual connection to the vc (returned from joinVoiceChat())
        channel: this is the channel of the voice chat
        stream: (INPUT) this is a passthrough stream that gets routed to the resource object. stream general input to this
        fifo: the path to the audiosystem's fifo path. This gets piped into the stream when Init is called. file based inputs (yt-dlp) should write to this. It's essentially a file-based extension of the stream property.
        resource: audioresource created for player.
        player: the final destination of all the audio. this is what is passed directly to the vc
        queue: the song queue
    
    all properties will be undefined initially (except for queue and stream which can be initialized as empty). these become defined once InitVoice() is called with a reference to said audiosystem
*/


export type AudioSystem = {
    connection:VoiceConnection | undefined;
    channel:VoiceBasedChannel | undefined;
    stream:PassThrough;
    fifo:string | undefined;
    fifoRead:fs.ReadStream | undefined;
    resource:AudioResource | undefined;
    player:AudioPlayer | undefined;
    queue: Song[];
}


//guild systems assignable object
export let AudioGuilds: {[key:string]: AudioSystem} = {}


//create AudioSystem for a guild. 
export function CreateAudioSystem(guildID:string): void {
    if(!AudioGuilds[guildID]) {
        AudioGuilds[guildID] = {
            connection: undefined,
            channel: undefined,
            stream: new PassThrough(),
            fifo: undefined,
            fifoRead: undefined,
            resource: undefined,
            player: undefined,
            queue: []
        };
    }
}


//join vc function. Makes bot join the voice chat, returns channel and connection objects OR error
interface joinVcCallback {(error:ErrorCode | undefined, channel?:VoiceBasedChannel, connection?: VoiceConnection, errorString?:string): void};
export function JoinVc(interaction:CommandInteraction, callback:joinVcCallback): void {
    //const voiceState:VoiceState|undefined = interaction.guild?.voiceStates.cache.get(interaction.user.id);
    interaction.guild?.members.fetch(interaction.user.id).then((member) => {
        const voiceState:VoiceState|undefined = member.voice;

        //check if channel is a voice channel
        if(!voiceState || !voiceState.channel) {
            Log("E", true, `Failed to join channel (code: CHANNEL_NOT_VC)`);
            callback("CHANNEL_NOT_VC");
            return;
        }

        //attempt to join channel
        try {
            const connection = joinVoiceChannel({
                'channelId': voiceState.channel.id,
                'guildId': voiceState.channel.guild.id,
                'adapterCreator': voiceState.channel.guild.voiceAdapterCreator
            })

            callback(undefined, voiceState.channel, connection);
        } catch (e) {
            callback("JOIN_VC_FAILED", undefined, undefined, String(e));
        }
    })
}


//function to initialize the stream setup
//works on the global AudioGuilds object
export function InitVoice(sysId:string, channel?:VoiceBasedChannel, connection?:VoiceConnection): ErrorCode | void {
    if (AudioGuilds[sysId]) {
        if (!AudioGuilds[sysId].resource && !AudioGuilds[sysId].player) {
            //assign the relevant connection and channel if applicable
            AudioGuilds[sysId].channel = channel;
            AudioGuilds[sysId].connection = connection;

            //initialize the audio resource with passthrough stream as input
            AudioGuilds[sysId].resource = createAudioResource(
                AudioGuilds[sysId].stream, 
            );

            //initialize the fifo
            AudioGuilds[sysId].fifo = join(temp, "fifo", String(sysId));
            CreateFifo(AudioGuilds[sysId].fifo!, {overwrite:true, recursive: true});
            //init the fiforead
            AudioGuilds[sysId].fifoRead = fs.createReadStream(AudioGuilds[sysId].fifo!);
            AudioGuilds[sysId].fifoRead?.pipe(AudioGuilds[sysId].stream);

            //initialize the player
            AudioGuilds[sysId].player = createAudioPlayer();
            AudioGuilds[sysId].player?.play(AudioGuilds[sysId].resource!);
            AudioGuilds[sysId].connection?.subscribe(AudioGuilds[sysId].player!);
        } else {
            return "AUDIOGUILD_ALREADY_INITIALIZED";
        }
    } else {
        return "AUDIOGUILD_NOT_FOUND";
    }
}