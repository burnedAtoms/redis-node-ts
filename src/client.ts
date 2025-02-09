import net from "node:net";
import { createInterface } from "node:readline";
import { Serial, Serialize } from "./utils/serialize.js";
import { DeserializeTransformer } from "./utils/transformers/transformer.js";

const PORT = 6379;
const client = net.createConnection(PORT, "localhost", async () => {
  console.log("Connected to server");
});



client.pipe(new DeserializeTransformer()).pipe(process.stdout);

const rl = createInterface({ input: process.stdin, output: process.stdout });


rl.on("line", (line) => {
  const defaultType = "bulk_string";
  const commandArray = line.split(" ");
  const unserializedCommand: Serial<any> = { item: [], type: "array" }

  commandArray.map((data: string) => {
    (unserializedCommand.item as Record<string, string>[]).push({ item: data, type: defaultType })
  })

  const serializeCommands = Serialize(unserializedCommand);
  client.write(serializeCommands);
});
