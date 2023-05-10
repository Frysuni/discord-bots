import { Module, ModuleParent } from "@core";
import ExampleCommand from "./commands/example.command";

// For any custom pre-start sync logic
@Module({
  commands: [ExampleCommand],
})
export default class extends ModuleParent {

  // WRONG way, but you can do it. Give preference to importing commands in the decorator!
  // You can change this.commands ONLY in the onInit module lifecycle hook! But it is possible to read after onInit
  // This entry will be overwritten by an array of decorator parameters, if it is set there
  public readonly commands = [new ExampleCommand/* , new AnyCommand() */];


  // No args
  constructor() {
    super();

    // Module resolving lifecycle hook
    // No commands, no events
  }

  public onInit(): void {
    // Module initializated lifecycle hook
    // Commands, events, but client is not ready yet
  }
}