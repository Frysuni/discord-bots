import * as Canvas from '@napi-rs/canvas';
import { getExpMember } from '../database';
import staticImage from './static';
import { GuildMember } from 'discord.js';
import { resolve } from 'node:path';
import { calculateExpForLvl } from '../index';

export default async function rankCard(member: GuildMember) {
    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    ctx.save();

    ctx.drawImage(await staticImage, 0, 0, 800, 300);

    await createAvatarImage(member, ctx);
    await createNickname(member, ctx);
    await createActivities(member, ctx);
    await createRank(member, ctx);

    return canvas.encodeSync('png');
}

async function createAvatarImage(member: GuildMember, ctx: Canvas.SKRSContext2D) {
    const avatar = await Canvas.loadImage(member.displayAvatarURL({ extension: 'png' }));

    if (!member.presence) { ctx.fillStyle = '#747f8d'; }
    else {
        switch (member.presence.status) {
            case 'online':
                ctx.fillStyle = '#3ba55d';
                break;
            case 'idle':
                ctx.fillStyle = '#faa81a';
                break;
            case 'dnd':
                ctx.fillStyle = '#ed4245';
                break;
            case 'offline':
                ctx.fillStyle = '#747f8d';
                break;
            default:
                break;
        }
    }

    ctx.beginPath();
    ctx.arc(122, 122, 97, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(122, 122, 87, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(await staticImage, 0, 0, 800, 300);

    ctx.beginPath();
    ctx.arc(122, 122, 80, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(avatar, 43, 43, 160, 160);
    ctx.restore();

    if (member.presence?.clientStatus?.mobile) {
        const mobile = await Canvas.loadImage(resolve(__dirname, 'assets', 'mobile-phone.png'));
        ctx.drawImage(mobile, 200, 37, 30, 30);
    }
}

async function createNickname(member: GuildMember, ctx: Canvas.SKRSContext2D) {
    const displayUsername = maxLengthFormat(member.displayName, 15);
    ctx.font = 'bold 55px monospace';

    if (member.roles.color) ctx.fillStyle = '#' + member.roles.color.color.toString(16);
    else ctx.fillStyle = '#ffffff';

    ctx.fillText(displayUsername, 240, 100);
}

async function createActivities(member: GuildMember, ctx: Canvas.SKRSContext2D) {
    if (!member.presence) return;

    let customStatus = '';
    let activityGame = '';

    member.presence.activities.forEach(activity => {
        if (activity.type == 4) { customStatus = activity.state; }
        else {
            if (activityGame) return;
            switch (activity.type) {
                case 0:
                    activityGame = 'Играет в ' + activity.name;
                    break;
                case 1:
                    activityGame = 'Стримит на ' + activity.name;
                    break;
                case 2:
                    activityGame = 'Слушает ' + activity.name;
                    break;
                case 3:
                    activityGame = 'Смотрит ' + activity.name;
                    break;
                case 5:
                    activityGame = 'Соревнуется в ' + activity.name;
                    break;
                default:
                    break;
            }
        }
    });

    ctx.font = 'bold 25px monospace';
    ctx.fillStyle = '#ffffff';

    if (customStatus && activityGame) {

        customStatus = maxLengthFormat(customStatus, 35);
        activityGame = maxLengthFormat(activityGame, 35);

        ctx.fillText(`Статус: ${customStatus}`, 240, 135);
        ctx.fillText(activityGame, 240, 165);
    }

    else if (customStatus && !activityGame) {
        customStatus = maxLengthFormat(customStatus, 35);

        ctx.fillText(`Статус: ${customStatus}`, 240, 135);
    }

    else if (!customStatus && activityGame) {
        activityGame = maxLengthFormat(activityGame, 35);

        ctx.fillText(activityGame, 240, 135);
    }
}

async function createRank(member: GuildMember, ctx: Canvas.SKRSContext2D) {
    const ExpMember = await getExpMember(member.id);
    const nextLvlXP = calculateExpForLvl(ExpMember.level + 1);
    const presLvlXP = calculateExpForLvl(ExpMember.level);

    ctx.lineCap = 'round';
    ctx.lineWidth = 50;
    ctx.strokeStyle = '#3ba55d';
    ctx.beginPath();
    ctx.moveTo(50, 255);
    ctx.lineTo(~~((ExpMember.exp - presLvlXP) / (nextLvlXP - presLvlXP) * 700 + 50), 255);
    ctx.stroke();

    ctx.font = 'bold 23px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Уровень: ${ExpMember.level}`, 240, 220);
    ctx.fillText(`XP: ${ExpMember.exp}`, 240, 195);
    ctx.textAlign = 'right';
    ctx.fillText(`След. уровень: ${ExpMember.exp - presLvlXP} / ${nextLvlXP - presLvlXP}`, 750, 220);
    ctx.textAlign = 'left';
}

const maxLengthFormat = (string: string, maxLen: number) => string.length > maxLen ? string.slice(0, maxLen - 2) + '...' : string;