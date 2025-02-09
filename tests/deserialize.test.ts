import { Deserialize } from "../src/utils/deserialize.js";

test("fn-deserialization", () => { //*4 $5 
  expect(Deserialize("*4\r\n$5\r\nhello\r\n$-1\r\n$10\r\nworld haha\r\n*-1\r\n")).toStrictEqual(["hello",null,"world haha",null]);
})

test("fn-deserialization-error", () => {
  expect(Deserialize("-Error Message\r\n")).toStrictEqual(["Error Message"])
})

test("fn-deserialization-hello", () => {
  expect(Deserialize("+Hello:World\r\n")).toStrictEqual(["Hello:World"])
})

test("fn-deserialization-massive", () => {
  expect(Deserialize("*2\r\n*3\r\n:1\r\n:2\r\n:3\r\n*2\r\n+Hello\r\n-World\r\n")).toStrictEqual([[1,2,3],["Hello","World"]])
})
test("fn-deserialization-emptyArray", () => {
  expect(Deserialize("*0\r\n")).toStrictEqual([]);
})
test("fn-deserialization-to3Array", () => {
  expect(Deserialize("*3\r\n:1\r\n:2\r\n:3\r\n")).toStrictEqual([1,2,3]);
})
test("fn-deserialization-toString2Array", () => {
  expect(Deserialize("*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n")).toStrictEqual(["echo","hello world"]);
})
test("fn-deserialization-null", () => {
  expect(Deserialize("*-1\r\n")).toStrictEqual([null]);
})
test("fn-deserialization-emptyString", () => {
  expect(Deserialize("$0\r\n\r\n")).toStrictEqual([""]);
})
test("fn-deserialization-catRESP", () => {
  expect(Deserialize(("$0\r\n\r\n$3\r\nYOW\r\n+Hello Bredda"))).toStrictEqual(["","YOW","Hello Bredda"]);
})
test("fn-deserialization-catRESP-bulkTest", () => {
  expect(Deserialize(("$3\r\n$$$"))).toStrictEqual(["$$$"]);
})
test("Error string with colon inside should return full error message", () => {
  expect(Deserialize("-Error:Something went wrong")).toStrictEqual(["Error:Something went wrong"]);
});

test("Hard nested RESP message with mixed types", () => {
  const input =
    "*2\r\n" +
    "$4\r\n" +
    "ab+c\r\n" +
    "*3\r\n" +
    ":100\r\n" +
    "$-1\r\n" +
    "+OK:All Good\r\n";

  // Expected deserialization:
  // - Top-level array with two items:
  //   1. A bulk string "ab+c"
  //   2. An array with three items:
  //      a. The number 100
  //      b. A null value (from "$-1")
  //      c. The simple string "OK:All Good"
  const expected = ["ab+c", [100, null, "OK:All Good"]];

  expect(Deserialize(input)).toStrictEqual(expected);
});

test("Bulk string null indicator should return null", () => {
  // According to RESP, "$-1\r\n" indicates a null bulk string.
  expect(Deserialize("$-1\r\n")).toStrictEqual([null]);
});

test("Incomplete bulk string missing trailing CRLF", () => {
  // The input is missing the trailing "\r\n" after the bulk string content.
  const input:string = "$3abc"; 
  // Depending on your design, you might expect an error or a specific output.
  // If your design expects an error or a specific behavior, adjust the expected output accordingly.
  expect(Deserialize(input)).toStrictEqual(["abc"]); // or expect(Deserialize(input)).toStrictEqual(["abc"]);
});
