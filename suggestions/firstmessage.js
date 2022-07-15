const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const startEmbed = new MessageEmbed()
	.setColor('#fecc4e')
	.setTitle('Есть идеи? Предложи их тут!')
	.setDescription('В этом канале создаются новые предложения касательно Норы. Постарайтесь описать ваше предложение более подробно, чтобы не возникало лишних вопросов.')
	.addFields(
		{ name: '\u200B', value: '> Для того, чтобы оставить предложение, нажмите кнопку ниже и заполните всплывающую форму.' },
        { name: '\u200B', value: '> Голосовать за Ваше предложение сможет любой `@Участник` Норы, нажав соответсвующую кнопку под вашим предложением.' },
	);

const write = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('write')
        .setLabel('Написать')
        .setStyle('PRIMARY')
        .setEmoji('📨'),
);

module.exports = {
    async start(client, message) {
        client.channels.cache.get(process.env.SUGGESTIONS_CHANNEL_ID).send({ embeds: [startEmbed], components: [write] });
        message.delete();
    },
};