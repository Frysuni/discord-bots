import { ClientOptions, Client as DiscordClient, GatewayIntentBits } from 'discord.js';
import { EventEmitter } from 'events';
import TypedEmitter from 'typed-emitter';


type ClientLifecycleHooks = 'preRun' | 'commandsSetup';
type TypedEmitterType = TypedEmitter<{ [key in ClientLifecycleHooks]: () => void }>;
type ClientHooksImplementType = TypedEmitterType & { [K in ClientLifecycleHooks]?: boolean }

class ClientHooks extends (EventEmitter as new () => TypedEmitterType) implements ClientHooksImplementType {

  public preRun?: boolean;          // Ахуенно, да? (понять можно только поняв смысл)
  public commandsSetup?: boolean;   // TS v5.0.4
                                    // Репродукция этого говна внизу файла


  emit<E extends ClientLifecycleHooks>(event: E, ...args: Parameters<{ preRun: () => void; commandsSetup: () => void; }[E]>): boolean {
    this[event] = true;
    return super.emit<E>(event, ...args);
  }
}


export class Client extends DiscordClient {
  constructor(options: ClientOptions) {
    super(options);

  }

  hooks = new ClientHooks;
}

export const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
  ],
});


// type Types = 'one' | 'two';
// type MappedType = { [key in Types]?: boolean };
// class Class implements MappedType {
//   one?: true
// }
// new Class().one