const { Info } = require('../utilities/logger.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const helpEmbed = new MessageEmbed()
    .setColor('#fecc4e')
    .setTitle('Общая информация о боте')
    .setAuthor({ name: `Бот Норы v${process.env.VERSION}`, iconURL: 'https://files.fryshost.ru/assets/Hopa.png', url: 'https://github.com/Frysuni/HopaBot' })
    .addFields(
        { name: '\u200B', value: '> **Общие команды:**' },
        { name: '`/help`', value: 'Информация', inline: true },
        { name: '`/ping`', value: 'Как без нее', inline: true },
        { name: '\u200B', value: '> **Админивсраторские команды:**' },
        { name: '`/reactrole`', value: 'Нахер Reaction Roles с сервера, я лучше него! ( *В разработке* )' },
        { name: '\u200B', value: '> **Ожидает реализации:**' },
        { name: '`Система рангов`', value: 'Надо потрудиться' },
        { name: '`Расширенный аудит`', value: 'Сложно, бесполезно' },
        { name: '`/reactrole`', value: 'Действительно сложная задача, как оказалось' },
        { name: '`Музыкальный бот`', value: 'Там вообще ахуёк!' },
    )
    .setFooter({ text: 'Frys', iconURL: 'https://files.fryshost.ru/assets/Frys.png' })
    .setThumbnail('https://files.fryshost.ru/assets/somecode.png');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('А что тут есть?')
        .setDMPermission(false),
    async help(interaction) {
        Info('/help вызвано. ' + interaction.member.user.username);
        interaction.reply({ embeds: [
            helpEmbed.setDescription(`Привет, ${interaction.member.user.username}! Я бот, разработанный специально для этого сервера. Мы не просто Нора, мы Норка со своей душой и кучкой идиотов рядом.`),
        ], ephemeral: true });
    },
};