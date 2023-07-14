import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Log } from "../lib/util/debug";

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('mc-start')
        .setDescription("Starts the minecraft server (WIP)"),
    execute: async (interaction:CommandInteraction) => {
        await interaction.reply("Command not implemented");
    }
}