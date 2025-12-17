import { Users } from "../../Models/MainModels/Users";
import addUserToDatabase from "./addUserToDatabase";

export default async function addVoiceTime(id: string, time: number) {
    const user = await Users.findOne({ where: { user_id: id } });

    if (!user) {
        await addUserToDatabase(id);
    }

    if (isNaN(time)) {
        return;
    } else if (!user) {
        const newUser = await Users.create({ user_id: id, voice: time, exp: Math.floor(time / 1000), first_currency: Math.floor(time / 1000), second_currency: 0, rank: Math.floor(time / 1000) });
        newUser.save();
    } else if (user.user_id === id) {
        user.voice = Number(user.voice) + time;
        user.save();
    } else {
        console.log('!error function addVoiceTime please chek this function!')
    }
}