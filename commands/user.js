const { Info } = require('../utilities/logger.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const userEmbed = new MessageEmbed();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Информация о Норе.')
        .addUserOption(option => option
            .setName('пользователь')
            .setDescription('Выберите пользователя, о котором хотите получить информацию.')
            .setRequired(true))
        .setDMPermission(false),
    async user(client, interaction) {
        Info('/user вызвано. ' + interaction.member.user.username);
        const user = interaction.options.getUser('пользователь');
        const usermore = client.users.fetch(user.id);
            usermore.then(result => {
                console.log(result);
            });
        interaction.reply({ embeds: [
            userEmbed
                .setColor('#fecc4e')
                .setAuthor({ name: `Бот Норы v${process.env.VERSION}`, iconURL: 'https://files.fryshost.ru/assets/Hopa.png', url: 'https://github.com/Frysuni/HopaBot' })
                .setTitle(`Информация о ${user.username}#${user.discriminator}`)
                .addFields(
                    { name: 'Я пока не ебу что сюда приделать', value: '\u200B' },
                )
                .setFooter({ text: `Привет, ${interaction.member.user.username} !`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.member.user.id}/${interaction.member.user.avatar}.webp` })
                .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`),
        ], ephemeral: true });
    },
};