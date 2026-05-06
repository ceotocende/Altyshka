import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { client } from "../..";

export default new client.command({
    structure: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('adm')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    run: async (client, interaction) => {
        interaction.reply({
            ephemeral: true,
            content: `${client.ws.ping}`
        })
    }
});