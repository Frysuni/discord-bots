import { config } from 'dotenv';
import { from } from 'env-var';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '../', '../', '.env') });
const dotenv = from(process.env);


export const env = {
  token: dotenv.get('TOKEN').required().asString(),
  clientId: dotenv.get('CLIENT_ID').required().asString(),
};