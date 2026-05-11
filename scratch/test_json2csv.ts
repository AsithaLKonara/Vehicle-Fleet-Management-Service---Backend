import { Parser } from 'json2csv';
const parser = new Parser();
const csv = parser.parse([{ a: 1, b: 2 }]);
console.log(csv);
