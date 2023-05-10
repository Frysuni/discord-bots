import * as fs from 'node:fs';

const DayDate = async (): Promise<string> =>
new Intl.DateTimeFormat('en-EU', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date())
    .replace(', ', '-')
    .replace(' ', '-');

async function verifyFile(DayString: string): Promise<void> {
    if (!fs.existsSync('./logs/')) {
        fs.mkdirSync('./logs');
    }
    if (!fs.existsSync(`./logs/${DayString}.log`)) {
        fs.writeFileSync(`./logs/${DayString}.log`, DayString + ' Log File\n');
    }
}

async function writeToFile(data: string): Promise<void> {
    const DayString = await DayDate();
    await verifyFile(DayString);
    fs.appendFileSync(`./logs/${DayString}.log`, data + '\n');
}

export default writeToFile;