import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Log } from "../lib/util/debug";
import { GetEndpointStatus } from "../lib/util/minecraftServer";
import { Endpoint } from "../main";
import * as ErrorCodes from '../lib/util/errors';

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('mc-status')
        .setDescription("Gets the status of the minecraft server (WIP)"),
    execute: async (interaction:CommandInteraction) => {
        if(Endpoint) {
            await interaction.reply("Fetching the server's status ... one sec"); //placeholder for in-dev commands

            //get the status of the minecraft server, returns with error or response object. Socket has been closed by this point.
            //followup method must be used after initial reply
            GetEndpointStatus(Endpoint, async function(error, response): Promise<void> {
                if(error) {
                    await interaction.followUp(`Could not get status from minecraft server (error code: ${error}). Please contact the bot devs.`);
                } else {
                    await interaction.followUp(`\`\`\`JSON\n${JSON.stringify(response, null, 2)}\`\`\``);
                }
            });
        } else {
            await interaction.reply("Endpoint variable is not defined. This is an issue with this bot's host. Please reach out to them.");
        }
    }
}