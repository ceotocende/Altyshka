import { Colors, TextChannel, EmbedBuilder } from "discord.js";
import { client } from "../..";
import { channelsId } from "../../utils/config";
import addUserToDatabase from "../../database/Functions/Add/addUserToDatabase";
import { AddBalance } from "../../database/Functions/Finance/AddBalance";
import addVoiceTime from "../../database/Functions/Add/addVoiceTime";

const map = new Map();


client.on('voiceStateUpdate', async (oldState, newState) => {
    if ((oldState.guild.id !== channelsId.guildId) || (newState.guild.id !== channelsId.guildId)) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    const currentTime = Date.now();
    const channelLog = newState.guild.channels.cache.get(channelsId.voiceLog) as TextChannel;

    const muteChanged = oldState.mute !== newState.mute;
    const selfMuteChanged = oldState.selfMute !== newState.selfMute;
    const serverMuteChanged = oldState.serverMute !== newState.serverMute;

    if (muteChanged || selfMuteChanged || serverMuteChanged) {
        if (oldState.guild.id !== channelsId.guildId || newState.guild.id !== channelsId.guildId) return;

        const newChannel = newState.channel;
        const member = newState.member!;
        const channelLog = newState.guild.channels.cache.get(channelsId.voiceLog) as TextChannel;

        if (newState.mute !== oldState.mute) {
            if (newState.mute === true) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник был заглушен`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} был заглушен модератором в канале ${newChannel}`)
                    .setColor(Colors.Red)
                    .setTimestamp();
                await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id));
                await AddBalance(newState.member!.user, 1, 1);
                map.delete(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник разглушен`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} был разглушен в канале ${newChannel}`)
                    .setColor(Colors.Green)
                    .setTimestamp();
                map.set(newState.member!.id, currentTime);
                await addUserToDatabase(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            }
        }

        if (newState.selfMute !== oldState.selfMute) {
            if (newState.selfMute === true) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник самозаглушился`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} самозаглушился в канале ${newChannel}`)
                    .setColor(Colors.Orange)
                    .setTimestamp();
                await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id));
                await AddBalance(newState.member!.user, 1, 1);
                map.delete(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник снял самозаглушение`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} снял самозаглушение в канале ${newChannel}`)
                    .setColor(Colors.Green)
                    .setTimestamp();
                map.set(newState.member!.id, currentTime);
                await addUserToDatabase(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            }
        }

        if (newState.serverMute !== oldState.serverMute) {
            if (newState.serverMute === true) {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник заглушен через права канала`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} заглушен через настройки канала ${newChannel}`)
                    .setColor(Colors.Purple)
                    .setTimestamp();
                await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id));
                await AddBalance(newState.member!.user, 1, 1);
                map.delete(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Участник разглушен в канале`,
                        iconURL: member.user.displayAvatarURL()
                    })
                    .setDescription(`${member.user.tag} разглушен в канале ${newChannel}`)
                    .setColor(Colors.Green)
                    .setTimestamp();
                map.set(newState.member!.id, currentTime);
                await addUserToDatabase(newState.member!.id);
                channelLog.send({ embeds: [embed] });
            }
        }
    }

    if (newState.channel !== null && oldChannel === null) {
        map.set(newState.member!.id, currentTime);
        await addUserToDatabase(newState.member!.id);
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник присоединился к голосовому каналу`, iconURL: `${newState.member?.user.displayAvatarURL()}` })
                    .setDescription(`Участник ${newState.member}, присоединился к каналу ${newState.channel}`)
                    .setColor(Colors.Green)
                    .setTimestamp()
            ]
        })
    }

    if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
        await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id));
        await AddBalance(newState.member!.user, 1, 1);
        map.delete(newState.member!.id);
        map.set(newState.member!.id, currentTime);

        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник перешел в другой канал`, iconURL: `${newState.member?.user.displayAvatarURL()}` })
                    .setDescription(`${newState.member!.user.tag} перешел из канала ${oldChannel} в канал ${newChannel}`)
                    .setColor(Colors.Grey)
                    .setTimestamp()
            ]
        })
    }

    if (oldChannel !== null && newChannel === null) {
        await addVoiceTime(`${oldState.member!.id}`, currentTime - map.get(newState.member!.id));
        await AddBalance(newState.member!.user, 1, 1);

        map.delete(newState.member!.id);
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `Участник покинул голосовой канал`, iconURL: `${newState.member!.displayAvatarURL()}` })
                    .setDescription(`Участник ${newState.member}, покинул голосовой канал ${oldState.channel}`)
                    .setColor(Colors.Yellow)
                    .setTimestamp()
            ]
        })
    }
})