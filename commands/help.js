const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const helpEmbed = new MessageEmbed()
    .setColor('#fecc4e')
    .setTitle('Общая информация о боте')
    .setURL('https://github.com/Frysuni/HopaBot')
    .setAuthor({ name: 'Бот Норы', iconURL: 'https://files.fryshost.ru/assets/Hopa.png' })
    .setDescription(`Версия: ${process.env.VERSION}`)
    .addFields(
        { name: '\u200B', value: '> **Общие команды:**' },
        { name: '`/help`', value: 'Общая информация о боте' },
        { name: '\u200B', value: '> **Админивсраторские команды:**' },
        { name: '`/reactrole`', value: 'Нахер Reaction Roles с сервера, я лучше него! ( *В разработке* )' },
        { name: '\u200B', value: '> **Ожидает реализации:**' },
        { name: '`Мут, кик, бан`', value: 'Бесполезные команды ( *в 1.1.x* )' },
        { name: '`Расширенный аудит`', value: 'Еще одна бесполезная хуйня ( *в 1.2.x* )' },
        { name: '`/reactrole`', value: 'Действительно сложная задача, как оказалось ( *в 1.3.x* )' },
    )
    .setThumbnail('https://files.fryshost.ru/assets/somecode.png')
    .setFooter({ text: 'POWERED BY FRYSHOST', iconURL: 'https://files.fryshost.ru/assets/FrysHostMini.png' });

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('А что тут есть?')
        .setDMPermission(false),
    async help(interaction) {
        await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
    },
};