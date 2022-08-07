const { MessageEmbed } = require('discord.js');
const { diffTimeHumanize } = require ('../utilities/diffTimeHumanize.js');

module.exports = async (client, member) => {
    let memberLeaveEmbed = new MessageEmbed()
    .setColor(14171198)
    .setTimestamp()
    .setFooter({ text: 'Земля ему железобетоном.', iconURL: 'https://files.fryshost.ru/assets/Hopa.png' });

    const timeStr = await diffTimeHumanize(member.joinedTimestamp);

    let AKA = '';
    if (member.nickname != null) {
         AKA = ' (АКА ' + member.nickname + ' )';
    }

    memberLeaveEmbed = {
        ...memberLeaveEmbed,
        author: {
            name: `${member.user.tag}${AKA} покинул Нору. Пинг: <@${member.user.id}>`,
            iconURL: `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.webp`,
        },
        fields: [{ name: 'Он пробыл с нами ровно', value: timeStr, inline: false }],
    };
    client.channels.cache.get(process.env.LEAVE_MSG_CHANNEL_ID).send({ embeds: [memberLeaveEmbed] });
};