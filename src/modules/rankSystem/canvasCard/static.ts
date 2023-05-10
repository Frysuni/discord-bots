// Генерирует статичные объекты. Экономит 30% времени за каждое использование /rank

import * as Canvas from '@napi-rs/canvas';
import Logger from '@logger';
import { resolve } from 'node:path';

export default (async function() {
    const canvas = Canvas.createCanvas(800, 300);
    const ctx = canvas.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(50, 0);
    ctx.arc(750, 50, 50, Math.PI / -2, 0);
    ctx.arc(750, 250, 50, Math.PI * 2, Math.PI / 2);
    ctx.arc(50, 250, 50, Math.PI / 2, Math.PI);
    ctx.arc(50, 50, 50, Math.PI, 0);
    ctx.clip();

    const background = await Canvas.loadImage(resolve(__dirname, 'assets', 'background.jpg'));

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.moveTo(50, 10);
    ctx.arc(750, 50, 40, Math.PI / -2, 0);
    ctx.arc(750, 250, 40, Math.PI * 2, Math.PI / 2);
    ctx.arc(50, 250, 40, Math.PI / 2, Math.PI);
    ctx.arc(50, 50, 40, Math.PI, 0);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fill();

    ctx.lineCap = 'round';
    ctx.lineWidth = 50;
    ctx.strokeStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(50, 255);
    ctx.lineTo(750, 255);
    ctx.stroke();

    Logger.Debug('Статичные объекты rankCard сгенерированы.');
    return Canvas.loadImage(canvas.toBuffer('image/png'));
})();

