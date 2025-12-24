import { EmbedBuilder, TextChannel } from "discord.js";
import { client } from "../..";

client.on('guildMemberAdd', async member => {
    if (member.user.bot) return;

    const embed = new EmbedBuilder()
        .setAuthor({ name: 'RU ENDO', iconURL: `${member.user.avatarURL() || 'https://images-ext-1.discordapp.net/external/XB52oJ4yX0BXp1Sdurg1ZLSAAsRQVFBb5dRtILBwyYc/https/cdn.discordapp.com/icons/1429576059606663241/a_992caaae7744068d87030583d72fe16b.gif'}` })
        .setThumbnail("https://images-ext-1.discordapp.net/external/rKLuZsITKWZfl1UVEChdTMP_hKsyRWxbw4Fb_I3DzOY/%3Fsqp%3D-oaymwEmCIAKENAF8quKqQMa8AEB-AHUBoAC4AOKAgwIABABGGEgZShOMA8%3D%26rs%3DAOn4CLB5l_e3ISA8aBmzQnD5_Tr_ty7Irg/https/i.ytimg.com/vi/NV-AU-qyGKo/maxresdefault.jpg?format=webp&width=967&height=544")
        .setFields(
            {
                name: "**Обязательно ознакомься:**",
                value: "<#1429582943692787874>"
            },
            {
                name: "**Стратегии фарма и вся инфа:**",
                value: '**Эндо:** <#1438549294641582243> <#1429589694731255959>\n**Кредиты:** <#1442026048626626570>\n**Арбитраж:** <#1443423611498266704>\n\n**ИВЕНТ на 10к+ платины:** <#1450320483919724665>'
            }
        )
        .setColor("Red")
        .setTimestamp()

    const text = `${member.user} Добро пожаловать на сервер`

    if (member.guild.id === "1429576059606663241") {
        const channelSayHi = await member.guild.channels.cache.get("1429589421778276392") as TextChannel;

        channelSayHi.send({
            content: text,
            embeds: [embed]
        })

    }
})