import axios from 'axios';

async function testExport() {
  try {
    const response = await axios.get('http://localhost:5000/reports/assignments/export', {
      headers: {
        // Need a token here
      }
    });
    console.log('Export Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
  } catch (e: any) {
    console.error('Export Failed:', e.response?.status, e.response?.data);
  }
}

// But I don't have a token. I'll just check if the service itself works with a script that calls the service directly.
