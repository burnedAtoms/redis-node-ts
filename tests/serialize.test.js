"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serialize_1 = require("../src/utils/serialize");
test("fn-serialization-simpleString", () => {
    expect((0, serialize_1.Serialize)({ item: "Hello", type: "simple_string" })).toBe("+Hello\r\n");
});
test("fn-serialization-array", () => {
    expect((0, serialize_1.Serialize)({ item: [{ item: 1, type: "number" }], type: "array" })).toBe("*1\r\n:1\r\n");
});
test("fn-serialization-advanceArray", () => {
    expect((0, serialize_1.Serialize)({ item: [{ item: 1, type: "number" },
            { item: "Sorry Try Again", type: "error" },
            { item: [{ item: "Zenroy", type: "bulk_string" }, { item: "Chance", type: "bulk_string" }, { item: "Hello", type: "simple_string" }], type: "array" },
            { item: 0, type: "number" }], type: "array" })).toBe("*4\r\n:1\r\n-Sorry Try Again\r\n*3\r\n$6\r\nZenroy\r\n$6\r\nChance\r\n+Hello\r\n:0\r\n");
});
test("fn-serialization-error", () => {
    expect((0, serialize_1.Serialize)({ item: "Message", type: "error" })).toBe("-Message\r\n");
});
test("fn-serialization", () => {
    expect((0, serialize_1.Serialize)({ item: [{ item: "hello", type: "bulk_string" }, { item: null, type: "bulk_string" }, { item: "world", type: "bulk_string" }], type: "array" })).toBe("*3\r\n$5\r\nhello\r\n$-1\r\n$5\r\nworld\r\n");
});
