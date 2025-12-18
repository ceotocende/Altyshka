import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromInteractions } from '../../utils/config';
import { angry } from '../../utils/gif.json'
import { Users } from "../../database/Models/MainModels/Users";
import formatTimeForProfile from "../../utils/formatTimeForProfile";


export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('add_voice_user_time')
        .setDescription('настройки админа, не лезь если не знаешь')
        .addUserOption(op => op
            .setName('user')
            .setDescription('Выбрать пользоввателя')
            .setRequired(true)
        )
        .addNumberOption(op => op
            .setName('num')
            .setDescription('Сколько надо (timestamp)')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(8),
    async run(client, interaction) {
        const targetUser = interaction.options.getUser('user');
        const targetNum = interaction.options.getNumber('num');

        const userDb = await Users.findOne({ where: { user_id: targetUser!.id } });

        if (!userDb) {
            interaction.reply({
                content: "Такого нет",
                ephemeral: true
            })
        } else if (userDb.user_id === targetUser!.id) {

            userDb.voice = Number(userDb.voice) + Number(targetNum);
            userDb.save();
            interaction.reply({
                content: `Добавлено время \`${formatTimeForProfile(targetNum!)}\``,
                ephemeral: true
            })
        } else {
            interaction.reply({
                content: "Произошла ошибка",
                ephemeral: true
            })
        }
    }
})