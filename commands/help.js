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
        { name: '`Мут, кик, бан`', value: 'Бесполезные команды ( *в 1.1.x* )' },
        { name: '`Расширенный аудит`', value: 'Еще одна бесполезная хуйня ( *в 1.2.x* )' },
        { name: '`/reactrole`', value: 'Действительно сложная задача, как оказалось ( *в 1.3.x* )' },
    )
    .setFooter({ text: 'by Frys', iconURL: 'https://files.fryshost.ru/assets/FrysHostMini.png' })
    .setThumbnail('https://files.fryshost.ru/assets/somecode.png');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('А что тут есть?')
        .setDMPermission(false),
    async help(interaction) {
        interaction.reply({ embeds: [
            helpEmbed.setDescription(`Привет, ${interaction.member.user.username}! Я бот, разработанный специально для этого сервера. Мы не просто Нора, мы Норка со своей душой и кучкой идиотов рядом.`)
        ], ephemeral: true });
    },
};