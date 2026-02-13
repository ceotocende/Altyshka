import { client } from "../..";

client.on('messageCreate', message => {
    if (message.guildId !== `${process.env.GUILD_ID}`) return;
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    try {
        
    } catch(err) {
        console.log('Ошибка по сообщениям' + err)
    }
})