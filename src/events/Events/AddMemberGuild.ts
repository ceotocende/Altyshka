import { EmbedBuilder } from "@discordjs/builders";
import { client } from "../..";
import formatTimeForProfile from "../../utils/formatTimeForProfile";
import { Colors, TextChannel } from "discord.js";

client.on('guildMemberAdd', async member => {
    if (member.user.bot) return;

    const channel = await member.guild.channels.cache.get('1481199437991772333') as TextChannel;

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'Новый пользователь пришел на сервер', iconURL: member.guild.iconURL()! })
        .setThumbnail(member.guild.iconURL())
        .setFields(
            {
                name: 'Участник',
                value: `${member} (${member.id})`
            },
            {
                name: 'Зарегистрировался',
                value: `${new Date(member.user.createdAt)}`
            }
        )
        .setColor(Colors.Green)
        .setTimestamp()


        try {
            embed.addFields({
                name: 'Никнейм изменен',
                value: `С \`${member.displayName}\` на \`/inv ("Ник в игре")\``
            });

            await member.setNickname('/inv ("Ник в игре")');
        } catch (err) {
            console.error(err);
            embed.addFields({
                name: 'Произошла ошибка в изменении никнейма',
                value: `С \`${member.displayName}\` на \`/inv ("Ник в игре")\`\n${err}`
            })
        }


    if (member.avatarURL()) {
        embed.setThumbnail(member.avatarURL())
    }


    if (!channel) {
        return;
    } else {
        await channel.send({ embeds: [embed] });
    };
})