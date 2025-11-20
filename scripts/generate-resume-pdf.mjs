import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3456;
const RESUME_URL = `http://localhost:${PORT}/resume/edit`;

console.log('🚀 Starting PDF generation...');

// Start Next.js dev server
const startServer = () => {
  return new Promise((resolve, reject) => {
    console.log('📦 Starting Next.js server...');
    const server = spawn('npx', ['next', 'dev', '-p', PORT], {
      cwd: join(__dirname, '..'),
      stdio: 'pipe'
    });

    server.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('Ready')) {
        console.log('✅ Server started');
        resolve(server);
      }
    });

    server.stderr.on('data', (data) => {
      // Ignore stderr unless it's critical
    });

    server.on('error', reject);

    // Timeout after 30 seconds
    setTimeout(() => {
      reject(new Error('Server startup timeout'));
    }, 30000);
  });
};

// Generate PDF
const generatePDF = async () => {
  let server;

  try {
    server = await startServer();

    // Wait additional time for server to be fully ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('🌐 Opening browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    console.log(`📄 Navigating to ${RESUME_URL}...`);
    await page.goto(RESUME_URL, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    // Wait for the resume to render
    await page.waitForSelector('.preview', { timeout: 10000 });

    console.log('📸 Generating PDF...');
    const pdfPath = join(__dirname, '../public/resume.pdf');

    await page.pdf({
      path: pdfPath,
      format: 'Letter',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    await browser.close();
    console.log('✅ PDF generated successfully at public/resume.pdf');

  } catch (error) {
    console.error('❌ Error generating PDF:', error);
    process.exit(1);
  } finally {
    if (server) {
      console.log('🛑 Stopping server...');
      server.kill();
    }
  }
};

generatePDF();
