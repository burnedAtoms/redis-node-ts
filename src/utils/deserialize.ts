const specialChars = new Set(["*", "-", "+", "$", ":"]);
type Serial<T> = {
  item: T;
  type: SerializeTypes;
}

type SerializeTypes = "simple_string" | "bulk_string" | "number" | "array" | "error";


/**
 * @param serializeString
 * @returns string
 */
export function Deserialize(serializeString: string) {
  const res = serializeString;
  let deserialization: Array<any> = new Array(0);
  if (res === "*-1\r\n" || res === "$-1\r\n") return [null];

  for (let i = 0; i < res.length; i++) {
    let item: Serial<any> = { item: "", type: "simple_string" };

    if((res[i] === "\r" || res[i] === "\n" )) continue;
    if (res[i] === ":") {
      i++;
      item.type = "number";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
      deserialization.push(Number(item.item));
    } else if (res[i] === "-") {
      i++;
      item.type = "error";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
      deserialization.push(item.item);
    } else if (res[i] === "+") {
      i++;
      item.type = "simple_string";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
      deserialization.push(item.item);
    } else if (res[i] === "$") {
      i++;
      let size = "";
      item.type = "bulk_string";
      while (check(res[i]) && res[i] && res[i].match(/^\d+$/)) {
        size += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
      item.item = res.substring(i, i + Number(size));

      i += Number(size);

      deserialization.push(item.item);

    } else if (res[i] === "*") {
      const resArray = deserializeArray(res,i);
      deserialization.push(resArray.value);
      i = (resArray.newIndex as number);
    }
  }

  return deserialization.flat().length > 0 ? deserialization.flat() : [serializeString];
}

function deserializeArray(res:string, i: number):  Record<string,string | number | object | null>  {
  let size: string = "";
  let arryCount = 0;
  i++;
  while(check(res[i]) && res[i] && res[i].match(/^\d+$/)) {
    size += res[i];
    i++;
  }
  i+= check(res[i]) ? 0 : 2;
  arryCount = Number(size);
  const array:any = [];

  console.log(arryCount)

  if(!arryCount && size === ""){
     return {value: null, newIndex: i};
  }
  while (array.length < arryCount) {
    const value = deserializeString(res,i);
    const newIndex = value.newIndex;
    array.push(value.value);
    i = newIndex as number;
  }
  return {value: array, newIndex: i}
}

function deserializeString(res:string, i: number): Record<string,string | number | object | null> {
  let item: Serial<any> = { item: "", type: "simple_string" };
    if(res[i] === "\r" || res[i] === "\n") i++;
    if (res[i] === ":") {
      i++;
      item.type = "number";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
      return {value: Number(item.item),newIndex: i};
    } else if (res[i] === "-") {
      i++;
      item.type = "error";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
    } else if (res[i] === "+") {
      i++;
      item.type = "simple_string";
      while (check(res[i]) && i < res.length) {
        item.item += res[i];
        i++;
      }
      i+= check(res[i]) ? 0 : 2;
    } else if (res[i] === "$") {
      i++;
      let size = "";
      item.type = "bulk_string";
      while (check(res[i]) && res[i] && res[i].match(/^\d+$/)) {
        size += res[i];
        i++;
      }
      i += check(res[i]) ? 0 : 2;
      if(Number(size)){
        item.item = res.substring(i, i + Number(size));
        i+=Number(size);
        i+= check(res[i]) ? 0 : 2;
      } else {
        item.item = null;
        i+=2;
        i+= check(res[i]) ? 0 : 2;
      }
    } else if (res[i] === "*") {
      const resArray = deserializeArray(res,i)
      return {value: resArray.value, newIndex: resArray.newIndex};
    }
    return {value: item.item,newIndex: i};
}

function check(char: string){
  return (char !== "\r" && char !== "\n" );
}