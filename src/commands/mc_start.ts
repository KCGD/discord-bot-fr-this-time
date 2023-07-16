import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { Log } from "../lib/util/debug";
import { GetEndpointStatus, StartEndpointServer } from "../lib/util/minecraftServer";
import { Endpoint } from "../main";
import * as ErrorCodes from '../lib/util/errors';
import { Rizz } from "../lib/rizz";

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription("Starts the current world."),
    execute: async (interaction:CommandInteraction) => {
        if(Endpoint) {
            await interaction.reply("Starting the minecraft server. This might take a minute");

            StartEndpointServer(Endpoint, async function(error, response, phase): Promise<void> {
                if(error) {
                    if(error === "SERVER_ALREADY_UP") {
                        await interaction.followUp("The server is already running.");
                    } else {
                        await interaction.followUp(`Errors occured while starting the minecraft server (error code: ${error}). Please contact the bot devs about this.`);
                    }
                } else {
                    if(phase === "confirm") { //startup confirmation from server, report world stats
                        await interaction.followUp(`Starting world ${response?.worldName} on minecraft ${response?.version}`);
                    } else if (phase === "complete") {
                        await interaction.followUp(`Server is up! *${Rizz()}*`);
                    }
                }
            })
        } else {
            await interaction.reply("Endpoint variable is not defined. This is an issue with this bot's host. Please reach out to them.");
        }
    }
}