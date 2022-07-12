require('dotenv').config();

const timeHumanize = (timestamp) => {

    const diff = ~~((Date.now() - timestamp) / 1000);

    let years = diff > 31556926 ? Math.floor(diff / 31556926) : null;
    let mounths = diff > 2629743 ? Math.floor(diff / 2629743 % 12) : null;
    let days = diff > 86400 ? Math.floor(diff / 86400 % 31) : null;
    let hours = diff > 3600 ? Math.floor(diff / 3600 % 24) : null;
    let minutes = diff > 60 ? Math.floor(diff / 60 % 60) : null;
    const seconds = diff % 60;

    minutes = minutes ? `${minutes} минут ` : '';
    hours = hours ? `${hours} часов ` : '';
    days = days ? `${days} дней ` : '';
    mounths = mounths ? `${mounths} месяцев ` : '';
    years = years ? `${years} лет ` : '';

    const obj = {years, mounths, days, hours, minutes, seconds};
    
    return obj;
}

module.exports = async (client, member) => {
    const my = timeHumanize(member.joinedTimestamp);
    client.channels.cache.get(process.env.LEAVE_MSG_CHANNEL_ID).send(`<@${member.user.id}> покинул **Нору**. Он пробыл с нами ровно ${my.years}${my.mounths}${my.days}${my.hours}${my.minutes}${my.seconds} секунд.`);
}