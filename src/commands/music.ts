import { exec, spawn, execSync } from "child_process";
import { CreateAudioSystem, JoinVc, AudioGuilds, InitVoice } from "../lib/voice";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { Log } from "../lib/util/debug";


export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Plays a song from a youtube link (or song name)")
        .addStringOption(option => {
            return option
                .setName("song")
                .setDescription("a song name or url to add to the queue.")
                .setRequired(true)
        }),
    execute: async (interaction:CommandInteraction) => {
        //prevent use in DMs
        if(interaction.guildId) {
            //define song and guild id
            const song:string | undefined = interaction.options.get("song")?.value?.toString();
            const thisGuildId:string = interaction.guildId;

            //check if song is defined or not
            if(!song) {
                interaction.reply("Please give me a song to play");
                return;
            }

            //determine if song is direct link or not
            let songIsLink:boolean = false;
            try {
                new URL(song);
                songIsLink = true;
            } catch (e) {
                //no action
                songIsLink = false;
            }

            //create audio system for guild. Will fail silently if audiosystem already exists. This behavior is deliberate.
            CreateAudioSystem(thisGuildId);

            //check if system initialized or not
            if(!AudioGuilds[thisGuildId].initialized) {
                //attempt joining the vc
                JoinVc(interaction, function(error, channel, connection, errorString) {
                    if(!error) {
                        InitVoice(thisGuildId, channel, connection);
                        let prefix:string = (songIsLink)? "" : "ytsearch:";
                        Log(`W`, false, `${songIsLink}`);
                        exec(`yt-dlp "${prefix}${song}" -o - | ffmpeg -y -i - -f mp3 "${AudioGuilds[thisGuildId].fifo}"`);
                    } else {
                        switch (error) {
                            case "CHANNEL_NOT_FOUND": {
                                interaction.reply(`Could not find the current channel! Please make sure this command was run in a guild.`);
                            } break;

                            case "CHANNEL_NOT_VC": {
                                interaction.reply(`Please join a voice chat to use this command.`);
                            } break;

                            case "JOIN_VC_FAILED": {
                                interaction.reply(`Failed to join VC. Here's some details on what went wrong: ||${errorString}||`);
                            } break;
                        }
                    }
                });
            }
        } else {
            interaction.reply("You must be in a guild to use this command.");
        }
    }
}