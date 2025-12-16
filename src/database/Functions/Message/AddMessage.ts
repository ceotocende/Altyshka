import { User } from "discord.js";
import { MessageDB } from "../../Models/Message/MessageModel";

/**
 * 
 * @param User Юзер из дискорда 
 * @param Message текст сообщения (для подсчета символов)
 * @returns false или ничего :)
 */

export async function AddMessage(User: User, Message: string) {
    if (User.bot) return;

    const UserId = User.id;

    const messageDB = await MessageDB.findOne({ where: { user_id: UserId } });
    try {
        if (!messageDB) {
            await MessageDB.create({
                user_id: User.id,
                count_symbol: Message.length,
                message_count: 1
            });
        } else if (UserId === messageDB.user_id) {
            messageDB.message_count = Number(messageDB.message_count) + 1;
            messageDB.count_symbol = Number(messageDB.count_symbol) + Message.length;
            messageDB.save();
        }
    } catch (er) {
        console.error(new Date(), er)
    }
}