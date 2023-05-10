const fractNum = '\\d+(?:[\\.,]\\d+)?';
const iso8601 = `P(?:T(${fractNum}H)?(${fractNum}M)?(${fractNum}S)?)?`;
const pattern = new RegExp(iso8601);

interface Duration {
    hours?: number;
    minutes?: number;
    seconds?: number;
}

const objMap: (keyof Duration)[] = [
    'hours',
    'minutes',
    'seconds'
];

export default function(durationString: string): { time: string, seconds: number } {
    const matches = durationString.replace(/,/g, '.').match(pattern) as RegExpMatchArray;
    const slicedMatches: (string | undefined)[] = matches.slice(1);

    const durationInput = slicedMatches.reduce((prev, next, idx) => {
        prev[objMap[idx]] = parseFloat(next || '0') || 0;
        return prev;
    }, {} as Duration);

    let result = '';

    // 1:5:0 -> 1:05:00
    if (durationInput.hours) result += `${durationInput.hours}:`;

    if ((durationInput.minutes ?? 0) <= 9) result += `0${durationInput.minutes ?? 0}:`;
    else result += `${durationInput.minutes}:`;

    if ((durationInput.seconds ?? 0) <= 9) result += `0${durationInput.seconds ?? 0}`;
    else result += `${durationInput.seconds}`;


    return { time: result,
          seconds: (durationInput.hours * 3600) + (durationInput.minutes * 60) + durationInput.seconds
    };
}
