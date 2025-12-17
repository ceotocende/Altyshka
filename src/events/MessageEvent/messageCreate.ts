import { client } from "../..";
import { AddBalance } from "../../database/Functions/Finance/AddBalance";
import { AddMessage } from "../../database/Functions/Message/AddMessage";

client.on('messageCreate', message => {
    if (message.guildId !== `${process.env.GUILD_ID}`) return;
    if (!message.inGuild()) return;
    if (message.author.bot) return;
    try {
        AddMessage(message.author, message.content)
        AddBalance(message.author, 1, 1)
    } catch(err) {
        console.log('Ошибка по сообщениям' + err)
    }
})