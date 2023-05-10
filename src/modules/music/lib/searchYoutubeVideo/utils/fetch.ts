import { get } from 'node:https';

export default function(url: string): Promise<string> {
    return new Promise(resolve => get(url, response => {
        let result = '';
        response.on('data', data => result += data);
        response.on('end', () => resolve(result.toString()));
    }));
}