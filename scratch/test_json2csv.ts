import { Parser } from 'json2csv';

try {
  const p = new Parser();
  console.log('Parser created successfully');
} catch (e) {
  console.error('Failed to create Parser:', e);
}
