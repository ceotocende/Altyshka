import { client as Client } from "../..";
import { ActivityType, TextChannel } from "discord.js";
import { TableSync } from "../../database/dbsync";

Client.once('ready', async (client) => {
    console.log('Logged in as: ' + Client.user?.tag);
    Client.user?.setActivity('за вами',{ type: ActivityType.Watching });
    Client.user?.setStatus("idle")

    const guild = client.guilds.cache.get(`${process.env.GUILD_ID}`);
    if (!guild) {
        return console.log('\x1b[31m' + 'Произашла ошибка на стадии запуска.\nБаза данных не подключена');
    } else {
        const channelSendStart = await guild!.channels.cache.get('1429589839887597569') as TextChannel;

        channelSendStart.send(`В работе с <t:${Math.floor(Date.now() / 1000)}:F>`);

        await TableSync();
    }
});