import { EmbedBuilder, Guild, Message } from "discord.js";
import { client } from "../..";
import { channelsId } from "../../utils/config";

client.on('messageCreate', async message => {
    if (message.guildId !== `${process.env.GUILD_ID}`) return;
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    if (message.channel.id === channelsId.shearGroup) {

        const content = message.content.toLocaleLowerCase();

        const words = content.split(/\s+/);

        if (words.includes('пб') || words.includes('па') || words.includes('п')) {
            try {
                const thread = await message.startThread({
                    name: `${await replaceRoleMentionsWithNames(message.guild, message.content)}`,
                    autoArchiveDuration: 60,
                });
                thread.send({
                    content: `${message.author}`,
                    embeds: [
                        new EmbedBuilder()
                            .setDescription(`**Ветка создана**\nИспользуйте эту ветку для общения с участниками вашего отряда.\nЕсли кто-то покидает отряд, используйте команду ...закрыть и создайте новую ветку.\n\n**Команды:**\n**..фулл** — Помечает этот отряд как сформированный 4/4.\n**..закрыть** — Закрывает и блокирует ветку, она также будет автоматически закрыта через 1 час.\n\n**Команды могут использовать только создатель ветки или модераторы**`)
                            .setImage('https://media.discordapp.net/attachments/1442111975881441411/1471890036080251066/effce5a01de76a95.png?ex=699093ea&is=698f426a&hm=07cc0e076de2e33613a63d373968c5f7331706bba20da162478d85eb930e5c71&=&format=webp&quality=lossless')
                            .setTimestamp()
                            .setColor('Random')
                    ]
                })
            } catch (err) {
                console.log('Ошибка по сообщениям' + err)
            }
        } else {
            await message.delete();
        }
    }

    if (message.content === '..закрыть') {

        const channel = message.channel;

        if (channel.isThread()) {
            const threadOwnerId = channel.ownerId;
            const isOwner = message.author.id === threadOwnerId;
            const isModerator = message.member?.permissions.has('ManageThreads');

            if (!isOwner && !isModerator) {
                return;
            } else {
                channel.setName(`${`[ЗАКРЫТО] ` + channel.name}`)
                await channel.setLocked(true)
            }
        }
    }

    if (message.content === '..фулл') {

        const channel = message.channel;

        if (channel.isThread()) {
            const threadOwnerId = channel.ownerId;
            const isOwner = message.author.id === threadOwnerId;
            const isModerator = message.member?.permissions.has('ManageThreads');

            if (!isOwner && !isModerator) {
                return;
            } else {
                channel.setName(`${`[ФУЛЛ] ` + channel.name}`)
                // await channel.setLocked(true)
            }
        }
    }
})

async function replaceRoleMentionsWithNames(guild: Guild, text: string): Promise<string> {
    let result = text;

    // Находим все упоминания ролей в тексте
    const roleMentions = text.match(/<@&(\d+)>/g) || [];

    for (const mention of roleMentions) {
        const roleId = mention.replace(/<@&|>/g, '');
        try {
            const role = await guild.roles.fetch(roleId);
            if (role) {
                // Заменяем упоминание на название роли
                result = result.replace(mention, role.name);
            }
        } catch (error) {
            console.error(`Ошибка с ролью ${roleId}:`, error);
            result = text;
        }
    }

    return result;
}