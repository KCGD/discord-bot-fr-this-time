import { Endpoint } from "../main";
import { GetEndpointStatus } from "../lib/util/minecraftServer";
import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";


export const MainCommand = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription("Gets the status of the minecraft server (WIP)"),
    execute: async (interaction:CommandInteraction) => {
        if(Endpoint) {
            await interaction.reply("Fetching the server's status ... one sec");

            //get the status of the minecraft server, returns with error or response object. Socket has been closed by this point.
            //followup method must be used after initial reply
            GetEndpointStatus(Endpoint, async function(error, response): Promise<void> {
                if(error) {
                    await interaction.followUp(`Could not get status from minecraft server (error code: ${error}). Please contact the bot devs.`);
                } else if(response) {
                    //create embed
                    let statsEmbed = new EmbedBuilder()
                        .setColor('#5873ff')
                        .setTitle(`Server: ${response.result.worldName}`)
                        .addFields(
                            { name: 'Online', value: `${response.result.childWritable.toString()}`, inline:true },
                            { name: 'Type', value: `${response.result.type}`, inline:true },
                            { name: 'Version', value: `${response.result.version}`, inline:true },
                        )

                    await interaction.followUp({'embeds': [statsEmbed]});
                }
            });
        } else {
            await interaction.reply("Endpoint variable is not defined. This is an issue with this bot's host. Please reach out to them.");
        }
    }
}