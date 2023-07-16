import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Log } from "../lib/util/debug";
import { GetEndpointStatus } from "../lib/util/minecraftServer";
import { Endpoint } from "../main";

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('mc-status')
        .setDescription("Gets the status of the minecraft server (WIP)"),
    execute: async (interaction:CommandInteraction) => {
        if(Endpoint) {
            await interaction.reply("Command in testing, see console");
            GetEndpointStatus(Endpoint);
        } else {
            await interaction.reply("Endpoint variable is not defined. This is an issue with this bot's host. Please reach out to them.")
        }
    }
}