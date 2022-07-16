const { Info } = require('../utilities/logger.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const serverEmbed = new MessageEmbed();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Информация о Норе.')
        .setDMPermission(false),
    async server(interaction) {
        Info('/server вызвано. ' + interaction.member.user.username);
        interaction.reply({ embeds: [
            serverEmbed
                .setColor('#fecc4e')
                .setAuthor({ name: `Бот Норы v${process.env.VERSION}`, iconURL: 'https://files.fryshost.ru/assets/Hopa.png', url: 'https://github.com/Frysuni/HopaBot' })
                .setTitle('Информация о дискорде Норы')
                .addFields(
                    { name: 'Я пока не ебу что сюда приделать', value: '\u200B' },
                )
                .setFooter({ text: `Привет, ${interaction.member.user.username} !`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
                .setThumbnail('https://files.fryshost.ru/assets/Hopa.png'),
        ], ephemeral: true });
    },
};