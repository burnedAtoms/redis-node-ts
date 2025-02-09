type CommandParams = {
  clientStore?: Map<string,any>;
  params?: string[];
}
type CommandType = Record<string, ({clientStore,...params}:CommandParams) => any>;


export const commands: CommandType = {
  PING: PING,
  ECHO: ECHO,
  SET: SET,
  GET: GET,
  DEL: DEL,
}

function PING(): string{
  return "PONG\r\n"
}

function ECHO({clientStore,...params}:CommandParams): string{
  return `${params.params?.join(" ")}\r\n`;
}
function GET({clientStore,...params}:CommandParams){
  const [name] = params.params!;
  const res = clientStore?.get(name) ?? "User does not exist"
  return `${res}\r\n`;
}
function SET({clientStore,...params}:CommandParams) {
  const [name,data] = params.params!;
  if(clientStore && !clientStore.get(name)){
    clientStore.set(name,data)
  }
  return `${name} set to ${data} successfully\r\n`;
}
function DEL({clientStore,...params}:CommandParams){
  const [name] = params.params!;
  if(clientStore && clientStore.get(name)){
    clientStore.delete(name);
    return `${name} deleted\r\n`;
  }
  return `Unable to delete ${name}. Key Does not exist.\r\n`;
}
