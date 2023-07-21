import { tmpdir } from "os";
import * as fs from 'fs';
import { joinVoiceChannel, createAudioPlayer, createAudioResource, NoSubscriberBehavior, VoiceConnection } from '@discordjs/voice';
import { Channel, CommandInteraction, StageChannel, VoiceBasedChannel, VoiceChannel, VoiceState } from "discord.js";
import { ErrorCode } from "./util/errors";
import { Log } from "./util/debug";

//type definitions
//from youtube
export type Song = {
    name:string;
    thumbnail:string; //url
    url:string; //youtube url
    searchPhrase?:string;
}

//audio system object (per-guild)
export type AudioSystem = {
    connection:VoiceConnection | null;
    channel:VoiceBasedChannel | null;
    queue: Song[];
}

//guild systems assignable object
export let GuildSystems: {[key:string]: AudioSystem} = {}


//create AudioSystem for a guild. 
export function CreateGuildSystem(guildID:string): void {
    if(!GuildSystems[guildID]) {
        GuildSystems[guildID] = {
            connection: null,
            channel: null,
            queue: []
        };
    }
}


//join vc function. Makes bot join the voice chat, returns channel and connection objects OR error
interface joinVcCallback {(error:ErrorCode | undefined, channel?:VoiceBasedChannel, connection?: VoiceConnection, errorString?:string): void};
export function JoinVc(interaction:CommandInteraction, callback:joinVcCallback): void {
    //const voiceState:VoiceState|undefined = interaction.guild?.voiceStates.cache.get(interaction.user.id);
    interaction.guild?.members.fetch(interaction.user.id).then((member) => {
        console.log(member.voice);
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