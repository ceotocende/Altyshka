import { Users } from "../../Models/MainModels/Users";
import { MessageDB } from "../../Models/Message/MessageModel";

export default async function addUserToDatabase(user: string) {
    const userDb = await Users.findOne({ where: { user_id: user } });
    const messageDb = await MessageDB.findOne({ where: { user_id: user } });

    if (!userDb) {
        const newCreate = Users.create({ user_id: user, first_currency: 0, second_currency: 0, exp: 0, rank: 0, voice: 0 });
        (await newCreate).save();
    };

    if (!messageDb) {
        const newCreate = MessageDB.create({ user_id: user, count_symbol: 0, message_count: 0 });
        (await newCreate).save();
    };
}
