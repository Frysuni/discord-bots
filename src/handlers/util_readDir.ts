// Чуть более удобное чтение директорий для хендлеров

import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export default (path: string) => {
    return readdirSync(resolve(__dirname, path));
};