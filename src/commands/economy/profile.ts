import { ActionRowBuilder, ComponentType, EmbedBuilder, InteractionResponse, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { client } from "../..";
import { colors, embedErrFromUserDb } from "../../utils/config";
import { Users } from "../../database/Models/MainModels/Users"; 
import addUserToDatabase from "../../database/Functions/Add/addUserToDatabase";
import formatTimeForProfile from "../../utils/formatTimeForProfile";
import { MessageDB } from "../../database/Models/Message/MessageModel";

export default new client.command({
    structure: new SlashCommandBuilder()
        .setName('профиль')
        .setDescription('Посмотреть свой или профиль участника')
        .addUserOption(op => op
            .setName('user')
            .setDescription('Выбрать участника')
            .setRequired(false)),
    async run(client, interaction) {
        const targetUser = interaction.options.getUser('user') ?? interaction.user;
        console.log('as')
        const userDb = await Users.findOne({ where: { user_id: targetUser.id } });
        const messageDb = await MessageDB.findOne({ where: { user_id: targetUser.id } });
        let msg: InteractionResponse;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `Профиль участника: ${targetUser.username}` })
            .setColor(`#${colors.stable}`)
            .setThumbnail(targetUser.avatarURL())

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('StringSelectMenuOption')
            .setPlaceholder('Выберите нужное')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setValue(`selectMenuForViewActivity`)
                    .setLabel('Активности')
                    .setDescription('Посомтреть данные об активностях')
                    .setEmoji('🥇')
            )

        const rowMenu = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)
        
        if (!targetUser || targetUser.id === interaction.user.id) {
            msg = await interaction.reply({
                embeds: [embed],
                components: [rowMenu]
            })
        } else {
            msg = await interaction.reply({
                embeds: [embed],
                components: [rowMenu]
            })
        }

        const collector = msg!.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 300000 });

        collector.on("collect", async subInteraction => {
            if (subInteraction.user.id !== interaction.user.id) return;

            if (subInteraction.isStringSelectMenu()) {
                const labelId = [
                    'selectMenuForViewActivity',
                ];

                if (labelId.some(greting => subInteraction.values.includes(greting))) {
                    switch (subInteraction.values[0]) {
                        case 'selectMenuForViewActivity':
                            selectMenu.addOptions(
                                new StringSelectMenuOptionBuilder()
                                    .setValue(`selectMenuForBack`)
                                    .setLabel('Вернуться')
                                    .setDescription('Вернуться на главную страницу')
                                    .setEmoji('🔙'),
                            )
                            await subInteraction.deferUpdate();
                            msg!.edit({
                                embeds: [
                                    new EmbedBuilder()
                                        .setAuthor({ name: `Активности участника: ${targetUser.username}` })
                                        .setFields(
                                            {
                                                name: `Общее время в голсовых каналх`,
                                                value: `\`${formatTimeForProfile(userDb?.voice ?? 0)}\``
                                            },
                                            {
                                                name: `Всего сообщений`,
                                                value: `**${(messageDb?.message_count ?? 0).toLocaleString('ru-RU')}**`
                                            },
                                            {
                                                name: "Всего символов",
                                                value: `**${(messageDb?.count_symbol ?? 0).toLocaleString('ru-RU')}**`
                                            }
                                        )
                                        .setColor(`#${colors.stable}`)
                                        .setThumbnail(targetUser.avatarURL())
                                ],
                                components: [ ]
                            })
                            break;
                        default:
                            collector.stop();
                            break;
                    }
                }
            }
        })

        collector.on('end', async () => {
            await msg!.edit({
                components: []
            })
        })
    },
})