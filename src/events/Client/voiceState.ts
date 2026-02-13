import { Colors, TextChannel, EmbedBuilder, GuildMember, User } from "discord.js";
import { client } from "../..";
import { channelsId } from "../../utils/config";

// Локальная мапа для быстрого доступа к активным сессиям
const activeSessions = new Map<string, number>();

// Функция для инициализации активных сессий при запуске бота
export async function initializeVoiceSessions() {
    try {
        // Получаем все голосовые каналы на всех серверах
        for (const guild of client.guilds.cache.values()) {
            for (const channel of guild.channels.cache.values()) {
                if (channel.isVoiceBased() && channel.members.size > 0) {
                    for (const member of channel.members.values()) {
                        if (member.user.bot) continue;
                        
                        const currentTime = Date.now();
                        activeSessions.set(member.id, currentTime);
                        
                        console.log(`Восстановлена сессия для ${member.user.tag} в канале ${channel.name}`);
                    }
                }
            }
        }
        console.log(`Инициализировано ${activeSessions.size} активных голосовых сессий`);
    } catch (error) {
        console.error('Ошибка при инициализации голосовых сессий:', error);
    }
}

// Функция для завершения сессии пользователя с начислением
async function endUserSessionWithRewards(userId: string, user: User, currentTime: number): Promise<number> {
    try {
        const sessionStartTime = activeSessions.get(userId);
        activeSessions.delete(userId);
        
        return 1;
    } catch (error) {
        console.error('Ошибка при завершении сессии с наградами:', error);
        return 0;
    }
}

// Функция для завершения сессии пользователя БЕЗ начисления (для перезагрузки)
async function endUserSessionWithoutRewards(userId: string, currentTime: number): Promise<number> {
    try {
        const sessionStartTime = activeSessions.get(userId);
        activeSessions.delete(userId);
        
       
        
        return 1;
    } catch (error) {
        console.error('Ошибка при завершении сессии без наград:', error);
        return 0;
    }
}

// Функция для начала новой сессии
async function startUserSession(member: GuildMember, channelId: string, currentTime: number) {
    try {
        activeSessions.set(member.id, currentTime);
        
    } catch (error) {
        console.error('Ошибка при начале сессии:', error);
    }
}

// Функция для сохранения времени при перезагрузке бота (без начисления наград)
async function saveTimeOnRestart() {
    try {
        const currentTime = Date.now();
        
        
    } catch (error) {
        console.error('Ошибка при сохранении времени при перезагрузке:', error);
    }
}

// Основной обработчик голосовых событий
client.on('voiceStateUpdate', async (oldState, newState) => {
    const channelLog = newState.guild.channels.cache.get(channelsId.voiceLog) as TextChannel;
    
    try {
        if ((oldState.guild.id !== channelsId.guildId) || (newState.guild.id !== channelsId.guildId)) return;
        if (oldState.member?.user.bot) return;
        if (newState.member?.user.bot) return;
        
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const currentTime = Date.now();
        const memberId = newState.member?.id || oldState.member?.id;

        if (!memberId) return;

        // Присоединение к каналу
        if (newChannel && !oldChannel) {
            await startUserSession(newState.member!, newChannel.id, currentTime);
            
            channelLog.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ 
                            name: `Участник присоединился к голосовому каналу`, 
                            iconURL: newState.member?.user.displayAvatarURL() 
                        })
                        .setDescription(`Участник ${newState.member}, присоединился к каналу ${newChannel}`)
                        .setColor(Colors.Green)
                        .setTimestamp()
                ]
            });
        }

        // Переход между каналами
        if (oldChannel && newChannel && oldChannel.id !== newChannel.id) {
            if (oldState.member?.user) {
                await endUserSessionWithRewards(memberId, oldState.member.user, currentTime);
            }
            
            await startUserSession(newState.member!, newChannel.id, currentTime);

            channelLog.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ 
                            name: `Участник перешел в другой канал`, 
                            iconURL: newState.member?.user.displayAvatarURL() 
                        })
                        .setDescription(`${newState.member!.user.tag} перешел из канала ${oldChannel} в канал ${newChannel}`)
                        .setColor(Colors.Grey)
                        .setTimestamp()
                ]
            });
        }

        // Выход из канала
        if (oldChannel && !newChannel) {
            if (oldState.member?.user) {
                await endUserSessionWithRewards(memberId, oldState.member.user, currentTime);
            }

            channelLog.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ 
                            name: `Участник покинул голосовой канал`, 
                            iconURL: oldState.member!.displayAvatarURL() 
                        })
                        .setDescription(`Участник ${oldState.member}, покинул голосовой канал ${oldChannel}`)
                        .setColor(Colors.Yellow)
                        .setTimestamp()
                ]
            });
        }
    } catch (err) {
        console.error(err);
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Произошла ошибка в голосовом модуле')
                    .setDescription('Ошибка: ' + err)
                    .setColor(Colors.Red)
                    .setTimestamp()
            ]
        });
    }
});

client.on('ready', async () => {
    console.log(`Бот ${client.user?.tag} запущен!`);
    
    // Сохраняем накопленное время для всех пользователей при перезагрузке (БЕЗ начисления наград)
    await saveTimeOnRestart();
    
    // Инициализируем голосовые сессии
    await initializeVoiceSessions();
});