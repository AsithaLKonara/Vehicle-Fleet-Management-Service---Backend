import * as reportService from '../src/services/reportService';
import { prisma } from '../src/lib/prisma';

async function run() {
  try {
    const csv = await reportService.exportAssignmentsCsv();
    console.log('CSV Length:', csv.length);
    console.log('CSV Preview:', csv.substring(0, 100));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
