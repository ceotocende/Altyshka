import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromInteractions } from '../../utils/config';
import { angry } from '../../utils/gif.json'


export default new client.command({
    structure: new SlashCommandBuilder()
    .setName('настройки')
    .setDescription('настройки админа, не лезь если не знаешь')
    .setDefaultMemberPermissions(8),
    run(client, interaction) {
        interaction.reply({
            content:"Тут пока ничего",
            ephemeral: true
        })
    }
})