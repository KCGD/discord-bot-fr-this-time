import { exec, spawn, execSync } from "child_process";
import { CreateAudioSystem, JoinVc, AudioGuilds, InitVoice } from "../lib/voice";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";


export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Plays a song from a youtube link (or song name)"),
    execute: async (interaction:CommandInteraction) => {
        if(interaction.guildId) {
            let thisGuildId:string = interaction.guildId;
            CreateAudioSystem(thisGuildId);
            JoinVc(interaction, function(error, channel, connection, errorString) {
                if(!error) {
                    interaction.reply(`Playing test audio`);
                    InitVoice(thisGuildId, channel, connection);
                    exec(`yt-dlp "ytsearch:gorillaz hollywood" -o - | ffmpeg -y -i - -f mp3 "${AudioGuilds[thisGuildId].fifo}"`);
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
        } else {
            interaction.reply("You must be in a guild to use this command.");
        }
    }
}