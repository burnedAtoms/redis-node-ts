export type Serial<T> = {
  item: T;
  type: SerializeTypes;
}

export type SerializeTypes = "simple_string" | "bulk_string" | "number" | "array" | "error";


export function Serialize({ item, type }: Serial<any>) {
  const itemType = type;
  let serial = ""
  switch (itemType) {
    case "simple_string":
      serial = "+" + item + "\r\n";
      return serial;
    case "error":
      serial = "-" + (item) + "\r\n";
      return serial;
    case "number":
      serial = ":" + item + "\r\n";
      return serial;
    case "bulk_string": {
      return returnBulkString((item));
    }
    case "array": {
      if (!item) {
        return "*-1\r\n";
      }
      serial += "*" + (item).length + "\r\n";
      (item).map((bulkStr: Serial<any>) => {
        serial += returnArrayItem({item: bulkStr.item, type: bulkStr.type});
      })
      return serial;
    }
  }
}

function returnSimpleString(item: string) {
  const serial = "+" + item + "\r\n";
  return serial;
}
function returnNumber(item: number) {
  const serial = ":" + item + "\r\n";
  return serial;
}
function returnError(item: string) {
  const serial = "-" + item + "\r\n";
  return serial;
}
function returnArray(item: Array<Serial<any>> ){
  if (!item) {
    return "*-1\r\n";
  }
  let serial: string = "*" + item.length + "\r\n";
  item.map((bulkStr: any) => {
    serial += returnArrayItem(bulkStr)!;
  })
  return serial;
}
function returnBulkString(item: string) {
  if (!item) {
    return "$-1\r\n";
  }
  const length = item.length;
  const serial = "$" + length.toString() + "\r\n" + item + "\r\n";
  return serial;
}
function returnArrayItem({item,type}:Serial<any>) {
  if(type === "simple_string"){
    return returnSimpleString(item)
  } else if(type === "number"){
    return returnNumber(item);
  } else if(type === "error"){
    return returnError(item);
  } else if(type === "bulk_string"){
    return returnBulkString(item);
  } else{
    return returnArray(item);
  }
}

