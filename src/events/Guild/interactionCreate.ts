import { client } from "../..";

client.on('interactionCreate', async (interaction) => {
    if (!interaction.inGuild()) return;
    if (interaction.guildId !== `${process.env.GUILD_ID}`) return;
    
    if (interaction.isChatInputCommand()) {
        // if (interaction.channelId !== '1429589839887597569') return; //Временная проверка
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            command?.run(client, interaction);
        } catch (err) {
            console.error(err);
            interaction.reply({ ephemeral: true, content: "Произошла ошибка при выполнение команды" })
        };
    }
    if (!interaction.isButton()) return;
});