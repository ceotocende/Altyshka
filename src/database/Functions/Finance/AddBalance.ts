import { User } from "discord.js";
import { Users } from "../../Models/MainModels/Users";

/**
 * 
 * @param User Юзер из дискорда 
 * @param FirstBalance Основной баланс
 * @param SecondBalance Валютный баланс (опционально)
 * @returns 
 */

export async function AddBalance(User: User, FirstBalance: number, SecondBalance?: number) {
    if (User.bot) return;

    const UserId = User.id;

    const UserDb = await Users.findOne({ where: { user_id: UserId } });
    try {
        if (!UserDb) {
            await Users.create({
                user_id: User.id,
                exp: 1,
                first_currency: FirstBalance,
                second_currency: SecondBalance || 1,
                rank: 1
            });
        } else if (UserId === UserDb.user_id) {
            UserDb.first_currency = Number(UserDb.first_currency) + FirstBalance;
            if (SecondBalance) {
                UserDb.second_currency = Number(UserDb.second_currency) + SecondBalance;
            }
            UserDb.save();
        }
    } catch (er) {
        console.error(new Date(), er)
    }
}