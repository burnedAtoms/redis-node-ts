import { Transform } from "node:stream";
import { TransformCallback } from "stream";
import { commands } from "../../commands/commands.js";
import { Deserialize } from "../deserialize.js";
import { Serial, Serialize } from "../serialize.js";


export class DeserializeTransformer extends Transform {
  constructor() {
    super();
  }
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    const transformChunk: string = chunk.toString();
    this.push(Deserialize(String(transformChunk)).join(" "));
    callback()
  }
}

export class ExecuteCommand extends Transform {
  clientStore: Map<string,string> = new Map();
  constructor(clientStore: Map<string,string>) {
    super();
    this.clientStore = clientStore;
  }
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    const transformChunk: string = chunk.toString();
    const defaultType = "bulk_string";
    const chunkArray = transformChunk.split(" ");
    if (commands[chunkArray[0].toUpperCase()]) {
      const commandRes = commands[chunkArray[0].toUpperCase()]({clientStore:this.clientStore,params: chunkArray.slice(1)});
      const commandArray = commandRes.toString().split(" ");
      const unserializedCommand: Serial<any> = { item: [], type: "array" }

      commandArray.map((data: string) => {
        (unserializedCommand.item as Record<string, string>[]).push({ item: data, type: defaultType })
      })

      const serializeCommands = Serialize(unserializedCommand);
      this.push(serializeCommands);
    } else {
      this.push(`[${chunkArray[0]}] is not a valid command.\r\n`);
    }
    callback()
  }
}
