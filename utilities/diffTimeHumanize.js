const diffTimeHumanize = async (timestamp) => {

    const diff = ~~((Date.now() - timestamp) / 1000);

    let years = diff > 31556926 ? Math.floor(diff / 31556926) : '';
    let mounths = diff > 2629743 ? Math.floor(diff / 2629743 % 12) : '';
    let days = diff > 86400 ? Math.floor(diff / 86400 % 31) : '';
    let hours = diff > 3600 ? Math.floor(diff / 3600 % 24) : '';
    let minutes = diff > 60 ? Math.floor(diff / 60 % 60) : '';
    let seconds = diff % 60;

    seconds += '';
    if ((seconds.endsWith(2) || seconds.endsWith(3) || seconds.endsWith(4)) && seconds != 12 && seconds != 13 && seconds != 14) { seconds += ' секунды'; }
    else if (seconds.endsWith(1) && seconds != 11) { seconds += ' секунду'; }
    else if (seconds != '') { seconds += ' секунд'; }

    minutes += '';
    if ((minutes.endsWith(2) || minutes.endsWith(3) || minutes.endsWith(4)) && minutes != 12 && minutes != 13 && minutes != 14) { minutes += ' минуты '; }
    else if (minutes.endsWith(1) && minutes != 11) { minutes += ' минуту '; }
    else if (minutes != '') { minutes += ' минут '; }

    hours += '';
    if ((hours.endsWith(2) || hours.endsWith(3) || hours.endsWith(4)) && hours != 12 && hours != 13 && hours != 14) { hours += ' часа '; }
    else if (hours.endsWith(1) && hours != 11) { hours += ' час '; }
    else if (hours != '') { hours += ' часов '; }

    days += '';
    if ((days.endsWith(2) || days.endsWith(3) || days.endsWith(4)) && days != 12 && days != 13 && days != 14) { days += ' дня '; }
    else if (days.endsWith(1) && days != 11) { days += ' день '; }
    else if (days != '') { days += ' дней '; }

    mounths += '';
    if ((mounths.endsWith(2) || mounths.endsWith(3) || mounths.endsWith(4)) && mounths != 12 && mounths != 13 && mounths != 14) { mounths += ' месяца '; }
    else if (mounths.endsWith(1) && mounths != 11) { mounths += ' месяц '; }
    else if (mounths != '') { mounths += ' месяцев '; }

    years += '';
    if ((years.endsWith(2) || years.endsWith(3) || years.endsWith(4)) && years != 12 && years != 13 && years != 14) { years += ' года '; }
    else if (years.endsWith(1) && years != 11) { years += ' год '; }
    else if (years != '') { years += ' лет '; }

    return `${years}${mounths}${days}${hours}${minutes}${seconds}.`;
};

module.exports = { diffTimeHumanize };