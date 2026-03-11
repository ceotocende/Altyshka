import { EmbedBuilder } from "@discordjs/builders";
import { client } from "../..";
import formatTimeForProfile from "../../utils/formatTimeForProfile";

client.on('guildMemberAdd', async member => {
    if (member.user.bot) return;

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
    if (member.avatarURL()) {
        embed.setThumbnail(member.avatarURL())
    }

})