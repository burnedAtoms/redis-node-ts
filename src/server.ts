import net from "node:net";
import { Deserialize } from "./utils/deserialize.js";
import { DeserializeTransformer, ExecuteCommand } from "./utils/transformers/transformer.js";


const PORT = 6379;


const server = net.createServer(async (socket) => {
  const clientStore: Map<string,any> = new Map<string,any>();

  console.log(`client Connected: ${(socket.address() as any)["address"]}:${(socket.address() as any)["port"]}`);
  socket.on("error", (e: Error) => {
    console.log(Deserialize("-" + e.message))
  })

  socket.on("end", () => {
    console.log("Client Disconnected");
  });

  socket.pipe(new DeserializeTransformer()).pipe(new ExecuteCommand(clientStore)).pipe(socket)

});


server.listen(PORT, () => {
  console.log("Server listening on port:", PORT);
})