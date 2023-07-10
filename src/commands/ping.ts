import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { Log } from "../lib/util/debug";

export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription("Replies w/ pong."),
    execute: async (interaction:CommandInteraction) => {
        await interaction.reply("Pong");
    }
}